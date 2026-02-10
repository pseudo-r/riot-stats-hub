import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getValContent, getValStatus } from '../api/valorantApi';
import './GamePages.css';

const SHARDS = [
  { id: 'na', label: 'NA' },
  { id: 'eu', label: 'EU' },
  { id: 'ap', label: 'AP' },
  { id: 'kr', label: 'KR' },
  { id: 'br', label: 'BR' },
];

function ValorantLanding() {
  const navigate = useNavigate();
  const [shard, setShard] = useState('na');
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [contentData, statusData] = await Promise.allSettled([
          getValContent(shard),
          getValStatus(shard),
        ]);
        if (contentData.status === 'fulfilled') setContent(contentData.value);
        if (statusData.status === 'fulfilled') setStatus(statusData.value);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [shard]);

  const currentAct = content?.acts?.find(a => a.isActive && a.type === 'act');
  const agentCount = content?.characters?.filter(c => c.name && !c.name.includes('Null')).length || 0;
  const mapCount = content?.maps?.filter(m => m.name && m.name !== 'Null UI Data').length || 0;
  const modeCount = content?.gameModes?.filter(m => m.name && m.name !== 'Null UI Data').length || 0;
  const incidents = status?.incidents || [];
  const maintenances = status?.maintenances || [];

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Valorant</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Tactical FPS · {currentAct ? currentAct.name : 'Current Act'}
          </p>
        </div>
      </div>

      {/* Platform Status */}
      {status && (
        <div className="game-status-bar val">
          <span className="material-icons" style={{ fontSize: '0.875rem', color: incidents.length > 0 ? '#f5a623' : '#00c853' }}>
            {incidents.length > 0 ? 'warning' : 'check_circle'}
          </span>
          <span style={{ fontWeight: 600 }}>{status.name || 'Valorant'}</span>
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
              {inc.updates?.[0] && <p>{inc.updates[0].translations?.[0]?.content || ''}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="game-controls">
        <div className="game-tabs">
          {SHARDS.map(s => (
            <button key={s.id} className={`filter-chip ${shard === s.id ? 'active' : ''}`} onClick={() => setShard(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading Valorant data...</p></div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="game-quicklinks">
            <button className="game-quicklink val" onClick={() => navigate('/valorant/agents')}>
              <span className="material-icons">people</span>
              <div>
                <strong>Agents</strong>
                <span>{agentCount} playable agents</span>
              </div>
            </button>
            <button className="game-quicklink val" onClick={() => navigate('/valorant/maps')}>
              <span className="material-icons">map</span>
              <div>
                <strong>Maps</strong>
                <span>{mapCount} active maps</span>
              </div>
            </button>
            <button className="game-quicklink val" onClick={() => navigate('/valorant/leaderboard')}>
              <span className="material-icons">leaderboard</span>
              <div>
                <strong>Leaderboard</strong>
                <span>Competitive rankings</span>
              </div>
            </button>
          </div>

          {/* Content Stats Overview */}
          <div className="game-overview-grid">
            <div className="game-stat-card">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>military_tech</span>
                Current Act
              </h3>
              <div className="game-stat-value" style={{ color: '#ff4655' }}>{currentAct?.name || 'N/A'}</div>
            </div>

            <div className="game-stat-card">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>people</span>
                Agents
              </h3>
              <div className="game-stat-value" style={{ color: '#ff4655' }}>{agentCount}</div>
            </div>

            <div className="game-stat-card">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>map</span>
                Maps
              </h3>
              <div className="game-stat-value" style={{ color: '#ff4655' }}>{mapCount}</div>
            </div>

            <div className="game-stat-card">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>sports_esports</span>
                Game Modes
              </h3>
              <div className="game-stat-value" style={{ color: '#ff4655' }}>{modeCount}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ValorantLanding;
