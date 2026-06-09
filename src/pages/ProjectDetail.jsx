import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import AvatarExplainButton from '../components/AvatarExplainButton';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import '../styles/pages/Projects.css';

function SecurityShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

function AiScannerIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="3" y1="12" x2="21" y2="12"></line>
    </svg>
  );
}

function MriHeartbeatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  );
}

function EducationIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
    </svg>
  );
}

function MicIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path>
    </svg>
  );
}

function UploadIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path>
    </svg>
  );
}

function MessageSquareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function BookOpenIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

function VrHeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14l-.5-3.5A2 2 0 0 1 5.5 8h13a2 2 0 0 1 2 2.5L20 14"></path>
      <path d="M4 14v4a2 2 0 0 0 2 2h3l2-3h2l2 3h3a2 2 0 0 0 2-2v-4"></path>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  );
}

function LaptopIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  );
}

function BarricadeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="19" x2="20" y2="19"></line>
      <path d="M4 15h16"></path>
      <path d="M8 19V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"></path>
      <line x1="4" y1="11" x2="20" y2="11"></line>
    </svg>
  );
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18"></path>
      <path d="M9 8h1"></path>
      <path d="M9 12h1"></path>
      <path d="M14 8h1"></path>
      <path d="M14 12h1"></path>
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
    </svg>
  );
}

function FolderIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  );
}

function WebVrIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      <line x1="2" y1="12" x2="22" y2="12"></line>
    </svg>
  );
}

function RoleplayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function ChatPlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <line x1="12" y1="7" x2="12" y2="13"></line>
      <line x1="9" y1="10" x2="15" y2="10"></line>
    </svg>
  );
}

function FaceSmileIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function FaceScanIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
      <path d="M9 9h.01"></path>
      <path d="M15 9h.01"></path>
      <path d="M12 15h.01"></path>
    </svg>
  );
}

function LineChartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

function SafetyVrIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

function SkillsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      <path d="M12 5v14"></path>
    </svg>
  );
}

function KnowledgeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  );
}

function AttitudesIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="15" x2="16" y2="15"></line>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  );
}

