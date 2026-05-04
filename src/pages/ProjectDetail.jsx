import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';
import '../styles/pages/Projects.css';

const projects = [
  { title: 'Smart Wheelchair Navigation', desc: 'LiDAR + CV for autonomous obstacle avoidance', tag: 'Smart Mobility', color: '#0d9488' },
  { title: 'Eye-Gaze AAC Device', desc: 'Communication device controlled entirely by eye movements', tag: 'Assistive Tech', color: '#7c3aed' },
  { title: 'Smart Prosthetic Hand', desc: 'EMG-controlled bionic hand with tactile feedback', tag: 'Rehabilitation', color: '#059669' },
  { title: 'Cognitive Training Platform', desc: 'Gamified exercises for early dementia intervention', tag: 'Software', color: '#6366f1' }
];

export default function ProjectDetail() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Research & Dev</span>
        <h1 className="page-title">Project Portfolio</h1>
        <p className="page-subtitle">A showcase of our research and development</p>
      </div>

      <VRPlaceholder section="Each Project" />

      <div className="stagger-children project-list">
        {projects.map((proj, index) => (
          <div key={index} className="glass-card project-item-card">
            <div className="project-item-content">
              <h3 className="project-item-title">{proj.title}</h3>
              <p className="project-item-desc">{proj.desc}</p>
            </div>
            <span
              className="project-tag"
              style={{
                background: `${proj.color}10`,
                color: proj.color
              }}
            >
              {proj.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}