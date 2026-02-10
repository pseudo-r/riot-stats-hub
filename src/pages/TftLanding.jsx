import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTftStatus } from '../api/tftApi';
import './GamePages.css';

const PLATFORMS = [
  { id: 'na1', label: 'NA', region: 'americas' },
  { id: 'euw1', label: 'EUW', region: 'europe' },
  { id: 'kr', label: 'KR', region: 'asia' },
  { id: 'eune1', label: 'EUNE', region: 'europe' },
  { id: 'br1', label: 'BR', region: 'americas' },
  { id: 'jp1', label: 'JP', region: 'asia' },
  { id: 'oc1', label: 'OCE', region: 'americas' },
];

function TftLanding() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('na1');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getTftStatus(platform);
        setStatus(data);
      } catch { setStatus(null); }
    }
    loadStatus();
  }, [platform]);

  const handleSearch = (e) => {
    e.preventDefault();
    const input = searchInput.trim();
    if (!input.includes('#')) return;
    const [name, tag] = input.split('#');
    if (!name || !tag) return;
    const plat = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];
    navigate(`/tft/player/${plat.region}/${plat.id}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
    setSearchInput('');
  };

  const incidents = status?.incidents || [];
  const maintenances = status?.maintenances || [];

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Teamfight Tactics</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Ranked Stats · Match History · Leaderboards
          </p>
        </div>
      </div>

      {/* Platform Status */}
      {status && (
        <div className="game-status-bar">
          <span className="material-icons" style={{ fontSize: '0.875rem', color: incidents.length > 0 ? '#f5a623' : '#00c853' }}>
            {incidents.length > 0 ? 'warning' : 'check_circle'}
          </span>
          <span style={{ fontWeight: 600 }}>{status.name || 'TFT'}</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {incidents.length > 0 ? `${incidents.length} active incident(s)` : 'All systems operational'}
          </span>
          {maintenances.length > 0 && (
            <span className="status-maint">{maintenances.length} scheduled maintenance</span>
          )}
        </div>
      )}

      {/* Incidents detail */}
      {incidents.length > 0 && (
        <div className="game-incidents">
          {incidents.map((inc, i) => (
            <div key={i} className="game-incident-item">
              <strong>{inc.titles?.[0]?.content || 'Incident'}</strong>
              {inc.updates?.[0] && <p>{inc.updates[0].translations?.[0]?.content || inc.updates[0].description || ''}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Hero Search */}
      <div className="game-hero">
        <h2 className="game-hero-heading">Search TFT Player</h2>
        <p className="game-hero-sub">Enter a Riot ID to view TFT ranked stats, match history, and placements</p>

        <form className="game-hero-search" onSubmit={handleSearch}>
          <div className="game-hero-region">
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="game-hero-select"
            >
              {PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="game-hero-input"
            placeholder="Riot ID (e.g. Player#NA1)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="game-hero-btn tft">
            <span className="material-icons">search</span>
          </button>
        </form>
      </div>

      {/* Quick Links */}
      <div className="game-quicklinks">
        <button className="game-quicklink tft" onClick={() => navigate('/tft/leaderboard')}>
          <span className="material-icons">leaderboard</span>
          <div>
            <strong>Leaderboard</strong>
            <span>Challenger / GM / Master</span>
          </div>
        </button>
        <button className="game-quicklink tft" onClick={() => navigate('/tft/comps')}>
          <span className="material-icons">auto_awesome</span>
          <div>
            <strong>Meta Comps</strong>
            <span>Top team compositions</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default TftLanding;
