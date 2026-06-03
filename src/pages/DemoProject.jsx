import { useState } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import AvatarExplainButton from '../components/AvatarExplainButton';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import '../styles/pages/Projects.css';

const DEMO_HIGHLIGHTS = [
  { value: 'VR Simulation', label: 'Emergency Scenario' },
  { value: 'Verification', label: 'Step-by-step checks' },
  { value: 'Procedure', label: 'Verify medicine orders' },
  { value: 'Video Log', label: 'Review & self-improvement' },
];

export default function DemoProject() {
  const navigate = useNavigate();
  const [videoFailed, setVideoFailed] = useState(false);
  const avatarState = useAvatarStatus();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Live Demo</span>
        <h1 className="page-title">Featured Demo</h1>
        <p className="page-subtitle">Experience a featured serious training simulation in action</p>
      </div>

      <div className="glass-card demo-section">
        <div className="demo-video-wrapper">
          {!videoFailed ? (
            <video
              className="demo-video"
              controls
              autoPlay
              muted
              loop
              playsInline
              src="/demo-video.mp4"
              onError={() => setVideoFailed(true)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="demo-video-fallback" role="status">
              <h2>Demo video unavailable</h2>
              <p>The patient safety serious training summary is still available below.</p>
            </div>
          )}
        </div>

        <div className="demo-highlight-grid">
          {DEMO_HIGHLIGHTS.map((item) => (
            <div key={item.value} className="demo-highlight-item">
              <span className="demo-highlight-value">{item.value}</span>
              <span className="demo-highlight-label">{item.label}</span>
            </div>
          ))}
        </div>

        <h2 className="demo-content-title">How it works</h2>
        <AvatarExplainButton
          projectName="PatientSafetyVR"
          projectTitle="Patient Safety VR Training (Featured Demo)"
          customPrompt="Summarize the Patient Safety VR Training featured demo briefly and concisely (under 3 sentences) in English. Explain that it simulates emergency department incidents in VR because these events are rare but critical. Mention that it verifies procedural steps like checking medicine upon delivery, and records the session for review and self-improvement."
          avatarState={avatarState}
          style={{ marginBottom: '1rem' }}
        />
        <p className="demo-content-desc">
          This featured demo showcases an emergency department simulation in Virtual Reality (VR). Since critical emergency incidents do not occur frequently, the simulation is designed to test how personnel respond in real-world scenarios and verify if correct procedural steps are performed (for example, verifying medications upon delivery). Every session is video-recorded to log performance and provide feedback for continuous self-improvement.
        </p>

        <div className="demo-tag-container">
          {['Virtual Reality', 'Emergency Protocol', 'Patient Safety', 'Video Feedback'].map(tag => (
            <span key={tag} className="pill-tag pill-tag--teal">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
