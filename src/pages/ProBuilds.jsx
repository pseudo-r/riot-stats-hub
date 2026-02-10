import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallengerLeague, getMatchIds, getMatchDetail, getAccountByPuuid, getRegionForPlatform } from '../api/riotApi';
import { getLatestVersion, getChampionMap, championIconUrl, itemIconUrl, getSpellKey, spellIconUrl } from '../api/dataDragon';
import './ProBuilds.css';

const PLATFORMS = [
  { id: 'na1', label: 'NA', region: 'americas' },
  { id: 'euw1', label: 'EUW', region: 'europe' },
  { id: 'kr', label: 'KR', region: 'asia' },
];

function ProBuilds() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('na1');
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState('');
  const [champMap, setChampMap] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setBuilds([]);

      try {
        const ver = await getLatestVersion();
        setVersion(ver);
        const map = await getChampionMap();
        setChampMap(map);

        const region = PLATFORMS.find(p => p.id === platform)?.region || 'americas';

        // Get challenger league and pick top 10 by LP
        const league = await getChallengerLeague(platform);
        const topPlayers = (league.entries || [])
          .sort((a, b) => b.leaguePoints - a.leaguePoints)
          .slice(0, 10);

        // For each top player, get their most recent ranked match
        const buildResults = [];


        for (const player of topPlayers.slice(0, 6)) {
          try {
            // Resolve their Riot ID
            const account = await getAccountByPuuid(region, player.puuid);

            // Get their last match ID
            const matchIds = await getMatchIds(region, player.puuid, { count: 1, queue: 420 });
            if (!matchIds || matchIds.length === 0) continue;

            // Get match details
            const match = await getMatchDetail(region, matchIds[0]);
            const participant = match?.info?.participants?.find(p => p.puuid === player.puuid);
            if (!participant) continue;

            const champ = map[participant.championId];
            const items = [
              participant.item0, participant.item1, participant.item2,
              participant.item3, participant.item4, participant.item5, participant.item6,
            ].filter(id => id && id > 0);

            buildResults.push({
              playerName: account?.gameName || player.summonerName || 'Unknown',
              tagLine: account?.tagLine || '',
              lp: player.leaguePoints,
              wins: player.wins,
              losses: player.losses,
              championId: participant.championId,
              championName: champ?.name || participant.championName,
              championKey: champ?.id || participant.championName,
              win: participant.win,
              kills: participant.kills,
              deaths: participant.deaths,
              assists: participant.assists,
              items,
              cs: participant.totalMinionsKilled + (participant.neutralMinionsKilled || 0),
              gameDuration: match.info.gameDuration,
              spell1: participant.summoner1Id,
              spell2: participant.summoner2Id,
              puuid: player.puuid,
              region,
              platform,
            });
          } catch {
            // Skip players that fail (rate limited, etc)
            continue;
          }
        }

        setBuilds(buildResults);
      } catch (err) {
        setError(err.message || 'Failed to load pro builds');
      }
      setLoading(false);
    }
    load();
  }, [platform]);

  const handlePlayerClick = (build) => {
    navigate(`/summoner/${build.region}/${build.platform}/${encodeURIComponent(build.playerName)}/${encodeURIComponent(build.tagLine)}`);
  };

  return (
    <div className="main-content">
      <div className="pb-header">
        <div>
          <h1 className="pb-title">
            <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>military_tech</span>
            Pro Builds
          </h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Latest builds from top Challenger players — live from Riot API
          </p>
        </div>
      </div>

      {/* Region */}
      <div className="pb-filters">
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

      {/* Builds */}
      {loading ? (
        <div className="pb-loading">
          <span className="material-icons spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}>autorenew</span>
          <p className="text-muted-color">Fetching builds from top Challengers...</p>
          <p className="text-muted-color" style={{ fontSize: '0.714rem' }}>This may take a moment (loading real match data)</p>
        </div>
      ) : error ? (
        <div className="pb-error">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--loss)' }}>error_outline</span>
          <p>{error}</p>
        </div>
      ) : builds.length === 0 ? (
        <div className="pb-empty">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>search_off</span>
          <p>No builds found. Try a different region.</p>
        </div>
      ) : (
        <div className="pb-build-list">
          {builds.map((build, i) => (
            <div
              key={i}
              className={`pb-build-card ${build.win ? 'win' : 'loss'}`}
              onClick={() => handlePlayerClick(build)}
            >
              {/* Left accent bar */}
              <div className="pb-build-bar" />

              {/* Champion */}
              <div className="pb-build-champ">
                <img
                  src={championIconUrl(version, build.championKey)}
                  alt={build.championName}
                  className="pb-build-champ-img"
                />
                <div className="pb-build-spells">
                  <img src={spellIconUrl(version, getSpellKey(build.spell1))} alt="" className="pb-spell-img" />
                  <img src={spellIconUrl(version, getSpellKey(build.spell2))} alt="" className="pb-spell-img" />
                </div>
              </div>

              {/* Player info */}
              <div className="pb-build-player">
                <div className="pb-build-player-name">{build.playerName}</div>
                <div className="pb-build-player-meta">
                  <span className="text-primary-color">{build.lp.toLocaleString()} LP</span>
                  <span>Challenger</span>
                </div>
                <div className="pb-build-champ-name">{build.championName}</div>
              </div>

              {/* KDA */}
              <div className="pb-build-kda">
                <div className="pb-build-kda-nums">
                  <span className="text-primary-color">{build.kills}</span>
                  <span className="text-loss-color"> / {build.deaths} / </span>
                  <span>{build.assists}</span>
                </div>
                <div className="text-muted-color" style={{ fontSize: '0.714rem' }}>
                  {build.deaths === 0 ? 'Perfect' : ((build.kills + build.assists) / build.deaths).toFixed(2)} KDA
                </div>
                <div className="pb-build-result">{build.win ? 'VICTORY' : 'DEFEAT'}</div>
              </div>

              {/* Items */}
              <div className="pb-build-items">
                {build.items.map((itemId, j) => (
                  <img
                    key={j}
                    src={itemIconUrl(version, itemId)}
                    alt={`Item ${itemId}`}
                    className="pb-item-img"
                  />
                ))}
              </div>

              {/* CS / Duration */}
              <div className="pb-build-stats">
                <span>{build.cs} CS</span>
                <span>{Math.floor(build.gameDuration / 60)}m</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProBuilds;