const projects = [
  {
    number: '01',
    title: 'Augmented Reality Application for Security Training',
    desc: 'Co-funded by SSG, utilizing image target tracking to simulate security incidents',
    tag: 'Security & VR/AR',
    color: '#0d9488',
    isArast: true,
    iconComponent: SecurityShieldIcon,
    avatar: {
      projectName: 'ARAST',
      projectTitle: 'Augmented Reality Application for Security Training (ARAST)',
      variant: 'teal',
      customPrompt: 'Explain the Augmented Reality Application for Security Training (ARAST) project in detail. It is co-funded by SSG and partnered with Certis. It uses image target tracking to simulate security incidents such as fires, improvised explosive devices (IEDs), break-ins, suspicious persons, and bag searches. Trainees can interact with augmented 3D objects like suspicious packages. It also features a real-time analytics dashboard to monitor training completion, identify frequent errors, and track competencies, supplementing basic WSQ security module training.',
    },
  },
  {
    number: '02',
    title: 'Automated Risk Assessment for image-based hazard identification and mitigation (ARA)',
    desc: 'Streamlining workplace risk assessments by developing an automated identification system',
    tag: 'Safety & AI',
    color: '#7c3aed',
    isAra: true,
    iconComponent: AiScannerIcon,
    avatar: {
      projectName: 'ARA',
      projectTitle: 'Automated Risk Assessment (ARA)',
      variant: 'violet',
      customPrompt: 'Explain the Automated Risk Assessment (ARA) project in detail. This safety and AI initiative aims to streamline workplace risk assessments by accepting workplace photos and automatically generating draft Risk Assessment (RA) forms. It identifies and categorizes hazards based on Ministry of Manpower (MOM) classifications, allowing users to review, refine, and archive the forms, which helps analyze hazard trends.',
    },
  },
  {
    number: '03',
    title: 'Pre-Procedure Evaluation System for MRI',
    desc: 'AR-based simulation that helps patients acclimatise before MRI scans',
    tag: 'Healthcare & VR',
    color: '#059669',
    isMri: true,
    iconComponent: MriHeartbeatIcon,
    avatar: {
      projectName: 'MRI',
      projectTitle: 'Pre-Procedure Evaluation System for MRI',
      variant: 'teal',
      customPrompt: 'Explain the Pre-Procedure Evaluation System for MRI in detail. Co-funded by the Temasek Polytechnic Research Fund (TPRF) and partnered with Changi General Hospital (CGH), this healthcare project aims to reduce aborted MRI scans. It uses a VR prototype to acclimatise claustrophobic or anxious patients, collecting metrics like bed mat pressure distribution, patient vitals, and camera tracking to compute a suitability evaluation score.',
    },
  },
  {
    number: '04',
    title: 'Virtual Practice Environment for Oral Exam Preparation',
    desc: 'A virtual practice environment where students interact with an AI simulating a teacher for oral exam preparation',
    tag: 'Education & AI',
    color: '#0284c7',
    isOral: true,
    iconComponent: EducationIcon,
    avatar: {
      projectName: 'OralExam',
      projectTitle: 'Virtual Practice Environment for Oral Exam Preparation',
      variant: 'violet',
      customPrompt: 'Explain the Virtual Practice Environment for Oral Exam Preparation in detail. Partnered with Dunman Secondary School and Bartley Secondary School, this education initiative uses voice-to-text, large language models (LLM), and text-to-voice where an AI acts as a teacher to let students practice interactive oral exams. Teachers can upload visual stimuli, exam rubrics, and access AI-generated feedback and assessments of student performance.',
    },
  },
  {
    number: '05',
    title: 'E-Practical and Immersive technology (A/VR) Learning Package',
    desc: 'Initiative driven by Polytechnics & ITE (POLITE) Education Technology Committee',
    tag: 'Education & VR/AR',
    color: '#ea580c',
    isPolite: true,
    iconComponent: VrHeadsetIcon,
    avatar: {
      projectName: 'PolitePackage',
      projectTitle: 'E-Practical and Immersive Technology (A/VR) Learning Package',
      variant: 'teal',
      customPrompt: 'Explain the E-Practical and Immersive Technology Learning Package in detail. Driven by the POLITE Education Technology Committee across Singapore Poly, Ngee Ann Poly, Republic Poly, Nanyang Poly, and Temasek Poly, it covers 4 workplace safety topics: Ladder Safety, Fire Hazard Check, Fire Safety Equipment Visual Check, and Hazard Identification. Accessible via WebVR and Oculus Quest, it serves approximately 1500 students annually across the 5 polytechnics.',
    },
  },
  {
    number: '06',
    title: 'Immersive Role-play: Role-Play Authoring and AI-Assisted Assessment',
    desc: 'A role-play authoring and management platform providing a cost-effective alternative to face-to-face training',
    tag: 'Training & AI',
    color: '#db2777',
    isRoleplay: true,
    iconComponent: RoleplayIcon,
    avatar: {
      projectName: 'Roleplay',
      projectTitle: 'Immersive Role-play: Role-Play Authoring and AI-Assisted Assessment',
      variant: 'violet',
      customPrompt: 'Explain the Immersive Role-play and AI-Assisted Assessment project in detail. Partnered with JMA Research, this multi-device application provides a cost-effective alternative to face-to-face roleplays. It enables domain experts to easily customize conversation intents, select avatars and animations, and choose role-play environments. It uses AI to analyze student facial expressions, speech emotions, language sentiments, and training effectiveness.',
    },
  },
  {
    number: '07',
    title: 'Patient Safety Training: Use of VR to Inculcate The Concept of Patient Safety in the Emergency Department',
    desc: 'Immersive virtual emergency department to impart patient safety education to junior doctors',
    tag: 'Healthcare & VR',
    color: '#14b8a6',
    isSafetyVR: true,
    iconComponent: SafetyVrIcon,
    avatar: {
      projectName: 'SafetyVR',
      projectTitle: 'Patient Safety Training: Use of VR in the Emergency Department',
      variant: 'teal',
      customPrompt: 'Explain the Patient Safety Training VR project in detail. Partnered with Changi General Hospital (CGH), this healthcare VR simulation creates a gamified virtual emergency department to train junior doctors in critical patient safety elements: Skills, Knowledge, and Attitudes. It allows learning in a fun, risk-free environment without requiring high-cost instructors.',
    },
  },
];

