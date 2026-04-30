import { useContext, useState } from 'react';
import { CharacterContext } from '../context/characterContext';
import '../styles/speechControls.css';

export default function SpeechControls() {
  const [text, setText] = useState('');
  const ctx = useContext(CharacterContext);

  const handleSpeak = async () => {
    const value = text.trim() || 'Please type something in the box.';
    await ctx?.speak(value);
  };

  return (
    <div className="uiContainer">
      <textarea
        className="textInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your line here..."
        rows={3}
      />

      <div className="buttonGroup">
        <button className="playBtn" onClick={handleSpeak}>
          Speak
        </button>
      </div>

      <p className="statusText statusHint">
        Use mouse drag to orbit and scroll to zoom.
      </p>

      {!ctx && (
        <p className="statusText statusError">
          Waiting for initialization...
        </p>
      )}
    </div>
  );
}