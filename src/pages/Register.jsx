import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './Login.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    login(username, email);
    navigate('/');
  };

  return (
    <div className="auth-page">
      {/* Left Panel: Immersive Battlefield */}
      <div className="auth-hero">
        <div className="auth-hero-bg">
          <img
            src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg"
            alt="Battlefield"
            className="auth-hero-img"
          />
          <div className="auth-hero-overlay" />
          <div className="auth-hero-grid grid-pattern" />
        </div>

        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />

        <div className="auth-hero-brand">
          <div className="auth-hero-logo">
            <span className="material-icons" style={{ fontSize: '1.25rem', color: '#fff' }}>bar_chart</span>
          </div>
          <span className="auth-hero-brand-text">Riot Stats Hub</span>
        </div>

        <div className="auth-hero-content">
          <div className="badge" style={{ marginBottom: '1rem' }}>
            <span className="live-dot" />
            Recruitment Open
          </div>
          <h1 className="auth-hero-title">
            Join The <br />
            <span className="auth-hero-title-accent">Ranks</span>
          </h1>
          <p className="auth-hero-desc">
            Create your tactical profile and gain access to full analytics capabilities.
          </p>
        </div>

        <div className="auth-hero-stats">
          <div>
            <span className="auth-hero-stat-label">New Recruits</span>
            <span className="auth-hero-stat-value">+12.4k</span>
          </div>
          <div>
            <span className="auth-hero-stat-label">Global Reach</span>
            <span className="auth-hero-stat-value text-primary-color">12 Regions</span>
          </div>
          <div>
            <span className="auth-hero-stat-label">Uptime</span>
            <span className="auth-hero-stat-value">99.9%</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="auth-form-panel">
        <div className="auth-form-grid grid-pattern" />
        <div className="auth-form-container">
          <div className="auth-mobile-logo">
            <div className="auth-hero-logo" style={{ width: '2rem', height: '2rem' }}>
              <span className="material-icons" style={{ fontSize: '0.875rem', color: '#fff' }}>bar_chart</span>
            </div>
            <span style={{ fontSize: '1.286rem', fontWeight: 700, color: 'var(--text-white)', textTransform: 'uppercase' }}>Riot Stats Hub</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-form-title">Enlist Now</h2>
            <p className="auth-form-subtitle">Create your tactical profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field group">
              <label className="auth-label" htmlFor="reg-username">Call Sign</label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">badge</span>
                <input id="reg-username" type="text" className="auth-input clip-corner-tl"
                  placeholder="OPERATOR_X" value={username} onChange={e => setUsername(e.target.value)} />
                <div className="auth-input-corner" />
              </div>
            </div>
            <div className="auth-field group">
              <label className="auth-label" htmlFor="reg-email">Secure Channel</label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">email</span>
                <input id="reg-email" type="email" className="auth-input"
                  placeholder="operator@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="auth-field group">
              <label className="auth-label" htmlFor="reg-password">Access Key</label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">lock_outline</span>
                <input id="reg-password" type="password" className="auth-input clip-corner-br"
                  placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <div style={{ paddingTop: '1rem' }}>
              <button type="submit" className="auth-submit clip-corner-br">
                <span className="auth-submit-content">
                  Create Profile
                  <span className="material-icons" style={{ fontSize: '0.875rem' }}>person_add</span>
                </span>
                <div className="auth-submit-glitch" />
              </button>
            </div>
          </form>

          <p className="auth-footer">
            Already enlisted? <Link to="/login" className="auth-footer-link">Sign In</Link>
          </p>

          <div className="auth-status-bar">
            <span className="auth-status-item">
              <span className="live-dot" style={{ width: 6, height: 6 }} /> Servers: Online
            </span>
            <span>v2.4.0-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