export default function ProjectDetail() {
  const navigate = useNavigate();
  const [expandedProject, setExpandedProject] = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const avatarState = useAvatarStatus();
  const searchInputRef = useRef(null);

  // Press "/" anywhere on the page to jump straight to the search box.
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== '/') return;
      const el = document.activeElement;
      const isTyping =
        el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (isTyping) return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!expandedProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setExpandedProject(null);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [expandedProject]);

  useEffect(() => {
    if (avatarState.status !== 'speaking') return undefined;

    let frameId;
    let startFrameId;

    const startAutoScroll = () => {
      const scrollTarget = expandedProject
        ? document.querySelector('.arast-container')
        : window;

      if (!scrollTarget) return;

      const isWindowScroll = scrollTarget === window;
      const getScrollTop = () => (
        isWindowScroll
          ? window.scrollY
          : scrollTarget.scrollTop
      );
      const getMaxScrollTop = () => (
        isWindowScroll
          ? Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
          : Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight)
      );
      const setScrollTop = (value) => {
        if (isWindowScroll) {
          window.scrollTo(0, value);
        } else {
          scrollTarget.scrollTop = value;
        }
      };

      const startScrollTop = getScrollTop();
      const maxScrollTop = getMaxScrollTop();
      const scrollDistance = maxScrollTop - startScrollTop;
      if (scrollDistance <= 12) return;

      const durationMs = Math.max(3500, (avatarState.durationMs || 9000) * 0.9);
      const startedAt = performance.now();

      const animateScroll = (now) => {
        const progress = Math.min(1, (now - startedAt) / durationMs);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setScrollTop(startScrollTop + scrollDistance * easedProgress);

        if (progress < 1) {
          frameId = requestAnimationFrame(animateScroll);
        }
      };

      frameId = requestAnimationFrame(animateScroll);
    };

    startFrameId = requestAnimationFrame(startAutoScroll);

    return () => {
      if (startFrameId) cancelAnimationFrame(startFrameId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [avatarState.durationMs, avatarState.projectName, avatarState.status, expandedProject]);

  const projectTags = useMemo(() => {
    return ['All', ...new Set(projects.map((project) => project.tag))];
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesTag = activeTag === 'All' || project.tag === activeTag;
      const searchableText = `${project.title} ${project.desc} ${project.tag}`.toLowerCase();
      return matchesTag && (!query || searchableText.includes(query));
    });
  }, [activeTag, searchQuery]);

  const toggleExpand = (projectTitle) => {
    setExpandedProject(expandedProject === projectTitle ? null : projectTitle);
  };

  const closeProjectModal = () => setExpandedProject(null);

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Research & Dev</span>
        <h1 className="page-title">Project Portfolio</h1>
        <p className="page-subtitle">Browse our extensive portfolio of assistive tech</p>
      </div>

      <div className="project-command-panel">
        <div className="project-search-shell">
          <svg className="project-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={searchInputRef}
            className="project-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, partners, or technologies"
            aria-label="Search projects"
          />
          {searchQuery ? (
            <button
              type="button"
              className="project-clear-search"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          ) : (
            <kbd className="project-search-kbd" aria-hidden="true">/</kbd>
          )}
        </div>

        <div className="project-filter-row" aria-label="Filter projects by domain">
          {projectTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`project-filter-chip ${activeTag === tag ? 'project-filter-chip--active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="project-result-meta">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="project-empty-state">
          <h2>No matching projects</h2>
          <p>Try a broader keyword or reset the domain filter.</p>
          <button
            type="button"
            className="project-empty-reset"
            onClick={() => {
              setSearchQuery('');
              setActiveTag('All');
            }}
          >
            Reset filters
          </button>
        </div>
      )}

      <div className="stagger-children project-list">
        {filteredProjects.map((proj) => {
          const isExpanded = expandedProject === proj.title;
          const Icon = proj.iconComponent;
          return (
            <div
              key={proj.title}
              className={`glass-card project-item-card ${isExpanded ? 'project-item-card--expanded' : ''}`}
              onClick={() => toggleExpand(proj.title)}
              onKeyDown={(e) => {
                // Only respond to the card itself, not Enter/Space on inner controls
                if (e.target !== e.currentTarget) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpand(proj.title);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`${proj.title}. ${isExpanded ? 'Close' : 'Open'} project details`}
              style={{ cursor: 'pointer' }}
            >
              {/* Left edge premium colored stripe indicator */}
              <div className="project-item-stripe" style={{ backgroundColor: proj.color }} />
              
              <div className="project-item-header">
                {/* Left leading: high-tech custom icon & low-opacity ID number */}
                <div className="project-item-leading">
                  <div 
                    className="project-item-icon-wrapper"
                    style={{
                      background: `${proj.color}08`,
                      borderColor: `${proj.color}1a`,
                      color: proj.color
                    }}
                  >
                    <Icon className="project-item-icon-svg" />
                  </div>
                  <span className="project-item-number" style={{ color: `${proj.color}20` }}>
                    {proj.number}
                  </span>
                </div>

                {/* Center content: custom tag and title & description */}
                <div className="project-item-info">
                  <div className="project-item-tag-row">
                    <span
                      className="project-tag"
                      style={{
                        background: `${proj.color}0a`,
                        color: proj.color,
                        borderColor: `${proj.color}20`
                      }}
                    >
                      <span className="project-tag-dot" style={{ backgroundColor: proj.color }} />
                      {proj.tag}
                    </span>
                  </div>
                  <h3 className="project-item-title">{proj.title}</h3>
                  <p className="project-item-desc">{proj.desc}</p>
                </div>

                {/* Right trailing: custom circular expand chevron button */}
                <div className="project-item-trailing">
                  <span 
                    className={`expand-chevron-btn ${isExpanded ? 'expand-chevron-btn--expanded' : ''}`}
                    style={{
                      background: isExpanded ? `${proj.color}15` : 'rgba(0, 0, 0, 0.03)',
                      color: isExpanded ? proj.color : 'var(--text-secondary)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
              </div>

              {isExpanded && proj.isArast && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />

                    {/* Section 1: AR Fire Simulation & Incident Types */}
                    <div className="arast-section">
                      <div className="arast-media-wrapper">
                        <img 
                          src="/arast_fire_simulation.png" 
                          alt="AR Fire Extinguisher Simulation" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          Co-funded by SSG, the AR Application for Security Training (ARAST) utilise image target tracking methodology to simulate security incidents such as:
                        </p>
                        
                        <div className="arast-incident-grid">
                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--teal">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--teal">Fire</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--violet">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9"></circle>
                                <circle cx="12" cy="12" r="5"></circle>
                                <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--violet">Improvised explosive device</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--teal">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--teal">Break-In</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--violet">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21l-4.3-4.3M19 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--violet">Suspicious Person</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--teal">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--teal">Bag Search</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Suspicious Package & Engagement Description */}
                    <div className="arast-section arast-section--reverse">
                      <div className="arast-text-content">
                        <p className="arast-paragraph arast-paragraph--large">
                          Various learning activities are employed to engage trainees including the opportunity to interact with augmented 3D objects like a suspicious package. Instant feedback and summary of learning points serve to deepen understanding and reinforce knowledge.
                        </p>
                      </div>
                      <div className="arast-media-wrapper">
                        <img 
                          src="/arast_package.png" 
                          alt="AR Suspicious Package" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Analytics Dashboard & Security Agency Values */}
                    <div className="arast-section">
                      <div className="arast-media-wrapper">
                        <img 
                          src="/arast_dashboard.png" 
                          alt="Security Analytics Dashboard" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          The application also comes equipped with a database and a real-time analytics dashboard that enables security agencies to:
                        </p>
                        
                        <div className="arast-value-list">
                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Monitor the completion of training assignments and login attempts, among other
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Identify frequently made errors during the learning process
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Access performance insights by tracking officers' competencies
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              ARAST can also be used to supplement basic training in the WSQ security modules, enhancing the learning experience for role plays.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partnership Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="certis-logo-wrapper">
                        <span className="certis-logo-text">CERTIS</span>
                        <div className="certis-logo-diamond">
                          <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                            {/* Blue Diamond Left */}
                            <path d="M50 15 L20 50 L50 85 Z" fill="#005A9C" />
                            {/* Orange Diamond Right */}
                            <path d="M50 15 L80 50 L50 85 Z" fill="#FF7900" opacity="0.95" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ), document.body)}

              {isExpanded && proj.isAra && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />

                    {/* Section 1: Intro & System value propositions */}
                    <div className="arast-section">
                      <div className="arast-text-content">
                        <p className="arast-paragraph arast-paragraph--large" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                          This project aims to streamline workplace risk assessments by developing an automated system that:
                        </p>
                        
                        <div className="arast-value-list" style={{ marginTop: '0.5rem' }}>
                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Accepts workplace images to generate preliminary risk assessment (RA) forms.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="M12 8v4"></path>
                                <path d="M12 16h.01"></path>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Identifies hazards and categorizes them using official Ministry Of Manpower (MOM) classifications for data analysis and trending.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Provides an interface for users to review, refine, and finalize RA forms.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Offers a management system to organize, track, and archive RA forms effectively.
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="arast-media-wrapper">
                        <img 
                          src="/ara_tablet.png" 
                          alt="Automated Risk Assessment Tablet View" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Workflow & Dashboard */}
                    <div className="arast-section arast-section--reverse">
                      <div className="arast-text-content">
                        <h3 className="arast-section-subtitle" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Workflow:</h3>
                        
                        <div className="arast-value-list">
                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              The Risk Assessment team captures photographs of the workplace and uploads them to the system.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              The system auto-generates a draft RA form, which the assessment team can review and adjust.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Finalized forms are archived with tracking features for control measure implementation.
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="arast-media-wrapper">
                        <img 
                          src="/ara_dashboard.png" 
                          alt="RA Management Workflow Dashboard" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Validation */}
                    <div className="arast-validation-section" style={{ padding: '0.5rem 0' }}>
                      <h3 className="arast-section-subtitle" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-heading)', margin: '0 0 0.8rem 0' }}>Validation:</h3>
                      <p className="arast-paragraph" style={{ fontSize: '0.94rem', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                        The system’s effectiveness was assessed by comparing the quality and thoroughness of its outputs against manually created forms.
                      </p>
                    </div>

                  </div>
                </div>
              ), document.body)}

              {isExpanded && proj.isMri && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />

                    {/* Section 1: Intro Text with Team Image */}
                    <div className="arast-section">
                      <div className="arast-media-wrapper">
                        <img 
                          src="/mri_team.png" 
                          alt="Pre-Procedure Evaluation System Team Collaboration" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          The goal of the project, which received funding from the Temasek Polytechnic Research Fund (TPRF) and involved collaboration with CGH, was to decrease the incidence of MRI scans being aborted due to patients being unsuitable for the procedure. To achieve this objective, the project team created a functional prototype that:
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Side by Side Two Custom Cards */}
                    <div className="mri-cards-container">
                      <div className="mri-card mri-card--teal">
                        <div className="mri-card-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path>
                          </svg>
                        </div>
                        <p className="mri-card-text">
                          Simulates the MRI Scanning process through the use of immersive media/VR technology
                        </p>
                      </div>

                      <div className="mri-card mri-card--violet">
                        <div className="mri-card-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                          </svg>
                        </div>
                        <p className="mri-card-text">
                          Collects various data through the use of a body pressure distribution bed mat, vital sign monitoring devices and cameras resulting in establishing a basic scoring system
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Large System Architecture Diagram */}
                    <div className="mri-diagram-section">
                      <div className="arast-media-wrapper mri-diagram-wrapper">
                        <img 
                          src="/mri_architecture.png" 
                          alt="MRI System Workflow Architecture Diagram" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    {/* Section 4: Row of 4 Features */}
                    <div className="mri-features-row">
                      <div className="mri-feature-item mri-feature-item--teal">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Durable</span>
                      </div>

                      <div className="mri-feature-item mri-feature-item--violet">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="6" width="18" height="15" rx="2"></rect>
                            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Portable</span>
                      </div>

                      <div className="mri-feature-item mri-feature-item--teal">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="6"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Lightweight</span>
                      </div>

                      <div className="mri-feature-item mri-feature-item--violet">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Easy to set up</span>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 5: Prior to Scan VR Immersion Setup */}
                    <div className="arast-section arast-section--reverse">
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          Prior to an MRI scan, a patient will be subjected to a simulated in-bore MRI environment using immersive media/VR technology while being monitored continuously to detect signs of anxiety or claustrophobic response. This will help determine the probability of success of an actual scan. A patient can also use the system to acclimatize themselves to the MRI scanning process.
                        </p>
                      </div>
                      <div className="arast-media-wrapper">
                        <img 
                          src="/mri_patient.png" 
                          alt="Patient acclimatization simulation room setup" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    {/* Partner Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="cgh-logo-wrapper">
                        <img 
                          src="/cgh_logo.png" 
                          alt="Changi General Hospital SingHealth" 
                          className="cgh-partner-logo-img" 
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ), document.body)}

              {isExpanded && proj.isOral && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />

                    {/* Section 1: Overview and main illustration */}
                    <div className="oral-overview-section">
                      <p className="arast-paragraph">
                        This project creates a virtual practice environment where students interact with an AI simulating a teacher for oral exam preparation.
                      </p>
                      
                      <div className="arast-media-wrapper oral-media-overview">
                        <img 
                          src="/oral_exam_overview.png" 
                          alt="AI Oral Exam Practice Environment Illustration" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Four Detailed Features Blocks */}
                    <div className="oral-features-container">
                      <div className="oral-feature-card oral-feature-card--teal">
                        <div className="oral-feature-card-icon">
                          <MicIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          Using voice-to-text, large language models (LLM), and text-to-voice technologies, it provides an interactive learning experience tailored to individual needs.
                        </p>
                      </div>

                      <div className="oral-feature-card oral-feature-card--violet">
                        <div className="oral-feature-card-icon">
                          <UploadIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          Teachers can upload visual stimuli, exam topics, and assessment rubrics, allowing the AI to guide students through practice sessions resembling the actual exam.
                        </p>
                      </div>

                      <div className="oral-feature-card oral-feature-card--teal">
                        <div className="oral-feature-card-icon">
                          <MessageSquareIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          At the end of each session, the AI generates personalized feedback based on the rubrics, helping students identify areas for improvement and adjust their performance in real-time.
                        </p>
                      </div>

                      <div className="oral-feature-card oral-feature-card--violet">
                        <div className="oral-feature-card-icon">
                          <BookOpenIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          Teachers can review the AI-generated feedback to ensure accuracy. Overall, the proposal offers an effective, scalable solution for oral exam preparation, empowering students to practice independently and improve their performance for better results.
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Pilot Testing */}
                    <div className="oral-pilot-section">
                      <div className="arast-media-wrapper oral-pilot-media">
                        <img 
                          src="/oral_exam_pilot.png" 
                          alt="Pilot testing classroom environment" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          Pilot testing will be conducted in a controlled environment at both Dunman Secondary School and Bartley Secondary School.
                        </p>
                      </div>
                    </div>

                    {/* Partner Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="oral-logos-container">
                        <div className="oral-logo-item">
                          <img src="/dunman_logo.png" alt="Dunman Secondary School" className="oral-partner-logo-img" />
                          <span className="oral-partner-logo-name">Dunman Secondary School</span>
                        </div>
                        <div className="oral-logo-item">
                          <img src="/bartley_logo.png" alt="Bartley Secondary School" className="oral-partner-logo-img" />
                          <span className="oral-partner-logo-name">Bartley Secondary School</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ), document.body)}

              {isExpanded && proj.isPolite && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />
                    <p className="arast-paragraph polite-subtitle">
                      Initiative driven by Polytechnics & ITE (POLITE) Education Technology Committee to provide:
                    </p>

                    <div className="polite-layout-grid">
                      {/* Left Column: Features */}
                      <div className="polite-features-column">
                        
                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <VrHeadsetIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Adaptive (e-practical or immersive) learning contents that are industry relevant
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--violet">
                          <div className="polite-feature-card-icon">
                            <LaptopIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Online (or HBL) learning resources for skills acquisition through a combination of simulations or hybrid learning
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <BarricadeIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Work-based, scenario-based or situation-based form of learning to train critical thinking, creative and problem-solving skills
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--violet">
                          <div className="polite-feature-card-icon">
                            <BookOpenIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            TP is responsible for developing learning packages in the domain of Workplace Safety
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <BuildingIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            The package will benefit around 1500 students across 5 polytechnics
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--violet">
                          <div className="polite-feature-card-icon">
                            <FolderIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            4 topics identified and developed by TP: Ladder Safety, Fire Hazard Check, Fire Safety Equipment Visual Check & Hazard Identification
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <WebVrIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            The package can be accessed via a web browser and Head Mounted Device e.g., Oculus
                          </p>
                        </div>

                      </div>

                      {/* Right Column: Images */}
                      <div className="polite-images-column">
                        <img 
                          src="/polite_vr_mockup.png" 
                          alt="VR simulations overview" 
                          className="polite-vr-image" 
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ), document.body)}

              {isExpanded && proj.isRoleplay && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />

                    {/* Section 1: Top Overview (Image left, text right) */}
                    <div className="roleplay-top-section">
                      <div className="roleplay-avatar-container">
                        <img 
                          src="/roleplay_avatar.png" 
                          alt="Virtual Role-play Avatar" 
                          className="roleplay-avatar-img" 
                        />
                      </div>
                      <div className="roleplay-top-text">
                        <p className="arast-paragraph">
                          In a large class, traditional role-playing can be challenging to implement. In industry settings, a role-play exercise for specific training can take up considerable time to set up.
                        </p>
                        <p className="arast-paragraph">
                          This project attempts to solve the problem by providing a cost-effective alternative to "face-to-face" role-play training using an application that can run on multiple devices.
                        </p>
                      </div>
                    </div>

                    {/* Section 2: Middle Text */}
                    <p className="arast-paragraph roleplay-mid-text">
                      The project proposes a role-play authoring and management platform. The platform enables the creation of customised immersive role-play content using a framework that allows for dynamic content and can also be used to modify the application after launch, reducing development and maintenance costs. The platform allows the domain expert to easily:
                    </p>

                    <div className="arast-divider-sub roleplay-divider-teal"></div>

                    {/* Section 3: Features & Mockup (Reusing polite-layout-grid) */}
                    <div className="polite-layout-grid">
                      {/* Left Column: Features */}
                      <div className="polite-features-column">
                        
                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <ChatPlusIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Create conversation intent
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--violet">
                          <div className="polite-feature-card-icon">
                            <FaceSmileIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Choose from a range of role-play avatars & animations
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <MapPinIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Choose from a range of role-play environments
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--violet">
                          <div className="polite-feature-card-icon">
                            <FaceScanIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            State-of-the-art technologies that can analyse learner facial expressions, speech emotions and language sentiments
                          </p>
                        </div>

                        <div className="polite-feature-card polite-feature-card--teal">
                          <div className="polite-feature-card-icon">
                            <LineChartIcon className="polite-icon-svg" />
                          </div>
                          <p className="polite-feature-card-text">
                            Analyse effectiveness of training
                          </p>
                        </div>

                      </div>

                      {/* Right Column: Image */}
                      <div className="polite-images-column">
                        <img 
                          src="/roleplay_mockup.png" 
                          alt="Roleplay Dashboard Mockup" 
                          className="polite-vr-image" 
                        />
                      </div>
                    </div>

                    {/* Partner Branding Footer */}
                    <div className="arast-branding-footer roleplay-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="roleplay-logo-wrapper">
                        <img src="/jma_logo.png" alt="JMA Research" className="roleplay-partner-logo-img" />
                      </div>
                    </div>

                  </div>
                </div>
              ), document.body)}

              {isExpanded && proj.isSafetyVR && createPortal((
                <div className="arast-expanded-content" onClick={(e) => { e.stopPropagation(); closeProjectModal(); }} role="dialog" aria-modal="true">
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="project-modal-close" onClick={closeProjectModal} aria-label="Close project details">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <h2 className="arast-main-title">Project Overview</h2>
                    <AvatarExplainButton {...proj.avatar} avatarState={avatarState} />

                    {/* Section 1: Top Overview */}
                    <div className="safety-top-section">
                      <div className="safety-media-container">
                        <img 
                          src="/patient_safety_sim.png" 
                          alt="Virtual Emergency Department Simulation" 
                          className="safety-media-img" 
                        />
                      </div>
                      <div className="safety-top-text">
                        <p className="arast-paragraph">
                          Doctors reprise their role in an immersive virtual emergency department treating patients like they do in their everyday practice. The hidden agenda of the game was to impart patient safety education to junior doctors.
                        </p>
                        <p className="arast-paragraph">
                          Gamification helps in driving home a serious topic and increase retention through a fun and safe environment.
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub safety-divider"></div>

                    {/* Section 2: Middle Icons Row */}
                    <div className="safety-mid-section">
                      <p className="arast-paragraph safety-center-text">
                        A collaboration between Changi General Hospital and Temasek Polytechnic, this project aims to institute specific behavioural changes in junior doctors in terms of:
                      </p>

                      <div className="safety-icons-row">
                        <div className="safety-icon-item safety-icon-item--teal">
                          <div className="safety-icon-badge">
                            <SkillsIcon className="safety-svg-icon" />
                          </div>
                          <span className="safety-icon-label">Skills</span>
                        </div>

                        <div className="safety-icon-item safety-icon-item--violet">
                          <div className="safety-icon-badge">
                            <KnowledgeIcon className="safety-svg-icon" />
                          </div>
                          <span className="safety-icon-label">Knowledge</span>
                        </div>

                        <div className="safety-icon-item safety-icon-item--teal">
                          <div className="safety-icon-badge">
                            <AttitudesIcon className="safety-svg-icon" />
                          </div>
                          <span className="safety-icon-label">Attitudes</span>
                        </div>
                      </div>
                    </div>

                    <div className="arast-divider-sub safety-divider"></div>

                    {/* Section 3: Bottom layout */}
                    <div className="safety-bottom-section">
                      <div className="safety-bottom-text">
                        <p className="arast-paragraph">
                          The virtual environment has the potential to be used by large numbers of trainees without budgeting extra costs for instructors or simulated patients. Scheduling of shift workers will also be simplified as the learning can be done at their own time. This translates to savings in manpower and resources.
                        </p>
                      </div>
                      <div className="safety-bottom-media">
                        <img 
                          src="/patient_safety_trainees.png" 
                          alt="Trainees using VR headsets" 
                          className="safety-media-img" 
                        />
                      </div>
                    </div>

                    {/* Partner Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="cgh-logo-wrapper">
                        <div className="cgh-logo-content">
                          <svg width="22" height="22" viewBox="0 0 100 100" fill="none" className="cgh-logo-svg">
                            <rect x="38" y="15" width="24" height="70" fill="#005A9C" rx="2" />
                            <rect x="15" y="38" width="70" height="24" fill="#005A9C" rx="2" />
                            <rect x="42" y="19" width="16" height="62" fill="#FFF" rx="1" />
                            <rect x="19" y="42" width="62" height="16" fill="#FFF" rx="1" />
                            <circle cx="50" cy="50" r="10" fill="#FF7900" />
                          </svg>
                          <div className="cgh-logo-text-container">
                            <span className="cgh-text-primary">Changi General Hospital</span>
                            <span className="cgh-text-secondary">SingHealth</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ), document.body)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
