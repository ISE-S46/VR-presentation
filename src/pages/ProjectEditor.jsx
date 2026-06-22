import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/ProjectEditor.css';

// SVG Icon Component definitions to match ProjectDetail
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

function VrHeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14l-.5-3.5A2 2 0 0 1 5.5 8h13a2 2 0 0 1 2 2.5L20 14"></path>
      <path d="M4 14v4a2 2 0 0 0 2 2h3l2-3h2l2 3h3a2 2 0 0 0 2-2v-4"></path>
      <line x1="9" y1="14" x2="15" y2="14"></line>
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

function SafetyVrIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

const getIconComponent = (iconName) => {
  const mapping = {
    SecurityShieldIcon,
    AiScannerIcon,
    MriHeartbeatIcon,
    EducationIcon,
    VrHeadsetIcon,
    RoleplayIcon,
    SafetyVrIcon,
  };
  return mapping[iconName] || SecurityShieldIcon;
};

const PRESET_COLORS = [
  '#0d9488', // Teal
  '#7c3aed', // Violet
  '#059669', // Green
  '#0284c7', // Blue
  '#ea580c', // Orange
  '#db2777', // Pink
  '#14b8a6', // Mint
];

export default function ProjectEditor() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Security Check & Data Fetch
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token || token !== 'admin-session-token') {
      navigate('/OurProjects/ProjectDetail');
      return;
    }

    fetch('/projects.json')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch projects in editor:', err);
        setToast({ message: 'Failed to load projects data.', type: 'error' });
        setLoading(false);
      });
  }, [navigate]);

  // Autohide toast notification after 4 seconds
  useEffect(() => {
    if (toast.message) {
      const id = setTimeout(() => setToast({ message: '', type: '' }), 4000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [toast]);

  const activeProject = projects[activeIndex];

  const handleFieldChange = (field, value) => {
    const updated = [...projects];
    updated[activeIndex] = {
      ...updated[activeIndex],
      [field]: value,
    };
    setProjects(updated);
  };

  const handleAvatarFieldChange = (field, value) => {
    const updated = [...projects];
    updated[activeIndex] = {
      ...updated[activeIndex],
      avatar: {
        ...updated[activeIndex].avatar,
        [field]: value,
      },
    };
    setProjects(updated);
  };

  const handleAddProject = () => {
    const nextNum = String(projects.length + 1).padStart(2, '0');
    const newProj = {
      number: nextNum,
      title: 'New Assistive Technology Project',
      desc: 'Insert short project description here.',
      tag: 'Healthcare & VR',
      color: '#0d9488',
      iconName: 'SecurityShieldIcon',
      avatar: {
        projectName: 'NewProject',
        projectTitle: 'New Project Overview',
        variant: 'teal',
        customPrompt: 'Explain this new project in detail...',
      },
    };
    setProjects([...projects, newProj]);
    setActiveIndex(projects.length);
    setToast({ message: 'New project created.', type: 'success' });
  };

  const handleDeleteProject = () => {
    if (projects.length <= 1) {
      setToast({ message: 'Cannot delete the only project.', type: 'error' });
      return;
    }
    const filtered = projects.filter((_, idx) => idx !== activeIndex);
    setProjects(filtered);
    setActiveIndex(0);
    setToast({ message: 'Project deleted.', type: 'success' });
  };

  const moveUp = (index, e) => {
    e.stopPropagation();
    if (index === 0) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setProjects(updated);
    if (activeIndex === index) {
      setActiveIndex(index - 1);
    } else if (activeIndex === index - 1) {
      setActiveIndex(index);
    }
  };

  const moveDown = (index, e) => {
    e.stopPropagation();
    if (index === projects.length - 1) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setProjects(updated);
    if (activeIndex === index) {
      setActiveIndex(index + 1);
    } else if (activeIndex === index + 1) {
      setActiveIndex(index);
    }
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setToast({ message: '', type: '' });

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ projects }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: 'Projects configurations saved successfully!', type: 'success' });
      } else {
        setToast({ message: data.message || 'Failed to save to server.', type: 'error' });
      }
    } catch (err) {
      console.error('Save to server failed:', err);
      setToast({
        message: 'Could not write to local server disk. Please export JSON file and replace it manually.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'projects.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToast({ message: 'Downloaded projects.json configuration backup!', type: 'success' });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/OurProjects/ProjectDetail');
  };

  if (loading) {
    return (
      <div className="route-fallback" role="status" aria-live="polite" style={{ height: '80vh', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        <span className="route-fallback-spinner" />
        <span>Loading Editor Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {toast.message && (
        <div className={`editor-toast editor-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? (
            <svg className="editor-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg className="editor-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <BackButton onClick={() => navigate('/OurProjects/ProjectDetail')} label="Return to Portfolio" />
        <div className="editor-header-actions">
          <button className="editor-btn editor-btn--secondary" onClick={handleDownloadBackup}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
            </svg>
            Export projects.json
          </button>
          <button className="editor-btn editor-btn--primary" onClick={handleSaveToServer} disabled={isSaving}>
            {isSaving ? (
              <span className="route-fallback-spinner" style={{ width: '14px', height: '14px' }} />
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            )}
            Save Changes
          </button>
          <button className="editor-btn editor-btn--secondary" onClick={handleLogout} style={{ border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
            Logout Admin
          </button>
        </div>
      </div>

      <div className="page-header" style={{ marginTop: '1.2rem' }}>
        <span className="section-label">Management System</span>
        <h1 className="page-title">Project Portfolio Editor</h1>
        <p className="page-subtitle">Configure, re-order, edit content, and define Custom AI prompts for your showcase projects.</p>
      </div>

      <div className="editor-container">
        {/* Left selector sidebar */}
        <div className="editor-list-panel">
          <div className="editor-list-title-row">
            <h2 className="editor-list-title">All Projects</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
              {projects.length} Total
            </span>
          </div>

          <div className="editor-list-cards">
            {projects.map((proj, idx) => {
              const ItemIcon = getIconComponent(proj.iconName);
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  className={`editor-item-card ${isActive ? 'editor-item-card--active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="editor-item-stripe" style={{ backgroundColor: proj.color }} />
                  <div className="editor-item-info">
                    <span className="editor-item-number">Project {proj.number}</span>
                    <h3 className="editor-item-title">{proj.title}</h3>
                  </div>

                  <div className="editor-item-actions">
                    <button
                      type="button"
                      className="editor-item-action-btn"
                      onClick={(e) => moveUp(idx, e)}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="editor-item-action-btn"
                      onClick={(e) => moveDown(idx, e)}
                      disabled={idx === projects.length - 1}
                      title="Move Down"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="editor-add-btn" onClick={handleAddProject}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Project
          </button>
        </div>

        {/* Right editor details form */}
        <div className="glass-card editor-form-panel">
          {activeProject ? (
            <div className="editor-form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Editing Project {activeProject.number}:</span> 
                  {activeProject.title ? (activeProject.title.length > 30 ? activeProject.title.substring(0, 30) + '...' : activeProject.title) : 'Untitled'}
                </h2>
                <button type="button" className="editor-btn editor-btn--danger" onClick={handleDeleteProject} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete Project
                </button>
              </div>

              <div className="editor-grid-fields">
                <div className="editor-field">
                  <label className="editor-label">Display Number</label>
                  <input
                    type="text"
                    className="editor-input"
                    value={activeProject.number || ''}
                    onChange={(e) => handleFieldChange('number', e.target.value)}
                    placeholder="e.g. 01"
                  />
                </div>

                <div className="editor-field">
                  <label className="editor-label">Tag Category Label</label>
                  <input
                    type="text"
                    className="editor-input"
                    value={activeProject.tag || ''}
                    onChange={(e) => handleFieldChange('tag', e.target.value)}
                    placeholder="e.g. Healthcare & VR"
                  />
                </div>

                <div className="editor-field editor-field--span-all">
                  <label className="editor-label">Project Title</label>
                  <input
                    type="text"
                    className="editor-input"
                    value={activeProject.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="Enter project headline"
                  />
                </div>

                <div className="editor-field editor-field--span-all">
                  <label className="editor-label">Short Description</label>
                  <textarea
                    className="editor-textarea"
                    value={activeProject.desc || ''}
                    onChange={(e) => handleFieldChange('desc', e.target.value)}
                    placeholder="Describe this project in 1-2 sentences."
                  />
                </div>

                <div className="editor-field">
                  <label className="editor-label">Visual Icon SVG Mapping</label>
                  <select
                    className="editor-select"
                    value={activeProject.iconName || 'SecurityShieldIcon'}
                    onChange={(e) => handleFieldChange('iconName', e.target.value)}
                  >
                    <option value="SecurityShieldIcon">Shield / Security (SecurityShieldIcon)</option>
                    <option value="AiScannerIcon">AI Scanner / Circle (AiScannerIcon)</option>
                    <option value="MriHeartbeatIcon">Heartbeat / Healthcare (MriHeartbeatIcon)</option>
                    <option value="EducationIcon">Graduation Cap / Education (EducationIcon)</option>
                    <option value="VrHeadsetIcon">VR Headset / Technology (VrHeadsetIcon)</option>
                    <option value="RoleplayIcon">Users / Roleplay (RoleplayIcon)</option>
                    <option value="SafetyVrIcon">Cross Shield / Safety (SafetyVrIcon)</option>
                  </select>
                </div>

                <div className="editor-field">
                  <label className="editor-label">Theme Color Accent</label>
                  <div className="editor-color-input-row">
                    <input
                      type="color"
                      className="editor-color-picker"
                      value={activeProject.color || '#0d9488'}
                      onChange={(e) => handleFieldChange('color', e.target.value)}
                    />
                    <div className="editor-preset-colors">
                      {PRESET_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          className={`editor-preset-color-dot ${activeProject.color === col ? 'editor-preset-color-dot--active' : ''}`}
                          style={{ backgroundColor: col }}
                          onClick={() => handleFieldChange('color', col)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="editor-field editor-checkbox-row">
                  <input
                    type="checkbox"
                    id="isArast"
                    className="editor-checkbox"
                    checked={!!activeProject.isArast}
                    onChange={(e) => handleFieldChange('isArast', e.target.checked)}
                  />
                  <label className="editor-label" htmlFor="isArast" style={{ cursor: 'pointer', margin: 0 }}>
                    Enable Custom Media Overview (Show images/details panel)
                  </label>
                </div>
              </div>

              {/* Avatar Narration settings */}
              <h3 className="editor-section-title" style={{ marginTop: '1rem' }}>AI Avatar Narration Settings</h3>
              
              <div className="editor-grid-fields">
                <div className="editor-field">
                  <label className="editor-label">Avatar Project Tag</label>
                  <input
                    type="text"
                    className="editor-input"
                    value={activeProject.avatar?.projectName || ''}
                    onChange={(e) => handleAvatarFieldChange('projectName', e.target.value)}
                    placeholder="e.g. ARAST"
                  />
                </div>

                <div className="editor-field">
                  <label className="editor-label">Avatar Project Display Title</label>
                  <input
                    type="text"
                    className="editor-input"
                    value={activeProject.avatar?.projectTitle || ''}
                    onChange={(e) => handleAvatarFieldChange('projectTitle', e.target.value)}
                    placeholder="e.g. Augmented Reality Application for Security Training (ARAST)"
                  />
                </div>

                <div className="editor-field">
                  <label className="editor-label">Avatar Highlight Theme</label>
                  <select
                    className="editor-select"
                    value={activeProject.avatar?.variant || 'teal'}
                    onChange={(e) => handleAvatarFieldChange('variant', e.target.value)}
                  >
                    <option value="teal">Teal Highlight Theme</option>
                    <option value="violet">Violet Highlight Theme</option>
                  </select>
                </div>

                <div className="editor-field editor-field--span-all">
                  <label className="editor-label">Avatar Narration Speech Prompt (GPT)</label>
                  <textarea
                    className="editor-textarea editor-avatar-prompt"
                    value={activeProject.avatar?.customPrompt || ''}
                    onChange={(e) => handleAvatarFieldChange('customPrompt', e.target.value)}
                    placeholder="Write detailed narration script here. This script is sent to the LLM to guide speech."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="editor-empty-state">
              <svg className="editor-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="9"></line>
                <line x1="9" y1="13" x2="15" y2="13"></line>
                <line x1="9" y1="17" x2="13" y2="17"></line>
              </svg>
              <h3>No Project Selected</h3>
              <p>Please select a project from the sidebar list or add a new one to begin editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
