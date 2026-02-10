import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    login(username, '');
    navigate('/');
  };

  return (
    <div className="auth-page">
      {/* Left Panel: Immersive Battlefield */}
      <div className="auth-hero">
        {/* Background */}
        <div className="auth-hero-bg">
          <img
            src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg"
            alt="Battlefield"
            className="auth-hero-img"
          />
          <div className="auth-hero-overlay" />
          <div className="auth-hero-grid grid-pattern" />
        </div>

        {/* Particles */}
        <div className="particle p1" />
        <div className="particle p2" />
        <div className="particle p3" />
        <div className="particle p4" />

        {/* Brand */}
        <div className="auth-hero-brand">
          <div className="auth-hero-logo">
            <span className="material-icons" style={{ fontSize: '1.25rem', color: '#fff' }}>bar_chart</span>
          </div>
          <span className="auth-hero-brand-text">Riot Stats Hub</span>
        </div>

        {/* Center content */}
        <div className="auth-hero-content">
          <div className="badge" style={{ marginBottom: '1rem' }}>
            <span className="live-dot" />
            System Online
          </div>
          <h1 className="auth-hero-title">
            Dominate <br />
            <span className="auth-hero-title-accent">The Meta</span>
          </h1>
          <p className="auth-hero-desc">
            Access real-time combat analytics, weapon performance metrics, and global leaderboards.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="auth-hero-stats">
          <div>
            <span className="auth-hero-stat-label">Active Agents</span>
            <span className="auth-hero-stat-value">2.4M</span>
          </div>
          <div>
            <span className="auth-hero-stat-label">Server Latency</span>
            <span className="auth-hero-stat-value text-primary-color">12ms</span>
          </div>
          <div>
            <span className="auth-hero-stat-label">Data Stream</span>
            <span className="auth-hero-stat-value">Secure</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="auth-form-panel">
        <div className="auth-form-grid grid-pattern" />

        {/* Region selector (decorative) */}
        <div className="auth-region-selector">
          <span className="text-muted-color">Region:</span>
          <button className="auth-region-btn">
            NA-West <span className="material-icons" style={{ fontSize: '1.125rem' }}>arrow_drop_down</span>
          </button>
        </div>

        <div className="auth-form-container">
          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <div className="auth-hero-logo" style={{ width: '2rem', height: '2rem' }}>
              <span className="material-icons" style={{ fontSize: '0.875rem', color: '#fff' }}>bar_chart</span>
            </div>
            <span style={{ fontSize: '1.286rem', fontWeight: 700, color: 'var(--text-white)', textTransform: 'uppercase' }}>Riot Stats Hub</span>
          </div>

          {/* Form header */}
          <div className="auth-form-header">
            <h2 className="auth-form-title">Tactical Access</h2>
            <p className="auth-form-subtitle">Enter credentials to sync your loadout.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Riot ID input */}
            <div className="auth-field group">
              <label className="auth-label" htmlFor="riot-id">Riot ID / Email</label>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">person_outline</span>
                <input
                  id="riot-id"
                  type="text"
                  className="auth-input clip-corner-tl"
                  placeholder="OPERATOR#1234"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <div className="auth-input-corner" />
              </div>
            </div>

            {/* Password input */}
            <div className="auth-field group">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password">Passcode</label>
                <a href="#" className="auth-forgot">Forgot code?</a>
              </div>
              <div className="auth-input-wrap">
                <span className="material-icons auth-input-icon">lock_outline</span>
                <input
                  id="password"
                  type="password"
                  className="auth-input clip-corner-br"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <div style={{ paddingTop: '1rem' }}>
              <button type="submit" className="auth-submit clip-corner-br">
                <span className="auth-submit-content">
                  Initialize Login
                  <span className="material-icons" style={{ fontSize: '0.875rem' }}>login</span>
                </span>
                <div className="auth-submit-glitch" />
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Or authenticate with</span>
          </div>

          {/* Social */}
          <div className="auth-social">
            <button className="auth-social-btn">
              <span className="material-icons" style={{ color: '#5865F2', fontSize: '1.25rem' }}>forum</span>
              <span>Discord</span>
            </button>
            <button className="auth-social-btn">
              <span className="material-icons" style={{ fontSize: '1.25rem' }}>sports_esports</span>
              <span>Riot ID</span>
            </button>
          </div>

          {/* Footer */}
          <p className="auth-footer">
            Not a member? <Link to="/register" className="auth-footer-link">Enlist Now</Link>
          </p>

          {/* Status bar */}
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

export default Login;
