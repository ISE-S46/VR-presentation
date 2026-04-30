import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';
import '../styles/pages/Projects.css';

const categories = [
  { id: 'ProjectDetail', number: '3.1', title: 'Each Project', desc: 'Browse our extensive portfolio of assistive tech', icon: '📋' },
  { id: 'DemoProject', number: '3.2', title: 'Demo Project', desc: 'Experience a featured smart mobility solution in action', icon: '🎯' },
  { id: 'CollaborationOpportunities', number: '3.3', title: 'Collaboration', desc: 'Learn how to partner with ETC on new initiatives', icon: '🤝' }
];

function ChevronRightIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

export default function OurProjects() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/Home')} />

      <div className="page-header">
        <span className="section-label">Portfolio</span>
        <h1 className="page-title">Our Projects</h1>
        <p className="page-subtitle">Innovating for inclusivity and empowerment</p>
      </div>

      <VRPlaceholder section="Our Projects" />

      <div className="content-grid stagger-children projects-grid">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="glass-card project-category-card"
            onClick={() => navigate(`/OurProjects/${cat.id}`)}
            aria-label={`Explore ${cat.title}`}
          >
            <div className="project-category-header">
              <span className="project-category-icon" aria-hidden="true">{cat.icon}</span>
              <span className="pill-tag pill-tag--teal project-category-badge">{cat.number}</span>
            </div>
            <h2 className="project-category-title">{cat.title}</h2>
            <p className="project-category-desc">{cat.desc}</p>
            <div className="project-explore-link">
              Explore
              <ChevronRightIcon />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}