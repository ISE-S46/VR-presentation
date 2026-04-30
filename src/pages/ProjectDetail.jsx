import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';

export default function ProjectDetail({ navigate }) {
  const projects = [
    { title: 'Smart Wheelchair Navigation', desc: 'LiDAR + CV for autonomous obstacle avoidance', tag: 'Smart Mobility', color: '#0d9488' },
    { title: 'Eye-Gaze AAC Device', desc: 'Communication device controlled entirely by eye movements', tag: 'Assistive Tech', color: '#7c3aed' },
    { title: 'Smart Prosthetic Hand', desc: 'EMG-controlled bionic hand with tactile feedback', tag: 'Rehabilitation', color: '#059669' },
    { title: 'Cognitive Training Platform', desc: 'Gamified exercises for early dementia intervention', tag: 'Software', color: '#6366f1' }
  ];

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Research & Dev</span>
        <h1 className="page-title">Project Portfolio</h1>
        <p className="page-subtitle">A showcase of our research and development</p>
      </div>

      <VRPlaceholder section="Each Project" />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginTop: '1.5rem'
      }} className="stagger-children">
        {projects.map((proj, index) => (
          <div key={index} className="glass-card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem' }}>{proj.title}</h3>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{proj.desc}</p>
            </div>
            <span style={{
              background: `${proj.color}10`,
              color: proj.color,
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.78rem',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              {proj.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
