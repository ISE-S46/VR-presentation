import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';

export default function OurProjects({ navigate }) {
  const categories = [
    { id: 'ProjectDetail', number: '3.1', title: 'Each Project', desc: 'Browse our extensive portfolio of assistive tech', icon: '📋' },
    { id: 'DemoProject', number: '3.2', title: 'Demo Project', desc: 'Experience a featured smart mobility solution in action', icon: '🎯' },
    { id: 'CollaborationOpportunities', number: '3.3', title: 'Collaboration', desc: 'Learn how to partner with ETC on new initiatives', icon: '🤝' }
  ];

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('Home')} />

      <div className="page-header">
        <span className="section-label">Portfolio</span>
        <h1 className="page-title">Our Projects</h1>
        <p className="page-subtitle">Innovating for inclusivity and empowerment</p>
      </div>

      <VRPlaceholder section="Our Projects" />

      <div className="content-grid stagger-children" style={{ marginTop: '1.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="glass-card"
            onClick={() => navigate(cat.id)}
            style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
              <span className="pill-tag pill-tag--teal" style={{ fontSize: '0.75rem' }}>{cat.number}</span>
            </div>
            <h2 style={{ color: 'var(--text-heading)', margin: 0, fontSize: '1.2rem' }}>{cat.title}</h2>
            <p style={{ lineHeight: '1.55', fontSize: '0.9rem' }}>{cat.desc}</p>
            <div style={{
              marginTop: 'auto',
              paddingTop: '0.4rem',
              color: 'var(--accent-teal)',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              Explore
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
