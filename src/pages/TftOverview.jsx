import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resolveAccount, getRegionForPlatform } from '../api/riotApi';
import { getTftSummoner, getTftLeagueEntries, getTftMatchIds, getTftMatchDetail } from '../api/tftApi';
import './GamePages.css';

function TftOverview() {
  const { region, platform, name, tag } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [summoner, setSummoner] = useState(null);
  const [league, setLeague] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!name || !tag) return;
      setLoading(true);
      setError(null);
      try {
        const reg = region || 'americas';
        const plat = platform || 'na1';

        // Resolve account
        const acc = await resolveAccount(reg, name, tag);
        setAccount(acc);

        // TFT Summoner
        const sum = await getTftSummoner(plat, acc.puuid);
        setSummoner(sum);

        // TFT League
        const entries = await getTftLeagueEntries(plat, acc.puuid);
        setLeague(entries || []);

        // TFT Matches (last 10)
        const matchIds = await getTftMatchIds(reg, acc.puuid, { count: 10 });
        const matchDetails = [];
        for (const id of (matchIds || []).slice(0, 5)) {
          try {
            const detail = await getTftMatchDetail(reg, id);
            matchDetails.push(detail);
          } catch { continue; }
        }
        setMatches(matchDetails);
      } catch (err) {
        setError(err.message || 'Failed to load TFT data');
      }
      setLoading(false);
    }
    load();
  }, [region, platform, name, tag]);

  const rankedEntry = league.find(e => e.queueType === 'RANKED_TFT');

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Teamfight Tactics</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Player Overview
          </p>
        </div>
      </div>

      {loading ? (
        <div className="game-loading">
          <span className="material-icons spin">autorenew</span>
          <p>Loading TFT data for {name}#{tag}...</p>
        </div>
      ) : error ? (
        <div className="game-error">
          <span className="material-icons">error_outline</span>
          <p>{error}</p>
        </div>
      ) : (
        <div className="game-overview-grid">
          {/* Profile */}
          <div className="game-profile-card">
            <div className="game-profile-icon">
              <img src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summoner?.profileIconId || 1}.png`} alt="" />
            </div>
            <div>
              <h2 className="game-profile-name">{account?.gameName} <span className="game-profile-tag">#{account?.tagLine}</span></h2>
              <p className="text-muted-color">Level {summoner?.summonerLevel}</p>
            </div>
          </div>

          {/* Ranked */}
          <div className="game-stat-card">
            <h3 className="game-stat-title">
              <span className="material-icons" style={{ fontSize: '1rem' }}>emoji_events</span>
              TFT Ranked
            </h3>
            {rankedEntry ? (
              <div>
                <div className="game-stat-value" style={{ color: 'var(--primary)' }}>
                  {rankedEntry.tier} {rankedEntry.rank}
                </div>
                <p className="text-muted-color" style={{ fontSize: '0.786rem' }}>
                  {rankedEntry.leaguePoints} LP · {rankedEntry.wins}W {rankedEntry.losses}L
                </p>
              </div>
            ) : (
              <div className="game-stat-value text-muted-color">Unranked</div>
            )}
          </div>

          {/* Match History */}
          <div className="game-matches-card">
            <h3 className="game-stat-title">
              <span className="material-icons" style={{ fontSize: '1rem' }}>history</span>
              Recent Matches
            </h3>
            {matches.length > 0 ? (
              <div className="game-match-list">
                {matches.map((m, i) => {
                  const participant = m.info?.participants?.find(p => p.puuid === account?.puuid);
                  if (!participant) return null;
                  return (
                    <div key={i} className={`game-match-row ${participant.placement <= 4 ? 'win' : 'loss'}`}>
                      <span className="game-match-placement" style={{ color: participant.placement <= 4 ? 'var(--primary)' : 'var(--loss)' }}>
                        #{participant.placement}
                      </span>
                      <span className="game-match-level">Level {participant.level}</span>
                      <span className="text-muted-color">{participant.last_round} rounds</span>
                      <div className="game-match-units">
                        {participant.units?.slice(0, 6).map((u, j) => (
                          <span key={j} className={`game-match-unit tier-${u.tier}`}>
                            {u.character_id?.replace('TFT_', '').replace(/Set\d+_/, '').substring(0, 4)}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-color">No recent TFT matches found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TftOverview;
