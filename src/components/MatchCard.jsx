import { useState, useEffect } from 'react';
import { getLatestVersion, championIconUrl, spellIconUrl, itemIconUrl } from '../api/dataDragon';
import { formatDuration, formatTimeAgo, getQueueName } from '../utils/stats';
import './MatchCard.css';

function MatchCard({ match, puuid }) {
  const [ddVersion, setDdVersion] = useState('14.10.1');

  useEffect(() => {
    getLatestVersion().then(setDdVersion);
  }, []);

  if (!match?.info || !match?.metadata) return null;

  const participant = match.info.participants?.find(p => p.puuid === puuid);
  if (!participant) return null;

  const isWin = participant.win;
  const queueName = getQueueName(match.info.queueId);
  const duration = formatDuration(match.info.gameDuration);
  const timeAgo = formatTimeAgo(match.info.gameEndTimestamp || match.info.gameCreation);

  const kills = participant.kills;
  const deaths = participant.deaths;
  const assists = participant.assists;
  const kda = deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2);
  const cs = participant.totalMinionsKilled + (participant.neutralMinionsKilled || 0);
  const csPerMin = match.info.gameDuration > 0 ? (cs / (match.info.gameDuration / 60)).toFixed(1) : '0.0';
  const killParticipation = (() => {
    const team = match.info.participants.filter(p => p.teamId === participant.teamId);
    const totalKills = team.reduce((acc, p) => acc + p.kills, 0);
    if (totalKills === 0) return 0;
    return Math.round(((kills + assists) / totalKills) * 100);
  })();

  const items = [
    participant.item0, participant.item1, participant.item2,
    participant.item3, participant.item4, participant.item5, participant.item6,
  ];

  const multiKill = participant.pentaKills > 0 ? 'Penta Kill'
    : participant.quadraKills > 0 ? 'Quadra Kill'
    : participant.tripleKills > 0 ? 'Triple Kill'
    : participant.doubleKills > 0 ? 'Double Kill'
    : null;

  return (
    <div className={`match-row ${isWin ? 'match-win' : 'match-loss'}`}>
      {/* Left border glow */}
      <div className={`match-bar ${isWin ? 'match-bar-win' : 'match-bar-loss'}`} />

      <div className="match-row-inner">
        {/* Result panel */}
        <div className={`match-result ${isWin ? 'match-result-win' : 'match-result-loss'}`}>
          <div>
            <div className={`match-result-text ${isWin ? 'text-primary-color' : 'text-loss-color'}`}>
              {isWin ? 'Victory' : 'Defeat'}
            </div>
            <div className="match-mode">{queueName}</div>
          </div>
          <div className="match-meta-bottom">
            <div className="match-duration">{duration}</div>
            <div className="match-ago">{timeAgo}</div>
          </div>
        </div>

        {/* Champion + spells */}
        <div className="match-champion-area">
          <div className="match-champ-wrap">
            <div className="match-champ-icon-wrap">
              <img
                src={championIconUrl(ddVersion, participant.championName)}
                alt={participant.championName}
                className={`match-champ-icon ${!isWin ? 'match-champ-loss' : ''}`}
              />
              <span className="match-champ-level">{participant.champLevel}</span>
            </div>
            <div className="match-spells">
              <div className="match-spell-col">
                {participant.summoner1Id && (
                  <div className="match-spell-box">
                    <img src={spellIconUrl(ddVersion, participant.summoner1Id)} alt="" />
                  </div>
                )}
                {participant.summoner2Id && (
                  <div className="match-spell-box">
                    <img src={spellIconUrl(ddVersion, participant.summoner2Id)} alt="" />
                  </div>
                )}
              </div>
              <div className="match-spell-col">
                <div className="match-rune-box">R1</div>
                <div className="match-rune-box">R2</div>
              </div>
            </div>
          </div>
        </div>

        {/* KDA */}
        <div className="match-kda">
          <div className="match-kda-numbers">
            {kills}<span className="match-kda-sep">/</span>
            <span className="text-loss-color">{deaths}</span>
            <span className="match-kda-sep">/</span>{assists}
          </div>
          <div className="match-kda-ratio">
            <span className={isWin ? 'text-white-color font-bold' : 'text-secondary-color font-bold'}>{kda}</span> KDA
          </div>
          {multiKill && (
            <span className={`badge ${multiKill === 'Penta Kill' ? 'badge-yellow' : 'badge-loss'}`} style={{ marginTop: '0.25rem', fontSize: '0.5rem' }}>
              {multiKill}
            </span>
          )}
        </div>

        {/* CS & Stats */}
        <div className="match-stats">
          <div className="match-stat-line">CS {cs} <span className="text-muted-color">({csPerMin})</span></div>
          <div className="match-stat-line text-loss-color font-bold">P/Kill {killParticipation}%</div>
          <div className="match-stat-line text-muted-color" style={{ fontSize: '0.714rem' }}>
            Control Ward {participant.visionWardsBoughtInGame || 0}
          </div>
        </div>

        {/* Items */}
        <div className="match-items">
          {items.map((itemId, i) => (
            <div key={i} className={`match-item-box ${!isWin && itemId ? 'match-item-loss' : ''}`}>
              {itemId > 0 && (
                <img src={itemIconUrl(ddVersion, itemId)} alt="" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expand button */}
      <button className={`match-expand ${isWin ? 'match-expand-win' : 'match-expand-loss'}`}>
        <span className="material-icons">expand_more</span>
      </button>
    </div>
  );
}

export default MatchCard;
