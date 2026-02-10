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

function ValorantLeaderboard() {
  const [shard, setShard] = useState('na');
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actName, setActName] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // First get content to find current act
        const content = await getValContent(shard);
        const currentAct = content?.acts?.find(a => a.isActive && a.type === 'act');
        setActName(currentAct?.name || 'Current Act');

        if (currentAct) {
          const lb = await getValLeaderboard(shard, currentAct.id, { size: 200 });
          setLeaderboard(lb);
        } else {
          setError('No active competitive act found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
      }
      setLoading(false);
    }
    load();
  }, [shard]);

  const players = leaderboard?.players || [];

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Competitive Leaderboard</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {actName} · Top ranked players
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
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading competitive leaderboard...</p></div>
      ) : error ? (
        <div className="game-error">
          <span className="material-icons">error_outline</span>
          <p>{error}</p>
          <p className="text-muted-color" style={{ fontSize: '0.786rem' }}>Competitive leaderboard may require a production API key.</p>
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
                  <th>RR</th>
                  <th>Wins</th>
                  <th>Games</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.puuid || i} className="game-row">
                    <td style={{ textAlign: 'center', fontWeight: 700, color: i < 3 ? '#ff4655' : 'var(--text-muted)' }}>
                      {p.leaderboardRank || i + 1}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                      {p.gameName ? `${p.gameName}#${p.tagLine}` : 'Anonymous'}
                    </td>
                    <td style={{ color: '#ff4655', fontWeight: 700 }}>{p.rankedRating}</td>
                    <td style={{ color: 'var(--primary)' }}>{p.numberOfWins}</td>
                    <td>{p.numberOfWins + (p.competitiveTier || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="game-empty">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>search_off</span>
          <p>No leaderboard data available. This may require a production API key.</p>
        </div>
      )}
    </div>
  );
}

export default ValorantLeaderboard;
