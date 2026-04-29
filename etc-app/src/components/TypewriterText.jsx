import { useState, useEffect } from 'react';

export default function TypewriterText({ text, speed = 60, delay = 300 }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [displayed, started, text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          background: 'var(--accent-teal)',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          animation: 'blink-cursor 0.8s step-end infinite'
        }} />
      )}
    </span>
  );
}
