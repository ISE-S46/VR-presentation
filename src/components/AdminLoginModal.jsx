import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const usernameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        usernameRef.current?.focus();
      }, 100);
      setError('');
      setUsername('');
      setPassword('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token to localStorage for persistent session
        localStorage.setItem('admin_token', data.token);
        onSuccess(data.token);
        onClose();
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="admin-login-overlay-portal">
          <style>{`
            .admin-login-overlay-portal {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100vw;
              height: 100vh;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1.5rem;
            }
            .admin-login-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.45);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }
            .admin-login-card {
              position: relative;
              width: 100%;
              max-width: 400px;
              background: rgba(255, 255, 255, 0.82);
              backdrop-filter: blur(20px) saturate(1.2);
              -webkit-backdrop-filter: blur(20px) saturate(1.2);
              border: 1px solid rgba(31, 122, 107, 0.15);
              border-radius: var(--radius-lg, 20px);
              box-shadow: var(--shadow-float, 0 20px 48px rgba(0, 0, 0, 0.08)), 0 0 40px rgba(31, 122, 107, 0.05);
              padding: 2.2rem 2rem;
              display: flex;
              flex-direction: column;
              z-index: 10;
              overflow: hidden;
            }
            .admin-login-glow {
              position: absolute;
              top: -60px;
              right: -60px;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, transparent 70%);
              pointer-events: none;
            }
            .admin-login-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 1.8rem;
            }
            .admin-login-title-row {
              display: flex;
              flex-direction: column;
            }
            .admin-login-badge {
              font-size: 0.72rem;
              font-family: 'Space Grotesk', sans-serif;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: var(--accent-teal, #1f7a6b);
              font-weight: 700;
              margin-bottom: 0.2rem;
            }
            .admin-login-title {
              font-size: 1.5rem;
              font-weight: 700;
              margin: 0;
              color: var(--text-heading, #1d1d1f);
            }
            .admin-login-close {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.04);
              color: var(--text-secondary, #6e6e73);
              cursor: pointer;
              transition: all var(--transition, 0.25s);
            }
            .admin-login-close:hover {
              background: rgba(239, 68, 68, 0.1);
              color: #ef4444;
              transform: rotate(90deg);
            }
            .admin-login-form {
              display: flex;
              flex-direction: column;
              gap: 1.25rem;
            }
            .admin-login-field {
              display: flex;
              flex-direction: column;
              gap: 0.45rem;
            }
            .admin-login-label {
              font-size: 0.8rem;
              font-weight: 600;
              color: var(--text-secondary, #6e6e73);
            }
            .admin-login-input {
              width: 100%;
              padding: 0.75rem 1rem;
              font-size: 0.95rem;
              background: rgba(0, 0, 0, 0.025);
              border: 1px solid rgba(0, 0, 0, 0.06);
              border-radius: var(--radius-md, 16px);
              outline: none;
              color: var(--text-primary, #1d1d1f);
              transition: all var(--transition, 0.25s);
            }
            .admin-login-input:focus {
              background: #fff;
              border-color: var(--accent-teal, #1f7a6b);
              box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
            }
            .admin-login-error {
              font-size: 0.8rem;
              color: #ef4444;
              background: rgba(239, 68, 68, 0.06);
              border: 1px solid rgba(239, 68, 68, 0.15);
              padding: 0.65rem 0.85rem;
              border-radius: var(--radius-sm, 12px);
              line-height: 1.4;
            }
            .admin-login-submit {
              width: 100%;
              margin-top: 0.5rem;
              padding: 0.8rem;
              background: linear-gradient(135deg, var(--accent-teal, #1f7a6b), #0d9488);
              color: #fff;
              border-radius: var(--radius-pill, 999px);
              font-size: 0.95rem;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
              transition: all var(--transition, 0.25s);
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
            }
            .admin-login-submit:hover:not(:disabled) {
              transform: translateY(-1.5px);
              box-shadow: 0 6px 16px rgba(13, 148, 136, 0.3);
              filter: brightness(1.04);
            }
            .admin-login-submit:active:not(:disabled) {
              transform: translateY(0);
            }
            .admin-login-submit:disabled {
              opacity: 0.65;
              cursor: not-allowed;
            }
            .admin-login-spinner {
              width: 16px;
              height: 16px;
              border: 2px solid rgba(255, 255, 255, 0.2);
              border-top-color: #fff;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
          `}</style>

          {/* Animated Backdrop */}
          <motion.div
            className="admin-login-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Animated Modal Card */}
          <motion.div
            className="admin-login-card"
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <div className="admin-login-glow" />
            
            <div className="admin-login-header">
              <div className="admin-login-title-row">
                <span className="admin-login-badge">Protected Area</span>
                <h2 className="admin-login-title">Admin Access</h2>
              </div>
              <button
                type="button"
                className="admin-login-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form className="admin-login-form" onSubmit={handleSubmit}>
              <div className="admin-login-field">
                <label className="admin-login-label" htmlFor="username">Username</label>
                <input
                  ref={usernameRef}
                  id="username"
                  className="admin-login-input"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="admin-login-field">
                <label className="admin-login-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  className="admin-login-input"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {error && <div className="admin-login-error">{error}</div>}

              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="admin-login-spinner" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Access Editor</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
