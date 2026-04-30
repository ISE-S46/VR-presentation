import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';

export default function DemoProject({ navigate }) {
  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Live Demo</span>
        <h1 className="page-title">Featured Demo</h1>
        <p className="page-subtitle">Smart Wheelchair Navigation System</p>
      </div>

      <VRPlaceholder section="Demo Project" />

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <div style={{
          height: '240px',
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(13,148,136,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(13,148,136,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            pointerEvents: 'none'
          }} />
          <span style={{ fontSize: '3.5rem', position: 'relative', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>🦽 🤖</span>
        </div>

        <h2 style={{ color: 'var(--text-heading)', marginBottom: '0.5rem' }}>How it works</h2>
        <p style={{ lineHeight: '1.75', fontSize: '0.92rem' }}>
          This demonstration highlights our integration of LiDAR sensors and Computer Vision (CV)
          algorithms onto a standard motorized wheelchair. The system automatically detects obstacles
          in real-time and gently corrects the user's path, preventing collisions while maintaining
          user autonomy.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.2rem' }}>
          {['LiDAR', 'Computer Vision', 'Real-time', 'Autonomous'].map(tag => (
            <span key={tag} className="pill-tag pill-tag--teal">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
