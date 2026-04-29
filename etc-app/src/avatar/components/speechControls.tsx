import { useContext, useState } from 'react';
import { CharacterContext } from '../context/characterContext';

export default function SpeechControls() {
  const [text, setText] = useState('');
  const ctx = useContext(CharacterContext);

  const handleSpeak = async () => {
    const value = text.trim() || 'Please type something in the box.';
    await ctx?.speak(value);
  };

  return (
    <div className="ui-container">
      <textarea
        id="textInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your line here..."
        rows={3}
      />

      <div className="button-group">
        <button id="playbtn" onClick={handleSpeak}>
          Speak
        </button>
      </div>

      <p className="status-text status-hint">
        Use mouse drag to orbit and scroll to zoom.
      </p>

      {!ctx && (
        <p className="status-text status-error">
          Waiting for initialization...
        </p>
      )}
    </div>
  );
}