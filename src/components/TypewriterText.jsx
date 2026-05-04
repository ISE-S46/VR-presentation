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
        <span className="typewriter-cursor" />
      )}
    </span>
  );
}
