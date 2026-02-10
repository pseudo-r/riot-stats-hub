import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallengerLeague, getGrandmasterLeague, getMasterLeague, getAccountByPuuid, getRegionForPlatform } from '../api/riotApi';
import './Leaderboards.css';

const PLATFORMS = [
  { id: 'na1', label: 'NA' },
  { id: 'euw1', label: 'EUW' },
  { id: 'kr', label: 'KR' },
  { id: 'eune1', label: 'EUNE' },
  { id: 'br1', label: 'BR' },
  { id: 'jp1', label: 'JP' },
  { id: 'oc1', label: 'OCE' },
];

const QUEUES = [
  { id: 'RANKED_SOLO_5x5', label: 'Solo/Duo' },
  { id: 'RANKED_FLEX_SR', label: 'Flex' },
];

function Leaderboards() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('na1');
  const [queue, setQueue] = useState('RANKED_SOLO_5x5');
  const [tier, setTier] = useState('challenger');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tierCounts, setTierCounts] = useState({ challenger: 0, grandmaster: 0, master: 0 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (tier === 'challenger') {
          data = await getChallengerLeague(platform, queue);
        } else if (tier === 'grandmaster') {
          data = await getGrandmasterLeague(platform, queue);
        } else {
          data = await getMasterLeague(platform, queue);
        }

        const sorted = (data.entries || [])
          .sort((a, b) => b.leaguePoints - a.leaguePoints)
          .map((e, i) => ({ ...e, rank_pos: i + 1 }));
        setEntries(sorted);

        // Update count for current tier
        setTierCounts(prev => ({ ...prev, [tier]: sorted.length }));
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
        setEntries([]);
      }
      setLoading(false);
    }
    load();
  }, [platform, queue, tier]);

  const handlePlayerClick = async (entry) => {
    // Try to navigate to the player's profile
    const region = getRegionForPlatform(platform);
    try {
      const account = await getAccountByPuuid(region, entry.puuid);
      if (account?.gameName && account?.tagLine) {
        navigate(`/summoner/${region}/${platform}/${encodeURIComponent(account.gameName)}/${encodeURIComponent(account.tagLine)}`);
      }
    } catch {
      // Some accounts may not resolve
    }
  };

  const tierColors = {
    challenger: '#f5a623',
    grandmaster: '#ff4d4d',
    master: '#9b59b6',
  };

  return (
    <div className="main-content">
      <div className="lb-header">
        <h1 className="lb-title">
          <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>leaderboard</span>
          Leaderboards
        </h1>
        <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
          Live ranked standings from the Riot API
        </p>
      </div>

      {/* Controls */}
      <div className="lb-controls">
        <div className="lb-region-tabs">
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              className={`filter-chip ${platform === p.id ? 'active' : ''}`}
              onClick={() => setPlatform(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="lb-queue-tabs">
          {QUEUES.map(q => (
            <button
              key={q.id}
              className={`filter-chip ${queue === q.id ? 'active' : ''}`}
              onClick={() => setQueue(q.id)}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tier tabs */}
      <div className="lb-tier-tabs">
        {['challenger', 'grandmaster', 'master'].map(t => (
          <button
            key={t}
            className={`lb-tier-tab ${tier === t ? 'active' : ''}`}
            style={{ '--tier-color': tierColors[t] }}
            onClick={() => setTier(t)}
          >
            <span className="lb-tier-tab-icon">
              {t === 'challenger' ? '🏆' : t === 'grandmaster' ? '⚔️' : '🛡️'}
            </span>
            <span className="lb-tier-tab-label">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            {tierCounts[t] > 0 && <span className="lb-tier-tab-count">{tierCounts[t]}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="lb-loading">
          <span className="material-icons spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}>autorenew</span>
          <p className="text-muted-color">Loading {tier} data for {PLATFORMS.find(p => p.id === platform)?.label}...</p>
        </div>
      ) : error ? (
        <div className="lb-error">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--loss)' }}>error_outline</span>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="lb-meta">
            <span>{entries.length} players</span>
            <span className="text-muted-color">·</span>
            <span className="text-muted-color">{QUEUES.find(q => q.id === queue)?.label}</span>
          </div>
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th className="lb-th-rank">#</th>
                  <th className="lb-th-name">Summoner</th>
                  <th>LP</th>
                  <th>Win Rate</th>
                  <th>W</th>
                  <th>L</th>
                  <th>Games</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 100).map(entry => {
                  const games = entry.wins + entry.losses;
                  const wr = games > 0 ? Math.round((entry.wins / games) * 100) : 0;
                  return (
                    <tr
                      key={entry.summonerId || entry.puuid}
                      className="lb-row"
                      onClick={() => handlePlayerClick(entry)}
                    >
                      <td className="lb-rank">
                        <span className={`lb-rank-num ${entry.rank_pos <= 3 ? 'top' : ''}`} style={entry.rank_pos <= 3 ? { color: tierColors[tier] } : {}}>
                          {entry.rank_pos}
                        </span>
                      </td>
                      <td className="lb-name">
                        <span className="lb-summoner-name">{entry.summonerName || `Player`}</span>
                      </td>
                      <td className="lb-lp">
                        <span className="lb-lp-value">{entry.leaguePoints.toLocaleString()}</span>
                        <span className="lb-lp-label">LP</span>
                      </td>
                      <td className="lb-wr">
                        <div className="lb-wr-bar" style={{ '--wr': `${wr}%` }}>
                          <div className="lb-wr-fill" />
                        </div>
                        <span className={`lb-wr-text ${wr >= 55 ? 'high' : wr <= 48 ? 'low' : ''}`}>{wr}%</span>
                      </td>
                      <td className="lb-w">{entry.wins}</td>
                      <td className="lb-l">{entry.losses}</td>
                      <td className="lb-games text-muted-color">{games}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {entries.length > 100 && (
            <p className="lb-more text-muted-color">
              Showing top 100 of {entries.length} players
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Leaderboards;
