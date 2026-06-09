import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import '../styles/components/PresentationTour.css';

/**
 * One-click guided presentation ("Auto-Present").
 *
 * Walks every section in order while the global avatar narrates a fixed script
 * for each page. It advances to the next step when the avatar finishes speaking
 * (detected via the `avatar-status-broadcast` speaking -> idle transition), with
 * a watchdog timer as a safety net so the tour can never stall — even if voice
 * playback is unavailable.
 *
 * Fully self-contained: it only dispatches `avatar-speak-direct` events and
 * reads avatar status broadcasts, so it does not change any existing behaviour.
 */
const TOUR_STEPS = [
  {
    route: '/',
    title: 'Welcome',
    script:
      'Welcome to the Enabling Technology Collaboratory at Temasek Polytechnic. Let me take you on a short guided tour of who we are and what we do.',
  },
  {
    route: '/Home',
    title: 'Home',
    script:
      'ETC is our newest research and development centre, home to four labs: A.I., Immersive Media, I.O.T., and Innovation. We work hand in hand with industry partners across the polytechnic.',
  },
  {
    route: '/Introduction',
    title: 'Introduction',
    script:
      'Our mission is to integrate enabling technologies that drive innovation and create real value for industry. We focus on areas like assistive technology, rehabilitation engineering, human-computer interaction, and wearable devices.',
  },
  {
    route: '/OurPartners',
    title: 'Partners',
    script:
      "Here is the partner wall. This is where ETC's work starts to feel bigger than one lab: schools, hospitals, public agencies, and industry teams all helping ideas get tested in the real world. Let's keep it simple and spotlight a few key names... Ministry of Education Singapore... SkillsFuture SG... Changi General Hospital (SingHealth)... AWS... and Certis.",
  },
  {
    route: '/OurProjects',
    title: 'Projects',
    script:
      "Now, let's look at our work. Explore our full project portfolio, and a featured live demo that you can watch in action.",
  },
  {
    route: '/OurProjects/ProjectDetail',
    title: 'Portfolio',
    script:
      'Here is our project portfolio, spanning healthcare, security, education, and workplace safety. You can search and filter by domain, then open any project for a deeper look. You can even ask me to explain each one.',
  },
  {
    route: '/OurProjects/DemoProject',
    title: 'Featured Demo',
    script:
      "Let's jump into the Patient Safety VR demo. Picture a trainee stepping into a virtual emergency department as a junior doctor. The goal is not just to watch a scene, but to practise the small decisions that keep a patient safe: reading the room, checking the patient's condition, calling for the right medicine, and staying calm when the case starts moving fast. When the medicine arrives, the trainee still has to pause and verify the right drug, the right dose, the right patient, and the right timing before using it. That is the power of this demo: rare, high-pressure moments become repeatable practice. Every run is recorded too, so learners can replay what happened, catch missed steps, and improve before they face a real emergency.",
  },
];

// Spoken over the closing scene once the demo has been presented.
const CLOSING_SCRIPT =
  'Thank you so much for exploring the Enabling Technology Collaboratory with me. I really appreciate your time. If you have any questions at all, please feel free to ask me—I am here to help.';

// Total time the closing scene stays up (settle + narration + hold) before the
// tour fully ends.
const CLOSING_TOTAL_MS = 14500;

// Kept short because the next page's voice + JS chunk are prefetched during the
// current narration, so there is almost nothing left to wait for.
const RENDER_DELAY = 1200; // let the new page settle and breathe before speaking
const STEP_PAUSE = 850; // breathing room after a narration before the next page
const WATCHDOG_BUFFER = 9000; // safety net beyond the estimated narration length

const estimateMs = (text) => Math.max(4500, (text.length / 12.8) * 1000);

// Warm the next route's lazy-loaded chunk so navigation is instant. Paths must
// match the dynamic imports in App.jsx so Vite resolves them to the same chunk.
const ROUTE_CHUNKS = {
  '/': () => import('../pages/LandingPage'),
  '/Home': () => import('../pages/Home'),
  '/Introduction': () => import('../pages/Introduction'),
  '/OurPartners': () => import('../pages/OurPartners'),
  '/OurProjects': () => import('../pages/OurProjects'),
  '/OurProjects/ProjectDetail': () => import('../pages/ProjectDetail'),
  '/OurProjects/DemoProject': () => import('../pages/DemoProject'),
};

