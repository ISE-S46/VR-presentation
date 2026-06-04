import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import '../styles/pages/OurPartners.css';

const internalCentres = [
  { 
    name: 'Food Sustainability', 
    icon: 'sprout', 
    color: '#dc2626', 
    areas: ['Agri-Food Tech', 'Future Foods'],
    keywords: ['food sustainability', 'agri-food', 'future foods']
  },
  { 
    name: 'Environment Sustainability', 
    icon: 'globe', 
    color: '#059669', 
    areas: ['Sustainable Materials', 'Energy Systems'],
    keywords: ['environment sustainability', 'sustainable materials', 'energy systems']
  },
  { 
    name: 'Healthcare & Nutrition', 
    icon: 'health', 
    color: '#0891b2', 
    areas: ['Applied Nutrition', 'Healthcare Engineering'],
    keywords: ['healthcare & nutrition', 'healthcare and nutrition', 'nutrition', 'applied nutrition', 'healthcare engineering']
  },
  { 
    name: 'Intelligent Systems', 
    icon: 'systems', 
    color: '#ca8a04', 
    areas: ['Advanced Manufacturing', 'Robotics & Automation'],
    keywords: ['intelligent systems', 'advanced manufacturing', 'robotics', 'automation']
  },
];

const govHealthcarePartners = [
  { name: 'Ministry of Education Singapore', logo: '/logos/moe.png', keywords: ['ministry of education', 'moe', 'education'] },
  { name: 'SkillsFuture SG', logo: '/logos/ssg.png', keywords: ['skillsfuture', 'ssg'] },
  { name: 'Tan Tock Seng Hospital', logo: '/logos/ttsh.png', keywords: ['tan tock seng', 'ttsh'] },
  { name: 'Changi General Hospital (SingHealth)', logo: '/logos/cgh.png', keywords: ['changi general', 'cgh', 'singhealth'] }
];

