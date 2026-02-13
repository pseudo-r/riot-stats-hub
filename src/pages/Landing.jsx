import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { PLATFORMS } from '../constants/platforms';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const { favorites } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [platform, setPlatform] = useState('na1');

  const handleSearch = (e) => {
    e.preventDefault();
    const input = searchInput.trim();
    if (!input.includes('#')) return;
    const [name, tag] = input.split('#');
    if (!name || !tag) return;
    const plat = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
    navigate(`/summoner/${plat.region}/${plat.id}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
  };

  return (
    <div className="landing">
      {/* Background effects */}
      <div className="landing-bg" />
      <div className="landing-grid grid-pattern" />
      <div className="landing-glow" />

      <div className="landing-content">
        {/* Badge */}
        <div className="badge landing-badge">
          <span className="live-dot" />
          System Online
        </div>

        {/* Title */}
        <h1 className="landing-title">
          RIOT STATS<br />
          <span className="landing-title-accent">HUB</span>
        </h1>

        <p className="landing-subtitle">
          Elite competitive analytics dashboard for League of Legends.
          Track match history, ranked stats, champion mastery, and live games.
        </p>

        {/* Search */}
        <form className="landing-search" onSubmit={handleSearch}>
          <div className="landing-search-inner">
            <span className="material-icons landing-search-icon">search</span>
            <input
              type="text"
              className="landing-search-input clip-corner-tl"
              placeholder="Enter Riot ID (Name#Tag)"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button className="landing-search-btn clip-corner-br" type="submit">
              <span className="material-icons" style={{ fontSize: '1rem' }}>arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Platform chips */}
        <div className="landing-platforms">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              className={`landing-plat-chip ${platform === p.id ? 'active' : ''}`}
              onClick={() => setPlatform(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Favorites */}
        {favorites?.length > 0 && (
          <div className="landing-favorites">
            <span className="section-title" style={{ marginBottom: '0.5rem' }}>
              <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--primary)' }}>bookmarks</span>
              Favorites
            </span>
            <div className="landing-fav-list">
              {favorites.slice(0, 5).map((fav, i) => (
                <button
                  key={i}
                  className="landing-fav-chip"
                  onClick={() => navigate(`/summoner/${fav.region}/${fav.platform}/${encodeURIComponent(fav.gameName)}/${encodeURIComponent(fav.tagLine)}`)}
                >
                  {fav.gameName}#{fav.tagLine}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feature banner */}
        <div className="landing-features">
          {[
            { icon: 'speed', label: 'Real-time Data' },
            { icon: 'analytics', label: 'Deep Analytics' },
            { icon: 'sports_esports', label: 'Live Games' },
            { icon: 'leaderboard', label: 'Leaderboards' },
          ].map(f => (
            <div key={f.icon} className="landing-feature">
              <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
