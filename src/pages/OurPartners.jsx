import { useState } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/OurPartners.css';

const internalCentres = [
  { name: 'Food Sustainability', icon: 'sprout', color: '#dc2626', areas: ['Agri-Food Tech', 'Future Foods'] },
  { name: 'Environment Sustainability', icon: 'globe', color: '#059669', areas: ['Sustainable Materials', 'Energy Systems'] },
  { name: 'Healthcare & Nutrition', icon: 'health', color: '#0891b2', areas: ['Applied Nutrition', 'Healthcare Engineering'] },
  { name: 'Intelligent Systems', icon: 'systems', color: '#ca8a04', areas: ['Advanced Manufacturing', 'Robotics & Automation'] },
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

const govHealthcarePartners = [
  { name: 'Ministry of Education Singapore', logo: '/logos/moe.png' },
  { name: 'SkillsFuture SG', logo: '/logos/ssg.png' },
  { name: 'Tan Tock Seng Hospital', logo: '/logos/ttsh.png' },
  { name: 'Changi General Hospital (SingHealth)', logo: '/logos/cgh.png' }
];

const techCommunityPartners = [
  { name: 'AWS', logo: '/logos/aws.png' },
  { name: 'SBS Transit', logo: '/logos/sbs.png' },
  { name: 'Certis', logo: '/logos/certis.png' },
  { name: 'Metabots', logo: '/logos/metabots.png' },
  { name: 'Kite Sense', logo: '/logos/kitesense.png' },
  { name: 'JMA Research Company', logo: '/logos/jma.png' },
  { name: 'Helen O\'Grady Drama Academy', logo: '/logos/helen.png' }
];

const partnershipStats = [
  { value: internalCentres.length, label: 'Internal centres' },
  { value: govHealthcarePartners.length + techCommunityPartners.length, label: 'External partners' },
  { value: '4', label: 'Ecosystem tracks' },
  { value: 'TP + Industry', label: 'Collaboration network' },
];

const ICON_PATHS = {
  sprout: (
    <>
      <path d="M7 20h10"></path>
      <path d="M12 20V9"></path>
      <path d="M12 12c-4 0-6-2-6-6 4 0 6 2 6 6z"></path>
      <path d="M12 14c4 0 6-2 6-6-4 0-6 2-6 6z"></path>
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M3 12h18"></path>
      <path d="M12 3c2.2 2.4 3.2 5.1 3.2 9S14.2 18.6 12 21"></path>
      <path d="M12 3c-2.2 2.4-3.2 5.1-3.2 9s1 6.6 3.2 9"></path>
    </>
  ),
  health: (
    <>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"></path>
      <path d="M8.5 12h2.2l1-2.4 1.6 4.4 1.1-2h2.1"></path>
    </>
  ),
  systems: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3"></rect>
      <path d="M9 9h6v6H9z"></path>
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"></path>
    </>
  ),
};

function PartnerIcon({ name }) {
  return (
    <svg className="partner-line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

function MarqueeRow({ partners, direction = 'left', speed = '35s' }) {
  // Multiply the elements to form a seamless loop
  const repeatedPartners = [...partners, ...partners, ...partners, ...partners, ...partners];

  return (
    <div className={`partner-marquee-container marquee-${direction}`}>
      <div className="partner-marquee-track" style={{ animationDuration: speed }}>
        {repeatedPartners.map((p, idx) => (
          <div className="marquee-logo-item" key={idx}>
            <div className="marquee-logo-wrapper">
              <img
                src={p.logo}
                alt={p.name}
                className="marquee-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fb = e.target.nextSibling;
                  if (fb) fb.style.display = 'block';
                }}
              />
              <span className="marquee-logo-fallback" style={{ display: 'none' }}>
                {p.name.charAt(0)}
              </span>
            </div>
            <span className="marquee-logo-tooltip">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OurPartners() {
  const navigate = useNavigate();

  return (
    <div className="page-container partners-page animate-fade-in">
      <BackButton onClick={() => navigate('/Home')} />

      <div className="page-header">
        <span className="section-label">Ecosystem</span>
        <h1 className="page-title">Our Partners</h1>
        <p className="page-subtitle">A cross-sector network supporting applied research, test-bedding, and deployment across education, healthcare, industry, and community settings.</p>
      </div>

      <section className="partner-ecosystem-panel" aria-label="Partnership ecosystem summary">
        <div className="partner-ecosystem-copy">
          <span className="partner-eyebrow">Partnership Network</span>
          <h2>Built around applied collaboration.</h2>
          <p>
            ETC connects Temasek Polytechnic centres with public agencies, healthcare partners, technology companies, and community organisations to turn prototypes into validated solutions.
          </p>
        </div>
        <div className="partner-stats-grid">
          {partnershipStats.map((stat) => (
            <div className="partner-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INTERNAL PARTNERS ===== */}
      <section className="partner-section">
        <div className="partner-section-header">
          <h2>Internal Partners</h2>
          <div className="header-divider" />
        </div>
        <div className="internal-partner-list">
          {internalCentres.map((c, i) => (
            <div key={i} className="internal-partner-row" style={{ '--partner-accent': c.color }}>
              <div className="partner-row-index">0{i + 1}</div>
              <div className="partner-row-icon-wrapper" aria-hidden="true">
                <PartnerIcon name={c.icon} />
              </div>
              <div className="partner-row-info">
                <h3>{c.name}</h3>
                <div className="partner-tags">
                  {c.areas.map(a => (
                    <span
                      key={a}
                      className="partner-tag"
                      style={{
                        borderColor: `${c.color}25`,
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

      {/* ===== EXTERNAL PARTNERS ===== */}
      <section className="partner-section">
        <div className="partner-section-header">
          <h2>External Partners</h2>
          <div className="header-divider" />
        </div>

        <div className="external-marquee-wall">
          <div className="marquee-lane-label">Government & Healthcare</div>
          <MarqueeRow partners={govHealthcarePartners} direction="left" speed="40s" />

          <div className="marquee-lane-label">Technology & Community</div>
          <MarqueeRow partners={techCommunityPartners} direction="right" speed="55s" />
        </div>
      </section>
    </div>
  );
}
