import { useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import introLabImage from '../assets/intro-lab.jpg';
import '../styles/pages/Introduction.css';

const FOCUS_AREAS = [
  { name: 'Assistive Technology', desc: 'Inclusive tools that improve daily independence.', icon: 'heart' },
  { name: 'Rehabilitation Engineering', desc: 'Applied prototypes for recovery and clinical support.', icon: 'hexagon' },
  { name: 'Human-Computer Interaction', desc: 'Interfaces that make complex technology easier to use.', icon: 'monitor' },
  { name: 'Wearable Devices', desc: 'Sensor-led devices for monitoring and feedback.', icon: 'watch' },
  { name: 'Smart Home Systems', desc: 'Ambient intelligence for accessible living spaces.', icon: 'home' },
  { name: 'Sensory Substitution', desc: 'Alternative feedback channels for perception and access.', icon: 'eye' },
  { name: 'Robotics & Automation', desc: 'Automation that supports people, training, and operations.', icon: 'cpu' },
];

const INTRO_STATS = [
  { value: '8', label: 'Focus areas' },
  { value: 'AI + IoT', label: 'Applied technology stack' },
  { value: 'XR', label: 'Immersive test-bedding' },
  { value: 'Industry', label: 'Collaboration driven' },
];

const ICON_PATHS = {
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>,
  hexagon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></>,
  watch: <><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path></>,
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>,
  cpu: <><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></>,

  mission: (
    <>
      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
      <path d="M2 17l10 5 10-5"></path>
      <path d="M2 12l10 5 10-5"></path>
    </>
  ),
  focus: (
    <>
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </>
  )
};

function Icon({ name, width = 22, height = 22 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function Introduction() {
  const navigate = useNavigate();
  const cardRefs = useRef([]);
  const { playHoverSound, playClickSound } = useSoundEffects();
  const avatarState = useAvatarStatus();

  useEffect(() => {
    if (avatarState.status !== 'speaking') return undefined;

    const startScrollY = window.scrollY;
    const maxScrollY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const scrollDistance = maxScrollY - startScrollY;
    if (scrollDistance <= 12) return undefined;

    const durationMs = Math.max(3500, (avatarState.durationMs || 9000) * 0.9);
    const startedAt = performance.now();
    let frameId;

    const animateScroll = (now) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startScrollY + scrollDistance * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateScroll);
      }
    };

    frameId = requestAnimationFrame(animateScroll);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [avatarState.durationMs, avatarState.status]);

  const handleNavClick = (path) => {
    playClickSound();
    navigate(path);
  };

  const handleMouseMove = useCallback((e) => {
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  return (
    <div className="page-container" onMouseMove={handleMouseMove}>
      <BackButton onClick={() => handleNavClick('/Home')} />

      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">About Us</span>
        <h1 className="page-title">Introduction</h1>
        <p className="page-subtitle">Applied research, immersive technology, and industry collaboration in one test-bedding space.</p>
      </motion.div>

      <motion.div
        className="intro-layout"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section className="intro-hero-panel" variants={itemVariants}>
          <div className="intro-hero-copy">
            <div className="mission-header">
              <div className="mission-icon">
                <Icon name="mission" width="24" height="24" />
              </div>
              <span className="intro-kicker">Enabling Technology Collaboratory</span>
            </div>
            <h2 className="mission-title">Turning emerging technology into real-world solutions.</h2>
            <p className="mission-text">
              ETC is a multidisciplinary centre where AI, IoT, immersive media, and enabling technologies are prototyped, tested, and shaped with industry partners.
            </p>
            <div className="mission-points" aria-label="ETC mission highlights">
              <span>Applied research for industry challenges</span>
              <span>Test-bedding space for validation</span>
              <span>Human-centred technology outcomes</span>
            </div>
          </div>

          <div className="intro-hero-media" aria-label="ETC lab environment">
            <img src={introLabImage} alt="ETC lab environment with immersive technology setup" />
            <div className="intro-media-caption">
              <span className="intro-media-dot"></span>
              Innovation space for applied prototyping
            </div>
          </div>
        </motion.section>

        <motion.div className="intro-stats-row" variants={itemVariants}>
          {INTRO_STATS.map((stat) => (
            <div className="intro-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Focus Areas Section */}
        <motion.div className="focus-section" variants={itemVariants}>
          <div className="focus-header">
            <div className="focus-header-icon">
              <Icon name="focus" width="24" height="24" />
            </div>
            <h2 className="focus-title">Focus Areas</h2>
          </div>

          <div className="focus-grid">
            {FOCUS_AREAS.map((area, index) => (
              <motion.div
                key={area.name}
                className="focus-card"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={playHoverSound}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <div className="focus-icon-wrapper">
                  <Icon name={area.icon} />
                </div>
                <div className="focus-card-copy">
                  <span className="focus-card-text">{area.name}</span>
                  <span className="focus-card-desc">{area.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
