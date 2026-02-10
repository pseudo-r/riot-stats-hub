import { useState, useEffect } from 'react';
import { fetchGameModes, fetchGameModeEquippables } from '../api/valorantAssets';
import './GamePages.css';

function ValorantGameModes() {
  const [modes, setModes] = useState([]);
  const [equippables, setEquippables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGameModes(), fetchGameModeEquippables()])
      .then(([m, e]) => { setModes(m); setEquippables(e); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Game Modes</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {modes.length} modes · {equippables.length} equippables
          </p>
        </div>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading game modes...</p></div>
      ) : (
        <>
          <div className="gamemodes-grid">
            {modes.map(m => (
              <div key={m.uuid} className="gamemode-card">
                <div className="gamemode-icon-wrap">
                  {m.icon ? (
                    <img src={m.icon} alt={m.name} className="gamemode-icon" />
                  ) : (
                    <span className="material-icons" style={{ fontSize: '2rem', color: '#ff4655' }}>sports_esports</span>
                  )}
                </div>
                <div className="gamemode-info">
                  <h3 className="gamemode-name">{m.name || 'Unknown Mode'}</h3>
                  <div className="gamemode-meta">
                    {m.duration && <span className="gamemode-tag">Duration: {m.duration}</span>}
                    {m.roundsPerHalf != null && <span className="gamemode-tag">{m.roundsPerHalf} rounds/half</span>}
                    {m.allowsMatchTimeouts && <span className="gamemode-tag">Timeouts</span>}
                    {m.isTeamVoiceAllowed && <span className="gamemode-tag">Team Voice</span>}
                    {m.isMinimapHidden && <span className="gamemode-tag warn">No Minimap</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {equippables.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>inventory_2</span>
                Equippables
              </h3>
              <div className="equippables-grid">
                {equippables.map(e => (
                  <div key={e.uuid} className="equippable-card">
                    {e.icon ? (
                      <img src={e.icon} alt={e.name} className="equippable-icon" />
                    ) : (
                      <span className="material-icons" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>build</span>
                    )}
                    <span className="equippable-name">{e.name}</span>
                    {e.category && <span className="equippable-cat">{e.category}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ValorantGameModes;
