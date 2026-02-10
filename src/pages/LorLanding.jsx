import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLorStatus } from '../api/lorApi';
import './GamePages.css';

const REGIONS = [
  { id: 'americas', label: 'Americas' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' },
  { id: 'sea', label: 'SEA' },
];

function LorLanding() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('americas');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getLorStatus(region);
        setStatus(data);
      } catch { setStatus(null); }
    }
    loadStatus();
  }, [region]);

  const incidents = status?.incidents || [];
  const maintenances = status?.maintenances || [];

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge lor">LoR</div>
        <div>
          <h1 className="game-page-title">Legends of Runeterra</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Digital card game set in the League of Legends universe
          </p>
        </div>
      </div>

      <div className="game-sunset-banner">
        <span className="material-icons" style={{ color: '#f5a623' }}>warning</span>
        <span>Legends of Runeterra was sunset by Riot Games. Data may be limited or unavailable.</span>
      </div>

      {/* Platform Status */}
      {status && (
        <div className="game-status-bar lor">
          <span className="material-icons" style={{ fontSize: '0.875rem', color: incidents.length > 0 ? '#f5a623' : '#00c853' }}>
            {incidents.length > 0 ? 'warning' : 'check_circle'}
          </span>
          <span style={{ fontWeight: 600 }}>{status.name || 'LoR'}</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {incidents.length > 0 ? `${incidents.length} active incident(s)` : 'Service status available'}
          </span>
          {maintenances.length > 0 && (
            <span className="status-maint">{maintenances.length} maintenance</span>
          )}
        </div>
      )}

      <div className="game-controls">
        <div className="game-tabs">
          {REGIONS.map(r => (
            <button key={r.id} className={`filter-chip ${region === r.id ? 'active' : ''}`} onClick={() => setRegion(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="game-quicklinks">
        <button className="game-quicklink lor" onClick={() => navigate('/lor/leaderboard')}>
          <span className="material-icons">leaderboard</span>
          <div>
            <strong>Leaderboard</strong>
            <span>Top ranked players</span>
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="game-stat-card wide" style={{ marginTop: '0.5rem' }}>
        <h3 className="game-stat-title">
          <span className="material-icons" style={{ fontSize: '1rem', color: '#38b6ff' }}>info</span>
          About Legends of Runeterra
        </h3>
        <p className="text-muted-color" style={{ fontSize: '0.857rem', lineHeight: 1.6 }}>
          Legends of Runeterra was a free-to-play digital collectible card game developed by Riot Games. 
          The game featured champions and factions from League of Legends in a strategic card battle format. 
          While the game has been sunset, historical ranked leaderboard data may still be available through the API.
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="game-api-chip">
            <span className="material-icons" style={{ fontSize: '0.875rem' }}>check</span>
            lor-ranked-v1
          </div>
          <div className="game-api-chip">
            <span className="material-icons" style={{ fontSize: '0.875rem' }}>check</span>
            lor-match-v1
          </div>
          <div className="game-api-chip">
            <span className="material-icons" style={{ fontSize: '0.875rem' }}>check</span>
            lor-status-v1
          </div>
          <div className="game-api-chip warn">
            <span className="material-icons" style={{ fontSize: '0.875rem' }}>lock</span>
            lor-deck-v1 (OAuth2)
          </div>
          <div className="game-api-chip warn">
            <span className="material-icons" style={{ fontSize: '0.875rem' }}>lock</span>
            lor-inventory-v1 (OAuth2)
          </div>
        </div>
      </div>
    </div>
  );
}

export default LorLanding;