const prefetchRoute = (route) => {
  ROUTE_CHUNKS[route]?.().catch(() => {});
};

// Ask the avatar to pre-generate (and cache) a script's audio ahead of time.
const prefetchVoice = (text) => {
  window.dispatchEvent(new CustomEvent('avatar-prefetch-tts', { detail: { text } }));
};

export default function PresentationTour() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ambientOn, setAmbientOn] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [closing, setClosing] = useState(false);

  // Imperative mirrors so timers / listeners always read fresh values.
  const activeRef = useRef(false);
  const stepRef = useRef(0);
  const phaseRef = useRef('idle'); // 'idle' | 'speak-pending' | 'speaking' | 'pausing'
  const timers = useRef({ nav: null, watchdog: null, advance: null });
  const dropdownRef = useRef(null);
  const isPausedRef = useRef(false);

  // Stable handles so the mutually-recursive engine functions can call each
  // other without re-subscribing the broadcast listener on every render.
  const runStepRef = useRef(() => {});
  const advanceRef = useRef(() => {});
  const stopRef = useRef(() => {});
  const startClosingRef = useRef(() => {});

  const clearTimers = useCallback(() => {
    const t = timers.current;
    ['nav', 'watchdog', 'advance'].forEach((key) => {
      if (t[key]) {
        clearTimeout(t[key]);
        t[key] = null;
      }
    });
  }, []);

  const stop = useCallback(
    (options = {}) => {
      activeRef.current = false;
      phaseRef.current = 'idle';
      isPausedRef.current = false;
      setIsPaused(false);
      setClosing(false);
      clearTimers();
      window.__etcTourActive = false;
      window.dispatchEvent(new CustomEvent('presentation-tour-state', { detail: { active: false } }));
      setActive(false);
      setShowDropdown(false);

      if (options.returnHome) {
        window.setTimeout(() => navigate('/Home'), 120);
      }
    },
    [clearTimers, navigate]
  );

  const runStep = useCallback(
    (i) => {
      clearTimers();
      isPausedRef.current = false;
      setIsPaused(false);
      stepRef.current = i;
      setStepIndex(i);
      phaseRef.current = 'speak-pending';
      window.dispatchEvent(
        new CustomEvent('presentation-tour-state', {
          detail: {
            active: true,
            stepIndex: i,
            total: TOUR_STEPS.length,
            title: TOUR_STEPS[i].title,
          },
        })
      );
      navigate(TOUR_STEPS[i].route);

      // Prefetch the NEXT step's voice + JS chunk now, so they finish generating
      // while this step is still narrating and the next transition feels instant.
      const nextStep = TOUR_STEPS[i + 1];
      if (nextStep) {
        prefetchVoice(nextStep.script);
        prefetchRoute(nextStep.route);
      } else {
        prefetchVoice(CLOSING_SCRIPT);
        prefetchRoute('/Home');
      }

      timers.current.nav = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('avatar-speak-direct', { detail: { text: TOUR_STEPS[i].script } })
        );
        // Safety net: advance even if the speaking/idle cycle never arrives.
        timers.current.watchdog = setTimeout(
          () => advanceRef.current(),
          estimateMs(TOUR_STEPS[i].script) + WATCHDOG_BUFFER
        );
      }, RENDER_DELAY);
    },
    [clearTimers, navigate]
  );

  const advance = useCallback(() => {
    if (!activeRef.current) return;
    clearTimers();
    const next = stepRef.current + 1;
    if (next >= TOUR_STEPS.length) {
      // Demo was the last step — play the closing scene instead of just stopping.
      startClosingRef.current();
      return;
    }
    runStepRef.current(next);
  }, [clearTimers]);

  // Closing scene: leave the demo page, show a "thank you" card, have the avatar
  // give a short sign-off, then end the tour.
  const startClosing = useCallback(() => {
    clearTimers();
    phaseRef.current = 'closing';
    isPausedRef.current = false;
    setIsPaused(false);
    setShowDropdown(false);
    setClosing(true);
    navigate('/Home'); // unmount the demo page so its video spotlight clears

    timers.current.nav = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('avatar-speak-direct', { detail: { text: CLOSING_SCRIPT } })
      );
    }, 120);

    timers.current.watchdog = setTimeout(() => {
      setClosing(false);
      stopRef.current();
    }, CLOSING_TOTAL_MS);
  }, [clearTimers, navigate]);

  const handlePrev = useCallback(() => {
    if (stepIndex > 0) {
      runStep(stepIndex - 1);
    }
  }, [stepIndex, runStep]);

  const handleNext = useCallback(() => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      runStep(stepIndex + 1);
    }
  }, [stepIndex, runStep]);

  const pause = useCallback(() => {
    if (!activeRef.current || isPausedRef.current) return;
    isPausedRef.current = true;
    setIsPaused(true);
    clearTimers();
    window.dispatchEvent(new CustomEvent('avatar-pause-playback'));
  }, [clearTimers]);

  const resume = useCallback(() => {
    if (!activeRef.current || !isPausedRef.current) return;
    isPausedRef.current = false;
    setIsPaused(false);
    window.dispatchEvent(new CustomEvent('avatar-resume-playback'));

    if (phaseRef.current === 'speak-pending') {
      runStepRef.current(stepRef.current);
    } else if (phaseRef.current === 'speaking') {
      const remainingMs = estimateMs(TOUR_STEPS[stepRef.current].script) + WATCHDOG_BUFFER;
      timers.current.watchdog = setTimeout(() => advanceRef.current(), remainingMs);
    } else if (phaseRef.current === 'pausing') {
      timers.current.advance = setTimeout(() => advanceRef.current(), STEP_PAUSE);
    }
  }, []);

  useEffect(() => {
    runStepRef.current = runStep;
    advanceRef.current = advance;
    stopRef.current = stop;
    startClosingRef.current = startClosing;
  }, [runStep, advance, stop, startClosing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', clickOutside);
    }
    return () => document.removeEventListener('mousedown', clickOutside);
  }, [showDropdown]);

  // Drive auto-advance off the avatar's real speaking lifecycle.
  useEffect(() => {
    const onBroadcast = (e) => {
      if (!activeRef.current || isPausedRef.current) return;
      const status = e.detail?.status;

      if (phaseRef.current === 'speak-pending' && status === 'speaking') {
        phaseRef.current = 'speaking';
      } else if (phaseRef.current === 'speaking' && status === 'idle') {
        phaseRef.current = 'pausing';
        if (timers.current.advance) clearTimeout(timers.current.advance);
        timers.current.advance = setTimeout(() => advanceRef.current(), STEP_PAUSE);
      }
    };

    window.addEventListener('avatar-status-broadcast', onBroadcast);
    return () => window.removeEventListener('avatar-status-broadcast', onBroadcast);
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      window.__etcTourActive = false;
      document.body.classList.remove('presentation-mode', 'presentation-ambient', 'presentation-closing');
    },
    [clearTimers]
  );

  useEffect(() => {
    document.body.classList.toggle('presentation-mode', active);
    document.body.classList.toggle('presentation-ambient', active && ambientOn);
    document.body.classList.toggle('presentation-closing', active && closing);

    return () => {
      document.body.classList.remove('presentation-mode', 'presentation-ambient', 'presentation-closing');
    };
  }, [active, ambientOn, closing]);

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    phaseRef.current = 'idle';
    stepRef.current = 0;
    isPausedRef.current = false;
    setIsPaused(false);
    window.__etcTourActive = true;
    window.dispatchEvent(
      new CustomEvent('presentation-tour-state', {
        detail: {
          active: true,
          stepIndex: 0,
          total: TOUR_STEPS.length,
          title: TOUR_STEPS[0].title,
        },
      })
    );
    setActive(true);
    setStepIndex(0);
    runStepRef.current(0);
  }, []);

  const total = TOUR_STEPS.length;
  const current = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];
  const progressPct = ((stepIndex + 1) / total) * 100;

  if (!active) {
    return (
      <button
        type="button"
        className="tour-start-btn"
        onClick={start}
        aria-label="Start the auto-guided presentation"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
        <span className="tour-start-copy">
          <span>Start Presentation</span>
          <small>Guided avatar tour</small>
        </span>
      </button>
    );
  }

  if (closing) {
    return createPortal(
      <div className="tour-closing" style={{ '--closing-duration': `${CLOSING_TOTAL_MS}ms` }} role="status">
        <div className="tour-closing-inner">
          <span className="tour-closing-eyebrow">Thank you for joining us</span>
          <h2 className="tour-closing-title">
            Enabling Technology
            <br />
            Collaboratory
          </h2>
          <p className="tour-closing-sub">Innovating together for a better tomorrow.</p>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <>
      <div className={`tour-cinema-vignette ${ambientOn ? 'is-ambient' : ''}`} aria-hidden="true" />

      <div className="tour-control-bar" role="status" aria-live="polite">
        {/* Progress Track at the top edge */}
        <div className="tour-progress-track" aria-hidden="true">
          <div className="tour-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Left Section: Live Dot & Step Dropdown */}
        <div className="tour-control-section tour-control-section--left">
          <span className="tour-live-dot" aria-hidden="true" />
          
          <div className="tour-selector-container" ref={dropdownRef}>
            <button
              type="button"
              className={`tour-control-selector ${showDropdown ? 'active' : ''}`}
              onClick={() => setShowDropdown((val) => !val)}
              aria-label="Choose presentation step"
              aria-haspopup="listbox"
              aria-expanded={showDropdown}
            >
              <div className="tour-control-text">
                <span className="tour-control-label">
                  Now Presenting
                  <svg className="tour-caret-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
                <span className="tour-control-step">
                  {stepIndex + 1} / {total} &middot; {current.title}
                </span>
              </div>
            </button>

            {showDropdown && (
              <div className="tour-steps-dropdown" role="listbox">
                {TOUR_STEPS.map((step, idx) => (
                  <button
                    key={step.route}
                    type="button"
                    role="option"
                    aria-selected={idx === stepIndex}
                    className={`tour-dropdown-item ${idx === stepIndex ? 'active' : ''}`}
                    onClick={() => {
                      runStep(idx);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="step-num">{idx + 1}</span>
                    <span className="step-title">{step.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Playback navigation controls */}
        <div className="tour-control-section tour-control-section--center">
          {/* Previous Button */}
          <button
            type="button"
            className="tour-nav-btn tour-prev-btn"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            aria-label="Previous step"
            title="Previous Step"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Pause / Continue Button */}
          <button
            type="button"
            className={`tour-pause-btn ${isPaused ? 'paused' : ''}`}
            onClick={isPaused ? resume : pause}
            aria-label={isPaused ? 'Continue presentation' : 'Pause presentation'}
            title={isPaused ? 'Continue Presentation' : 'Pause Presentation'}
          >
            {isPaused ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="5" y="4" width="4" height="16" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button
            type="button"
            className="tour-nav-btn tour-next-btn"
            onClick={handleNext}
            disabled={stepIndex === total - 1}
            aria-label="Next step"
            title="Next Step"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Right Section: Utility controls */}
        <div className="tour-control-section tour-control-section--right">
          {/* Ambient Toggle Button */}
          <button
            type="button"
            className={`tour-ambient-btn ${ambientOn ? 'active' : ''}`}
            onClick={() => setAmbientOn((value) => !value)}
            aria-label={ambientOn ? 'Turn ambient visual off' : 'Turn ambient visual on'}
            aria-pressed={ambientOn}
            title={ambientOn ? 'Ambient visual on' : 'Ambient visual off'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v18"></path>
              <path d="M5 8v8"></path>
              <path d="M19 8v8"></path>
              <path d="M8.5 5.5v13"></path>
              <path d="M15.5 5.5v13"></path>
            </svg>
          </button>

          {/* Stop Button */}
          <button
            type="button"
            className="tour-stop-btn"
            onClick={stop}
            aria-label="Stop the presentation"
            title="Stop Presentation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
