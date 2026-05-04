import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';
import '../styles/pages/Projects.css';

const OPPORTUNITIES = [
  {
    icon: '🏢',
    title: 'Industry Partnerships',
    color: '#0d9488',
    desc: 'Co-develop specialized assistive technologies. We provide the research expertise and facilities, while you bring market insights and commercialization pathways.'
  },
  {
    icon: '🎓',
    title: 'Academic Research',
    color: '#7c3aed',
    desc: 'Join forces on grant applications and fundamental research in human-computer interaction, smart mobility, or rehabilitation engineering.'
  },
  {
    icon: '🧑‍🎓',
    title: 'Student Projects',
    color: '#059669',
    desc: 'Sponsor a final-year project or provide internship opportunities. Engage with our talented engineering students to solve real-world accessibility challenges.'
  }
];

export default function CollaborationOpportunities() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Get Involved</span>
        <h1 className="page-title">Collaboration Opportunities</h1>
        <p className="page-subtitle">Partner with ETC to drive impactful innovation</p>
      </div>

      <VRPlaceholder section="Collaboration Opportunities" />

      <div className="content-grid stagger-children collaboration-grid">
        {OPPORTUNITIES.map((opp, index) => (
          <div key={index} className="glass-card collaboration-card">
            <div className="collaboration-header">
              <span className="collaboration-icon">{opp.icon}</span>
              <h3 className="collaboration-title" style={{ color: opp.color }}>{opp.title}</h3>
            </div>
            <p className="collaboration-desc">{opp.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}