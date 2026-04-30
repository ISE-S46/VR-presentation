import '../styles/LandingPage.css';
import CharacterViewer from '../components/CharacterViewer';

export default function LandingPage({ navigate }) {
  return (
    <div className="landing-container animate-fade-in">
      {/* Dynamic Background Elements for Landing Page */}
      <div className="landing-glow-top" />
      <div className="landing-glow-bottom" />

      <div className="landing-content">
        <div className="landing-header">
          <h2 className="landing-subtitle stagger-item">Welcome to</h2>
          <h1 className="landing-title stagger-item">
            Enabling Technology<br />
            <span className="text-gradient">Collaboratory</span>
          </h1>
        </div>

        {/* 3D Model Placeholder Container */}
        <div className="model-placeholder-container stagger-item">

          {/* Here we use our reusable 3D component. 
              Currently passing 'placeholder' so it shows the default robot.
              Once your friend has the model, change it to e.g. modelPath="/character-welcome.glb" */}
          <CharacterViewer modelPath="placeholder" scale={1.2} position={[0, -1, 0]} />

        </div>

        <div className="landing-footer stagger-item">
          <button
            className="btn-glass-primary"
            onClick={() => navigate('Home')}
          >
            <span className="btn-text">Let's get to know ETC more</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
