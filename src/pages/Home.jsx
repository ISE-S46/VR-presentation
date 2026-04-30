import { useNavigate } from 'react-router';
import TypewriterText from '../components/TypewriterText';
import AnimatedCounter from '../components/AnimatedCounter';
import etcBuildingImg from '../assets/etc-building.jpg';
import BackButton from '../components/BackButton';
import '../styles/pages/Home.css';

const STATS = [
  { value: 12, suffix: '+', label: 'Active Projects' },
  { value: 6, suffix: '', label: 'Key Partners' },
  { value: 8, suffix: '', label: 'Focus Areas' },
  { value: 2019, suffix: '', label: 'Established' },
];

const BENTO_ITEMS = [
  {
    id: 'Introduction',
    number: '01',
    title: 'Introduction',
    desc: 'About ETC and our mission',
    tagline: 'Who we are & what drives us',
    iconType: 'info',
    featured: true,
    glowColor: 'rgba(31, 122, 107, 0.25)',
    accentColor: 'var(--accent-teal)',
  },
  {
    id: 'OurPartners',
    number: '02',
    title: 'Our Partners',
    desc: 'Who we collaborate with',
    tagline: 'Building bridges together',
    iconType: 'users',
    featured: false,
    glowColor: 'rgba(59, 130, 246, 0.2)',
    accentColor: '#3b82f6',
  },
  {
    id: 'OurProjects',
    number: '03',
    title: 'Our Projects',
    desc: 'Research & development portfolio',
    tagline: 'Innovation in action',
    iconType: 'layers',
    featured: false,
    glowColor: 'rgba(168, 85, 247, 0.2)',
    accentColor: '#a855f7',
  },
  {
    id: 'QnA',
    number: '04',
    title: 'Q&A Chatbot',
    desc: 'Ask us anything',
    tagline: 'Get instant answers',
    iconType: 'message',
    featured: false,
    glowColor: 'rgba(249, 115, 22, 0.2)',
    accentColor: '#f97316',
  },
];

// ==========================================
// Sub-components & Assets
// ==========================================

const ICON_PATHS = {
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  message: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
};

function BentoIcon({ type, color }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[type]}
    </svg>
  );
}

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      {/* Back to Welcome Page */}
      <BackButton onClick={() => navigate('/')} label="Back to Welcome Page" />

      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-orb" aria-hidden="true" />
        <div className="hero-image-container">
          <img
            src={etcBuildingImg}
            alt="The Enabling Technology Collaboratory Building"
            className="hero-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="hero-text-container">
          <h1>
            <TypewriterText text="Enabling Technology Collaboratory" speed={50} delay={400} />
          </h1>
          <p className="hero-desc">
            Research, development, and application of assistive and enabling technologies
            to improve quality of life for persons with disabilities and the elderly.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row stagger-children">
        {STATS.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-number">
              <AnimatedCounter end={stat.value} duration={1800} suffix={stat.suffix} prefix={stat.prefix || ''} />
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bento Navigation Grid */}
      <div className="bento-grid stagger-children">
        {BENTO_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`bento-card glass-card${item.featured ? ' bento-featured' : ''}`}
            onClick={() => navigate(`/${item.id}`)}
            style={{ '--glow-color': item.glowColor, '--accent-color': item.accentColor }}
            aria-label={`Navigate to ${item.title}`}
          >
            {/* Ambient glow layer */}
            <div className="bento-glow" aria-hidden="true" />

            {/* Top row: number + icon */}
            <div className="bento-top">
              <span className="bento-number" aria-hidden="true">{item.number}</span>
              <span className="bento-icon" style={{ color: item.accentColor }}>
                <BentoIcon type={item.iconType} color={item.accentColor} />
              </span>
            </div>

            {/* Text */}
            <div className="bento-body">
              <span className="bento-title">{item.title}</span>
              {item.featured && <p className="bento-tagline">{item.tagline}</p>}
              <span className="bento-desc">{item.desc}</span>
            </div>

            {/* Arrow */}
            <ArrowIcon className="bento-arrow" />

          </button>
        ))}
      </div>
    </div>
  );
}