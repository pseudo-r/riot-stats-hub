import { useState, useEffect } from 'react';
import { getLorRankedLeaderboard } from '../api/lorApi';
import './GamePages.css';

const REGIONS = [
  { id: 'americas', label: 'Americas' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' },
];

function LorOverview() {
  const [region, setRegion] = useState('americas');
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getLorRankedLeaderboard(region);
        setLeaderboard(data);
      } catch (err) {
        setError(err.message || 'Failed to load LoR data');
      }
      setLoading(false);
    }
    load();
  }, [region]);

  const players = leaderboard?.players || [];

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge lor">LoR</div>
        <div>
          <h1 className="game-page-title">Legends of Runeterra</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Ranked leaderboard · Note: LoR has been sunset by Riot Games
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {REGIONS.map(r => (
            <button key={r.id} className={`filter-chip ${region === r.id ? 'active' : ''}`} onClick={() => setRegion(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="game-sunset-banner">
        <span className="material-icons" style={{ color: '#f5a623' }}>warning</span>
        <span>Legends of Runeterra was sunset by Riot Games. Data may be limited or unavailable.</span>
      </div>

      {loading ? (
        <div className="game-loading">
          <span className="material-icons spin">autorenew</span>
          <p>Loading LoR leaderboard...</p>
        </div>
      ) : error ? (
        <div className="game-error">
          <span className="material-icons">error_outline</span>
          <p>{error}</p>
          <p className="text-muted-color" style={{ fontSize: '0.786rem' }}>The LoR API may no longer be available as the game has been discontinued.</p>
        </div>
      ) : players.length > 0 ? (
        <>
          <p className="text-muted-color" style={{ fontSize: '0.786rem', margin: '0.5rem 0' }}>{players.length} players</p>
          <div className="game-table-wrap">
            <table className="game-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                  <th>Player</th>
                  <th>LP</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.name || i} className="game-row">
                    <td style={{ textAlign: 'center', fontWeight: 700, color: i < 3 ? '#38b6ff' : 'var(--text-muted)' }}>
                      {p.rank || i + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>{p.name || 'LoR Player'}</td>
                    <td style={{ color: '#38b6ff', fontWeight: 700 }}>{p.lp?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="game-empty">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>search_off</span>
          <p>No leaderboard data available for this region.</p>
        </div>
      )}
    </div>
  );
}

export default LorOverview;
