export default function VRPlaceholder({ section, className, style }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        minHeight: '260px',
        background: 'linear-gradient(145deg, rgba(245,245,247,0.8), rgba(229,231,235,0.4))',
        border: '1.5px dashed rgba(148, 163, 184, 0.25)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        flexDirection: 'column',
        gap: '0.6rem',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <div style={{
        position: 'absolute',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,148,136,0.05), transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ fontSize: '2.2rem', lineHeight: 1, position: 'relative' }}>🧑‍🚀</div>

      <p style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 600,
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        position: 'relative'
      }}>Virtual Assistant Area</p>

      <span style={{
        fontSize: '0.75rem',
        opacity: 0.5,
        position: 'relative',
        background: 'rgba(148, 163, 184, 0.08)',
        padding: '0.2rem 0.65rem',
        borderRadius: 'var(--radius-pill)'
      }}>Section: {section}</span>
    </div>
  );
}
