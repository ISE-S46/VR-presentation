import { useState } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import ETCChatbot from '../components/ETCChatbot';
import CharacterViewer from '../components/CharacterViewer';
import '../styles/pages/QnA.css';

export default function QnA() {
  const navigate = useNavigate();
  const [latestScript, setLatestScript] = useState("");

  const [revealData, setRevealData] = useState(null);

  // Custom TTS Handler to intercept the timing
  const handleTTSFetch = async (text) => {
    // Fetch the audio manually
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, format: 'wav' }) 
    });

    setRevealData({ text, id: Date.now() });

    return response; 
  };

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/Home')} />

      <div className="page-header">
        <span className="section-label">Talk to Us</span>
        <h1 className="page-title">Interactive Q&A</h1>
        <p className="page-subtitle">Speak directly with our Virtual Assistant, or type your questions below.</p>
      </div>

      <div className="qna-layout">
        {/* Top Section: 3D Character Avatar */}
        <div className="vr-zone glass-card">
          <h2 className="zone-title">Virtual Assistant</h2>
          <p className="zone-subtitle">Talk to our 3D representative about ETC projects and opportunities.</p>
          <div className="vr-container">
            <CharacterViewer
              modelPath="/model/FModel2.glb"
              ttsEndpoint={handleTTSFetch}
              script={latestScript || ""}
              button={false}
            />
          </div>
        </div>

        {/* Bottom Section: Text Chatbot */}
        <div className="chat-zone glass-card" style={{ padding: '2rem' }}>
          <h2 className="zone-title">Text Chat</h2>
          <p className="zone-subtitle">Prefer typing? Ask us anything below.</p>
          <div style={{ height: '400px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <ETCChatbot 
              onResponseReceived={setLatestScript} 
              revealData={revealData} // Pass the reveal signal down
            />
          </div>
        </div>
      </div>
    </div>
  );
}