const techCommunityPartners = [
  { name: 'AWS', logo: '/logos/aws.png', keywords: ['a.w.s.', 'a.w.s', 'aws', 'amazon web services', 'amazon', 'a w s'] },
  { name: 'SBS Transit', logo: '/logos/sbs.png', keywords: ['sbs transit', 'sbs'] },
  { name: 'Certis', logo: '/logos/certis.png', keywords: ['certis'] },
  { name: 'Metabots', logo: '/logos/metabots.png', keywords: ['metabots'] },
  { name: 'Kite Sense', logo: '/logos/kitesense.png', keywords: ['kite sense', 'kitesense'] },
  { name: 'JMA Research Company', logo: '/logos/jma.png', keywords: ['jma', 'jma research'] },
  { name: 'Helen O\'Grady Drama Academy', logo: '/logos/helen.png', keywords: ['helen o\'grady', 'helen ogrady', 'drama academy'] }
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

function MarqueeRow({ partners, direction = 'left', speed = '35s', highlightedPartnerName }) {
  // Multiply the elements to form a seamless loop
  const repeatedPartners = [...partners, ...partners, ...partners, ...partners, ...partners];

  return (
    <div className={`partner-marquee-container marquee-${direction}`}>
      <div className="partner-marquee-track" style={{ animationDuration: speed }}>
        {repeatedPartners.map((p, idx) => {
          const isHighlighted = p.name === highlightedPartnerName;
          return (
            <div className={`marquee-logo-item ${isHighlighted ? 'highlighted' : ''}`} key={idx}>
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
          );
        })}
      </div>
    </div>
  );
}

export default function OurPartners() {
  const navigate = useNavigate();
  const { status, spokenText, durationMs } = useAvatarStatus();
  const [highlightedPartner, setHighlightedPartner] = useState(null);

  useEffect(() => {
    if (status === 'speaking' && spokenText) {
      const lowercaseText = spokenText.toLowerCase();
      const L = spokenText.length;
      
      const charsPerSecond = 12.8;
      const estimatedDurationMs = Math.max(4500, (L / charsPerSecond) * 1000);
      const activeDurationMs = durationMs || estimatedDurationMs;

      // Helper function to calculate weighted timestamp for a character index (accounting for TTS pauses)
      const getWeightedTime = (targetIdx) => {
        let virtualLength = 0;
        let targetVirtualIndex = 0;

        // Calibrated pause weights for 0.97 speed
        const ellipsisWeight = 12.3;
        const commaWeight = 3.7;
        const periodWeight = 7.7;

        for (let i = 0; i < L; i++) {
          let charWeight = 1;
          
          if (spokenText.substr(i, 3) === '...') {
            charWeight = ellipsisWeight;
            if (i < targetIdx) {
              targetVirtualIndex += charWeight;
            }
            virtualLength += charWeight;
            i += 2; // skip the other two dots
            continue;
          } else if (spokenText[i] === ',' || spokenText[i] === ';') {
            charWeight = commaWeight;
          } else if (spokenText[i] === '.' || spokenText[i] === '!' || spokenText[i] === '?') {
            charWeight = periodWeight;
          }
          
          if (i < targetIdx) {
            targetVirtualIndex += charWeight;
          }
          virtualLength += charWeight;
        }

        return (targetVirtualIndex / virtualLength) * activeDurationMs;
      };

      const timeline = [];

      // Find all matches in internal centres
      for (const c of internalCentres) {
        for (const kw of c.keywords) {
          const idx = lowercaseText.indexOf(kw);
          if (idx !== -1) {
            const startMs = getWeightedTime(idx);
            timeline.push({ name: c.name, type: 'internal', start: startMs, index: idx });
            break; // Match once per centre
          }
        }
      }

      // Find all matches in external partners
      for (const p of [...govHealthcarePartners, ...techCommunityPartners]) {
        for (const kw of p.keywords) {
          const idx = lowercaseText.indexOf(kw);
          if (idx !== -1) {
            const startMs = getWeightedTime(idx);
            timeline.push({ name: p.name, type: 'external', start: startMs, index: idx });
            break; // Match once per partner
          }
        }
      }

      // Sort timeline events by chronological appearance in spoken text
      timeline.sort((a, b) => a.index - b.index);

      // Map timeline to have precise end times based on the next event's start time to prevent visual drifts
      const adjustedTimeline = timeline.map((event, idx) => {
        const start = event.start;
        let end;
        if (idx < timeline.length - 1) {
          // End just AFTER the next partner starts so the handoff is seamless:
          // by then the next highlight has taken over, so this clear is a no-op
          // (guarded below). That keeps the marquee frozen and the spotlight from
          // flickering between partners.
          end = Math.max(start + 500, timeline[idx + 1].start + 60);
        } else {
          // For the last partner, stay highlighted for 2.5 seconds (or up to the end of the duration)
          end = Math.min(activeDurationMs, start + 2500);
        }
        return {
          ...event,
          start,
          end
        };
      });

      const timers = [];

      adjustedTimeline.forEach((event, idx) => {
        // Timer to trigger the highlight & scroll
        const startTimer = setTimeout(() => {
          setHighlightedPartner(event.name);
          
          // Only scroll if the partner type changed or if it's the first highlight to avoid constant scrolling fight
          const isFirstOfType = idx === 0 || adjustedTimeline[idx - 1].type !== event.type;
          if (isFirstOfType) {
            if (event.type === 'external') {
              const element = document.querySelector('.external-marquee-wall');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            } else {
              const element = document.querySelector('.internal-partner-list');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }
        }, event.start);
        timers.push(startTimer);

        // Timer to remove this specific highlight
        const endTimer = setTimeout(() => {
          setHighlightedPartner((current) => (current === event.name ? null : current));
        }, event.end);
        timers.push(endTimer);
      });

      return () => {
        timers.forEach(clearTimeout);
      };
    } else {
      // Clear the highlight on the next frame (deferred so it isn't a
      // synchronous setState inside the effect body).
      const clearId = requestAnimationFrame(() => setHighlightedPartner(null));
      return () => cancelAnimationFrame(clearId);
    }
  }, [status, spokenText, durationMs]);

  const hasHighlight = highlightedPartner !== null;

  // Partners live in scrolling marquees or may be scrolled past, so a frozen
  // highlight can end up off-screen. Mirror the currently-named partner in a
  // fixed, centred "spotlight" card so it's always clearly visible.
  const spotlightPartner = (() => {
    if (!highlightedPartner) return null;

    // Check external partners first (they have logos)
    const ext = [...govHealthcarePartners, ...techCommunityPartners].find((p) => p.name === highlightedPartner);
    if (ext) return ext;

    // Fall back to internal centres — synthesise a card with the first-letter fallback
    const intl = internalCentres.find((c) => c.name === highlightedPartner);
    if (intl) return { name: intl.name, logo: null, _accent: intl.color };

    return null;
  })();

  return (
    <div className={`page-container partners-page animate-fade-in ${hasHighlight ? 'has-highlight' : ''}`}>
      <BackButton onClick={() => navigate('/Home')} />

      {spotlightPartner && (
        <div
          className="partner-spotlight"
          key={spotlightPartner.name}
          aria-hidden="true"
          style={spotlightPartner._accent ? { '--spotlight-accent': spotlightPartner._accent } : undefined}
        >
          <span className="partner-spotlight-eyebrow">
            {spotlightPartner._accent ? 'Internal Centre' : 'ETC Partner'}
          </span>
          <div className="partner-spotlight-logo-wrap">
            {spotlightPartner.logo ? (
              <img
                src={spotlightPartner.logo}
                alt={spotlightPartner.name}
                className="partner-spotlight-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fb = e.target.nextSibling;
                  if (fb) fb.style.display = 'flex';
                }}
              />
            ) : null}
            <span
              className="partner-spotlight-fallback"
              style={{
                display: spotlightPartner.logo ? 'none' : 'flex',
                background: spotlightPartner._accent ? `${spotlightPartner._accent}18` : undefined,
                color: spotlightPartner._accent || undefined,
              }}
            >
              {spotlightPartner.name.charAt(0)}
            </span>
          </div>
          <span className="partner-spotlight-name">{spotlightPartner.name}</span>
        </div>
      )}

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
          {internalCentres.map((c, i) => {
            const isHighlighted = c.name === highlightedPartner;
            return (
              <div key={i} className={`internal-partner-row ${isHighlighted ? 'highlighted' : ''}`} style={{ '--partner-accent': c.color }}>
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
            );
          })}
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
          <MarqueeRow 
            partners={govHealthcarePartners} 
            direction="left" 
            speed="40s" 
            highlightedPartnerName={highlightedPartner} 
          />

          <div className="marquee-lane-label">Technology & Community</div>
          <MarqueeRow 
            partners={techCommunityPartners} 
            direction="right" 
            speed="55s" 
            highlightedPartnerName={highlightedPartner} 
          />
        </div>
      </section>
    </div>
  );
}
