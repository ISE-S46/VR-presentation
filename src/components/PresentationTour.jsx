import { useCallback, useEffect, useRef, useState } from 'react';
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
      'Our mission is to integrate enabling technologies that drive innovation and create real value for industry. We focus on areas like assistive technology, smart mobility, rehabilitation engineering, and human-computer interaction.',
  },
  {
    route: '/OurPartners',
    title: 'Partners',
    script:
      'Collaboration is at our core. We partner internally across Temasek Polytechnic, and externally with organisations like the Ministry of Education, SkillsFuture Singapore, Changi General Hospital, A.W.S., and Certis.',
  },
  {
    route: '/OurProjects',
    title: 'Projects',
    script:
      "Now, let's look at our work. Our projects are organised into three areas: the full project portfolio, a featured live demo, and opportunities to collaborate with us.",
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
      'This is our featured demo, a Patient Safety V.R. training simulation. It recreates emergency department scenarios in virtual reality, checks that the correct procedures are followed, and records every session for review.',
  },
  {
    route: '/OurProjects/CollaborationOpportunities',
    title: 'Collaborate',
    script:
      'Finally, here is how you can collaborate with us through industry partnerships, academic research, and student projects. Thank you for joining this guided tour of ETC. Please feel free to ask me any questions. If you would like to learn more, you can continue exploring this website at your own pace.',
  },
];

// Kept short because the next page's voice + JS chunk are prefetched during the
// current narration, so there is almost nothing left to wait for.
const RENDER_DELAY = 650; // let the page transition settle before speaking
const STEP_PAUSE = 700; // breathing room after a narration before the next page
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
  '/OurProjects/CollaborationOpportunities': () => import('../pages/CollaborationOpportunities'),
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

  // Imperative mirrors so timers / listeners always read fresh values.
  const activeRef = useRef(false);
  const stepRef = useRef(0);
  const phaseRef = useRef('idle'); // 'idle' | 'speak-pending' | 'speaking' | 'pausing'
  const timers = useRef({ nav: null, watchdog: null, advance: null });

  // Stable handles so the mutually-recursive engine functions can call each
  // other without re-subscribing the broadcast listener on every render.
  const runStepRef = useRef(() => {});
  const advanceRef = useRef(() => {});
  const stopRef = useRef(() => {});

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
      clearTimers();
      window.__etcTourActive = false;
      window.dispatchEvent(new CustomEvent('presentation-tour-state', { detail: { active: false } }));
      setActive(false);

      if (options.returnHome) {
        window.setTimeout(() => navigate('/Home'), 120);
      }
    },
    [clearTimers, navigate]
  );

  const runStep = useCallback(
    (i) => {
      clearTimers();
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
      stopRef.current({ returnHome: true });
      return;
    }
    runStepRef.current(next);
  }, [clearTimers]);

  useEffect(() => {
    runStepRef.current = runStep;
    advanceRef.current = advance;
    stopRef.current = stop;
  }, [runStep, advance, stop]);

  // Drive auto-advance off the avatar's real speaking lifecycle.
  useEffect(() => {
    const onBroadcast = (e) => {
      if (!activeRef.current) return;
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
      document.body.classList.remove('presentation-mode', 'presentation-ambient');
    },
    [clearTimers]
  );

  useEffect(() => {
    document.body.classList.toggle('presentation-mode', active);
    document.body.classList.toggle('presentation-ambient', active && ambientOn);

    return () => {
      document.body.classList.remove('presentation-mode', 'presentation-ambient');
    };
  }, [active, ambientOn]);

  const start = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    phaseRef.current = 'idle';
    stepRef.current = 0;
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

  return (
    <>
      <div className={`tour-cinema-vignette ${ambientOn ? 'is-ambient' : ''}`} aria-hidden="true" />

      <div className="tour-control-bar" role="status" aria-live="polite">
        <span className="tour-live-dot" aria-hidden="true" />
        <div className="tour-control-text">
          <span className="tour-control-label">Now Presenting</span>
          <span className="tour-control-step">
            {stepIndex + 1} / {total} &middot; {current.title}
          </span>
        </div>

        <div className="tour-progress-track" aria-hidden="true">
          <div className="tour-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

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

        <button
          type="button"
          className="tour-stop-btn"
          onClick={stop}
          aria-label="Stop the presentation"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
          <span>Stop</span>
        </button>
      </div>
    </>
  );
}
