import '../styles/components/VRPlaceholder.css';

export default function VRPlaceholder({ section, className = '', style }) {
  return (
    <div className={`vr-placeholder-container ${className}`} style={style}>
      <div className="vr-placeholder-orb" />
      <div className="vr-placeholder-icon">🧑‍🚀</div>
      <p className="vr-placeholder-title">Virtual Assistant Area</p>
      <span className="vr-placeholder-badge">Section: {section}</span>
    </div>
  );
}