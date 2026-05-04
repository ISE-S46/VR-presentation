import { useState } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';
import '../styles/pages/OurPartners.css';

const internalCentres = [
  { name: 'Food Sustainability', emoji: '🌿', color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', areas: ['Agri-Food Tech', 'Future Foods'] },
  { name: 'Environment Sustainability', emoji: '🌏', color: '#059669', gradient: 'linear-gradient(135deg, #059669, #10b981)', areas: ['Sustainable Materials', 'Energy Systems'] },
  { name: 'Healthcare & Nutrition', emoji: '🏥', color: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', areas: ['Applied Nutrition', 'Healthcare Engineering'] },
  { name: 'Intelligent Systems', emoji: '⚙️', color: '#ca8a04', gradient: 'linear-gradient(135deg, #ca8a04, #eab308)', areas: ['Advanced Manufacturing', 'Robotics & Automation'] },
];

const externalGroups = [
  {
    category: 'Government & Education',
    partners: [
      { name: 'Ministry of Education Singapore', logo: '/logos/moe.png' },
      { name: 'SkillsFuture SG', logo: '/logos/ssg.png' }
    ]
  },
  {
    category: 'Healthcare',
    partners: [
      { name: 'Tan Tock Seng Hospital', logo: '/logos/ttsh.png' },
      { name: 'Changi General Hospital (SingHealth)', logo: '/logos/cgh.png' }
    ]
  },
  {
    category: 'Industry & Technology',
    partners: [
      { name: 'AWS', logo: '/logos/aws.png' },
      { name: 'SBS Transit', logo: '/logos/sbs.png' },
      { name: 'Certis', logo: '/logos/certis.png' },
      { name: 'Metabots', logo: '/logos/metabots.png' },
      { name: 'Kite Sense', logo: '/logos/kitesense.png' }
    ]
  },
  {
    category: 'Research & Community',
    partners: [
      { name: 'JMA Research Company', logo: '/logos/jma.png' },
      { name: 'Helen O\'Grady Drama Academy', logo: '/logos/helen.png' },
    ]
  }
];

function ExternalPartnerCard({ partner, index }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="glass-card partner-float-card external-partner-card"
      style={{ animationDelay: `${(index % 5) * 0.4}s` }}
    >
      <div className="partner-logo-container">
        {!imgFailed ? (
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            className="partner-logo"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="partner-fallback-logo">{partner.name.charAt(0)}</span>
        )}
      </div>
      <span className="partner-name">{partner.name}</span>
    </div>
  );
}

export default function OurPartners() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/Home')} />

      <div className="page-header">
        <span className="section-label">Ecosystem</span>
        <h1 className="page-title">Our Partners</h1>
        <p className="page-subtitle">Collaborating across Temasek Polytechnic and beyond</p>
      </div>

      <VRPlaceholder section="Our Partners" />

      {/* ===== INTERNAL PARTNERS ===== */}
      <section className="partner-section">
        <div className="partner-section-header">
          <h2>Internal Partners</h2>
          <div className="header-divider" />
        </div>
        <div className="internal-partner-grid">
          {internalCentres.map((c, i) => (
            <div key={i} className="glass-card internal-partner-card">
              <div
                className="partner-emoji-box"
                style={{
                  background: c.gradient,
                  boxShadow: `0 3px 10px ${c.color}20`
                }}
              >
                {c.emoji}
              </div>
              <div className="partner-content">
                <h3>{c.name}</h3>
                <div className="partner-tags">
                  {c.areas.map(a => (
                    <span
                      key={a}
                      className="partner-tag"
                      style={{
                        background: `${c.color}0c`,
                        color: c.color
                      }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-section-header">
          <h2>External Partners</h2>
          <div className="header-divider" />
        </div>

        <div className="external-partner-grid">
          {externalGroups.flatMap(g => g.partners).map((p, i) => (
            <ExternalPartnerCard key={p.name} partner={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}