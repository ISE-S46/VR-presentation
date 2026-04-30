export default function BackButton({ onClick, label = "Back" }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 0.9rem',
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        fontSize: '0.85rem',
        fontWeight: '500',
        fontFamily: 'Inter, sans-serif',
        marginBottom: '1rem',
        transition: 'all var(--transition)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--accent-teal)';
        e.currentTarget.style.background = 'rgba(13, 148, 136, 0.05)';
        e.currentTarget.style.transform = 'translateX(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      {label}
    </button>
  );
}
