import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1.25rem',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.4rem 0.85rem',
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border)',
      fontSize: '0.75rem',
      fontFamily: 'Inter, monospace',
      color: 'var(--text-secondary)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      letterSpacing: '0.02em'
    }}>
      <span style={{ opacity: 0.6 }}>{formatDate(time)}</span>
      <span style={{
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums'
      }}>{formatTime(time)}</span>
      <div style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: '#22c55e',
        boxShadow: '0 0 4px rgba(34, 197, 94, 0.5)',
        animation: 'pulse-glow 2s infinite'
      }} />
    </div>
  );
}
