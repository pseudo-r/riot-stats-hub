import { useState, useEffect } from 'react';
import { getValContent, getValLeaderboard } from '../api/valorantApi';
import './GamePages.css';

const SHARDS = [
  { id: 'na', label: 'NA' },
  { id: 'eu', label: 'EU' },
  { id: 'ap', label: 'AP' },
  { id: 'kr', label: 'KR' },
  { id: 'br', label: 'BR' },
];

function ValorantOverview() {
  const [shard, setShard] = useState('na');
  const [content, setContent] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAct, setActiveAct] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Get content (agents, maps, acts)
        const contentData = await getValContent(shard);
        setContent(contentData);

        // Find the active competitive act
        const acts = contentData?.acts || [];
        const currentAct = acts.find(a => a.isActive && a.type === 'act');
        if (currentAct) {
          setActiveAct(currentAct);
          // Get leaderboard for current act
          try {
            const lb = await getValLeaderboard(shard, currentAct.id, { size: 100 });
            setLeaderboard(lb);
          } catch (lbErr) {
            // Leaderboard might not be available for dev keys
            setLeaderboard(null);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load Valorant data');
      }
      setLoading(false);
    }
    load();
  }, [shard]);

  const agents = content?.characters?.filter(c => c.name && !c.name.includes('Null')) || [];
  const maps = content?.maps?.filter(m => m.name && m.name !== 'Null UI Data') || [];
  const gameModes = content?.gameModes?.filter(m => m.name) || [];

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Valorant</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Game content & competitive leaderboard
          </p>
        </div>
      </div>

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
        <div className="game-loading">
          <span className="material-icons spin">autorenew</span>
          <p>Loading Valorant data...</p>
        </div>
      ) : error ? (
        <div className="game-error">
          <span className="material-icons">error_outline</span>
          <p>{error}</p>
        </div>
      ) : (
        <div className="game-overview-grid">
          {/* Active Act */}
          {activeAct && (
            <div className="game-stat-card wide">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>military_tech</span>
                Current Competitive Act
              </h3>
              <div className="game-stat-value" style={{ color: '#ff4655' }}>{activeAct.name || 'Active Act'}</div>
              <p className="text-muted-color" style={{ fontSize: '0.786rem' }}>ID: {activeAct.id?.substring(0, 8)}...</p>
            </div>
          )}

          {/* Agents */}
          <div className="game-content-card">
            <h3 className="game-stat-title">
              <span className="material-icons" style={{ fontSize: '1rem' }}>people</span>
              Agents <span className="game-count-badge">{agents.length}</span>
            </h3>
            <div className="game-content-grid">
              {agents.slice(0, 24).map(agent => (
                <div key={agent.id} className="game-content-item">
                  <div className="game-content-icon val-agent">{agent.name?.charAt(0)}</div>
                  <span className="game-content-name">{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maps */}
          <div className="game-content-card">
            <h3 className="game-stat-title">
              <span className="material-icons" style={{ fontSize: '1rem' }}>map</span>
              Maps <span className="game-count-badge">{maps.length}</span>
            </h3>
            <div className="game-content-list">
              {maps.map(map => (
                <div key={map.id} className="game-content-list-item">
                  <span className="material-icons" style={{ fontSize: '0.875rem', color: '#ff4655' }}>place</span>
                  <span>{map.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Modes */}
          <div className="game-content-card">
            <h3 className="game-stat-title">
              <span className="material-icons" style={{ fontSize: '1rem' }}>sports_esports</span>
              Game Modes <span className="game-count-badge">{gameModes.length}</span>
            </h3>
            <div className="game-content-list">
              {gameModes.slice(0, 10).map(mode => (
                <div key={mode.id || mode.name} className="game-content-list-item">
                  <span className="material-icons" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>videogame_asset</span>
                  <span>{mode.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          {leaderboard && leaderboard.players?.length > 0 && (
            <div className="game-matches-card wide">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>leaderboard</span>
                Top Ranked Players
              </h3>
              <div className="game-table-wrap">
                <table className="game-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                      <th>Player</th>
                      <th>RR</th>
                      <th>Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.players.slice(0, 50).map((p, i) => (
                      <tr key={p.puuid || i} className="game-row">
                        <td style={{ textAlign: 'center', fontWeight: 700, color: i < 3 ? '#ff4655' : 'var(--text-muted)' }}>
                          {p.leaderboardRank || i + 1}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                          {p.gameName ? `${p.gameName}#${p.tagLine}` : 'Anonymous'}
                        </td>
                        <td style={{ color: '#ff4655', fontWeight: 700 }}>{p.rankedRating}</td>
                        <td>{p.numberOfWins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!leaderboard && (
            <div className="game-stat-card wide">
              <h3 className="game-stat-title">
                <span className="material-icons" style={{ fontSize: '1rem' }}>info</span>
                Competitive Leaderboard
              </h3>
              <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
                Competitive leaderboard requires a production API key. Content data is loaded above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ValorantOverview;
