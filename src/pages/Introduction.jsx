import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/Introduction.css';

const FOCUS_AREAS = [
  { name: 'Assistive Technology', icon: 'heart' },
  { name: 'Smart Mobility', icon: 'activity' },
  { name: 'Rehabilitation Engineering', icon: 'hexagon' },
  { name: 'Human-Computer Interaction', icon: 'monitor' },
  { name: 'Wearable Devices', icon: 'watch' },
  { name: 'Smart Home Systems', icon: 'home' },
  { name: 'Sensory Substitution', icon: 'eye' },
  { name: 'Robotics & Automation', icon: 'cpu' },
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

export default function Introduction() {
  const navigate = useNavigate();
  const cardRefs = useRef([]);

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
    <div className="page-container animate-fade-in" onMouseMove={handleMouseMove}>
      <BackButton onClick={() => navigate('/Home')} />

      <div className="page-header">
        <span className="section-label">About Us</span>
        <h1 className="page-title">Introduction</h1>
        <p className="page-subtitle">Welcome to the Enabling Technology Collaboratory</p>
      </div>

      <div className="intro-layout">
        {/* Our Mission Section */}
        <div className="mission-card">
          <div className="mission-header">
            <div className="mission-icon">
              <Icon name="mission" width="24" height="24" />
            </div>
            <h2 className="mission-title">Our Mission</h2>
          </div>
          <p className="mission-text">
            Research, development, and application of assistive and enabling technologies
            to improve quality of life for persons with disabilities and the elderly. We strive
            to push the boundaries of innovation to create accessible, inclusive futures for everyone.
          </p>
        </div>

        {/* Focus Areas Section */}
        <div className="focus-section">
          <div className="focus-header">
            <div className="focus-header-icon">
              <Icon name="focus" width="24" height="24" />
            </div>
            <h2 className="focus-title">Focus Areas</h2>
          </div>

          <div className="focus-grid">
            {FOCUS_AREAS.map((area, index) => (
              <div
                key={area.name}
                className="focus-card stagger-item"
                style={{ animationDelay: `${index * 0.05}s` }}
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <div className="focus-icon-wrapper">
                  <Icon name={area.icon} />
                </div>
                <span className="focus-card-text">{area.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}