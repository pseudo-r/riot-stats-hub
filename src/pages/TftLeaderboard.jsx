import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTftChallengerLeague, getTftGrandmasterLeague, getTftMasterLeague } from '../api/tftApi';
import { getAccountByPuuid } from '../api/riotApi';
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

function TftLeaderboard() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('na1');
  const [tier, setTier] = useState('challenger');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (tier === 'challenger') data = await getTftChallengerLeague(platform);
        else if (tier === 'grandmaster') data = await getTftGrandmasterLeague(platform);
        else data = await getTftMasterLeague(platform);

        const sorted = (data.entries || [])
          .sort((a, b) => b.leaguePoints - a.leaguePoints)
          .map((e, i) => ({ ...e, rank_pos: i + 1 }));
        setEntries(sorted);
      } catch (err) {
        setError(err.message || 'Failed to load TFT leaderboard');
        setEntries([]);
      }
      setLoading(false);
    }
    load();
  }, [platform, tier]);

  const tierColors = { challenger: '#f5a623', grandmaster: '#ff4d4d', master: '#9b59b6' };

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Teamfight Tactics Leaderboard</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Live ranked standings from the TFT API
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {PLATFORMS.map(p => (
            <button key={p.id} className={`filter-chip ${platform === p.id ? 'active' : ''}`} onClick={() => setPlatform(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="game-tier-tabs">
        {['challenger', 'grandmaster', 'master'].map(t => (
          <button key={t} className={`game-tier-tab ${tier === t ? 'active' : ''}`} style={{ '--tier-color': tierColors[t] }} onClick={() => setTier(t)}>
            {t === 'challenger' ? '🏆' : t === 'grandmaster' ? '⚔️' : '🛡️'} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="game-loading">
          <span className="material-icons spin">autorenew</span>
          <p>Loading TFT {tier} data...</p>
        </div>
      ) : error ? (
        <div className="game-error">
          <span className="material-icons">error_outline</span>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <p className="text-muted-color" style={{ fontSize: '0.786rem', margin: '0.5rem 0' }}>{entries.length} players</p>
          <div className="game-table-wrap">
            <table className="game-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                  <th>Summoner</th>
                  <th>LP</th>
                  <th>Win Rate</th>
                  <th>W</th>
                  <th>L</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => {
                  const games = e.wins + e.losses;
                  const wr = games > 0 ? Math.round((e.wins / games) * 100) : 0;
                  return (
                    <tr key={e.summonerId || e.puuid} className="game-row">
                      <td style={{ textAlign: 'center', fontWeight: 700, color: e.rank_pos <= 3 ? tierColors[tier] : 'var(--text-muted)' }}>
                        {e.rank_pos}
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                        {e.summonerName || 'TFT Player'}
                      </td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{e.leaguePoints.toLocaleString()}</span>
                        <span className="text-muted-color" style={{ fontSize: '0.714rem', marginLeft: '0.25rem' }}>LP</span>
                      </td>
                      <td>
                        <span className={wr >= 55 ? 'text-primary-color' : wr <= 48 ? 'text-loss-color' : ''} style={{ fontWeight: 600 }}>{wr}%</span>
                      </td>
                      <td style={{ color: 'var(--primary)' }}>{e.wins}</td>
                      <td style={{ color: 'var(--loss)' }}>{e.losses}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default TftLeaderboard;
