import BackButton from '../components/BackButton';
import VRPlaceholder from '../components/VRPlaceholder';

export default function OurPartners({ navigate }) {
  const internalCentres = [
    { name: 'Food Sustainability', emoji: '🌿', color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', areas: ['Agri-Food Tech', 'Future Foods'] },
    { name: 'Environment Sustainability', emoji: '🌏', color: '#059669', gradient: 'linear-gradient(135deg, #059669, #10b981)', areas: ['Sustainable Materials', 'Energy Systems'] },
    { name: 'Healthcare & Nutrition', emoji: '🏥', color: '#0891b2', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)', areas: ['Applied Nutrition', 'Healthcare Engineering'] },
    { name: 'Intelligent Systems', emoji: '⚙️', color: '#ca8a04', gradient: 'linear-gradient(135deg, #ca8a04, #eab308)', areas: ['Advanced Manufacturing', 'Robotics & Automation'] },
  ];

  const enablingTech = [
    'Analytical Science', 'Artificial Intelligence', 'Behavioural Science',
    'Cyber Security', 'Immersive Media', 'Internet of Things'
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

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('Home')} />

      <div className="page-header">
        <span className="section-label">Ecosystem</span>
        <h1 className="page-title">Our Partners</h1>
        <p className="page-subtitle">Collaborating across Temasek Polytechnic and beyond</p>
      </div>

      <VRPlaceholder section="Our Partners" />

      {/* ===== INTERNAL PARTNERS ===== */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Internal Partners</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem'
        }}>
          {internalCentres.map((c, i) => (
            <div key={i} className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: c.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                flexShrink: 0,
                boxShadow: `0 3px 10px ${c.color}20`
              }}>{c.emoji}</div>
              <div>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '0.98rem', lineHeight: 1.3 }}>{c.name}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {c.areas.map(a => (
                    <span key={a} style={{
                      background: `${c.color}0c`,
                      color: c.color,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>


      </section>

      {/* ===== EXTERNAL PARTNERS ===== */}
      <section style={{ marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>External Partners</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1.5rem',
          padding: '1rem 0'
        }}>
          {externalGroups.flatMap(g => g.partners).map((p, i) => (
            <div 
              key={p.name} 
              className="glass-card partner-float-card" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                gap: '1.5rem',
                textAlign: 'center',
                animationDelay: `${(i % 5) * 0.4}s` // staggered floating effect
              }}
            >
              {/* Logo Container */}
              <div style={{
                height: '80px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={p.logo}
                  alt={`${p.name} logo`}
                  style={{ 
                    maxHeight: '100%', 
                    maxWidth: '100%', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))', // Soft shadow behind logo itself
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span style="color: var(--accent-teal); font-weight: 800; font-size: 2rem;">${p.name.charAt(0)}</span>`;
                  }}
                />
              </div>
              
              {/* Partner Name */}
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                opacity: 0.9
              }}>
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
