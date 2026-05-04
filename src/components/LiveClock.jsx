import { useState, useEffect, useMemo } from 'react';
import '../styles/components/LiveClock.css';

const TIME_OPTIONS = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

const CLOCK_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
};

export default function LiveClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = useMemo(() => time.toLocaleDateString('en-US', TIME_OPTIONS), [time]);
  const timeStr = useMemo(() => time.toLocaleTimeString('en-US', CLOCK_OPTIONS), [time]);

  return (
    <div className="live-clock-container">
      <span className="live-clock-date">{dateStr}</span>
      <span className="live-clock-time">{timeStr}</span>
      <div className="live-clock-pulse" />
    </div>
  );
}