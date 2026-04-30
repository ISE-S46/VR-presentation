import { useContext, useState } from 'react';
import { CharacterContext } from '../context/characterContext';
import '../styles/speakButton.css';

interface SpeakButtonProps {
  audioUrl: string;
  script: string;
}

export default function SpeakButton({ audioUrl, script }: SpeakButtonProps) {
  const ctx = useContext(CharacterContext);
  const [playing, setPlaying] = useState(false);

  const handleClick = async () => {
    if (!ctx || playing) return;
    setPlaying(true);
    try {
      await ctx.speakLocal(audioUrl, script);
    } finally {
      setPlaying(false);
    }
  };

  return (
    <div className="speak-minimal-wrapper">
      <button
        onClick={handleClick}
        className={`speak-minimal-btn ${playing ? 'playing' : ''}`}
        title="Click to speak"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      </button>
    </div>
  );
}