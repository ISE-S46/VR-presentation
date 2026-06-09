import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import AvatarExplainButton from '../components/AvatarExplainButton';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import '../styles/pages/Projects.css';

const SHOW_PAGE_DELAY = 1200; // show the demo page first, THEN pop the video
const SPOTLIGHT_EXIT_MS = 440; // matches the CSS fade-out

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

  // While the avatar narrates this page, spotlight the demo video by popping it
  // to the centre of the screen over a dimmed backdrop. It is rendered through a
  // portal to <body> so it isn't clipped/blurred by the glass-card it lives in.
  const presenting = avatarState.status === 'speaking';
  const [spotlight, setSpotlight] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (presenting) {
      // Let the page show for a beat first, then pop the video into the spotlight.
      const showTimer = setTimeout(() => {
        setSpotlight(true);
        setLeaving(false);
      }, SHOW_PAGE_DELAY);
      return () => clearTimeout(showTimer);
    }

    // Narration ended — play the exit animation, then drop out of spotlight.
    const leaveId = requestAnimationFrame(() => setLeaving(true));
    const offTimer = setTimeout(() => {
      setSpotlight(false);
      setLeaving(false);
    }, SPOTLIGHT_EXIT_MS);
    return () => {
      cancelAnimationFrame(leaveId);
      clearTimeout(offTimer);
    };
  }, [presenting]);

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
          customPrompt="Explain the Patient Safety VR Training featured demo in an engaging way. Describe a trainee stepping into a virtual emergency department as a junior doctor, checking the patient's condition, deciding what action to take, ordering the correct medicine, verifying the delivered medicine before use, and reviewing the recorded session afterward for feedback and improvement. Keep it clear, lively, and suitable for visitors watching the demo video."
          avatarState={avatarState}
          style={{ marginBottom: '1rem' }}
        />
        <p className="demo-content-desc">
          This featured demo places trainees inside a virtual emergency department where they practise thinking like junior doctors under pressure. They observe the patient's condition, decide what action is needed, request the right medicine, and verify the delivered medication before it is used. Each run is recorded, turning a rare high-stakes scenario into repeatable practice with clear review points for feedback and improvement.
        </p>

        <div className="demo-tag-container">
          {['Virtual Reality', 'Emergency Protocol', 'Patient Safety', 'Video Feedback'].map(tag => (
            <span key={tag} className="pill-tag pill-tag--teal">{tag}</span>
          ))}
        </div>
      </div>

      {/* Spotlight overlay — portalled to <body> so it fills the viewport and is
          never clipped by the glass-card's overflow/backdrop-filter. */}
      {spotlight && !videoFailed && createPortal(
        <div className={`demo-spotlight ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
          <video
            className="demo-spotlight-video"
            autoPlay
            muted
            loop
            playsInline
            src="/demo-video.mp4"
          />
        </div>,
        document.body
      )}
    </div>
  );
}
