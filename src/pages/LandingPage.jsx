import { useNavigate } from 'react-router';
import '../styles/pages/LandingPage.css';

function ArrowRightIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container animate-fade-in">
      <div className="landing-glow-top" />
      <div className="landing-glow-bottom" />

      <div className="landing-content">
        <div className="landing-header">
          <h2 className="landing-subtitle stagger-item">Welcome to</h2>
          <h1 className="landing-title stagger-item">
            Enabling Technology<br />
            <span className="text-gradient">Collaboratory</span>
          </h1>
        </div>

        <div className="landing-footer stagger-item">
          <button
            className="btn-glass-primary"
            onClick={() => navigate('/Home')}
            aria-label="Get to know ETC more"
          >
            <span className="btn-text">Let's get to know ETC more</span>
            <ArrowRightIcon className="btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}