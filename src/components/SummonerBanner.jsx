import { useState, useEffect } from 'react';
import { getLatestVersion, profileIconUrl } from '../api/dataDragon';
import './SummonerBanner.css';

function SummonerBanner({ account, summoner, leagueEntries, activeGame, onRefresh }) {
  const [ddVersion, setDdVersion] = useState('14.10.1');

  useEffect(() => {
    getLatestVersion().then(setDdVersion);
  }, []);

  if (!account || !summoner) return null;

  const soloEntry = leagueEntries?.find(e => e.queueType === 'RANKED_SOLO_5x5');
  const tierDisplay = soloEntry ? `${soloEntry.tier} ${soloEntry.rank}` : 'Unranked';
  const lpDisplay = soloEntry ? `${soloEntry.leaguePoints} LP` : '';
  const winsLosses = soloEntry ? `${soloEntry.wins}W ${soloEntry.losses}L` : '';
  const winRate = soloEntry ? Math.round((soloEntry.wins / (soloEntry.wins + soloEntry.losses)) * 100) : 0;

  const tierIcon = soloEntry?.tier
    ? { 'IRON': 'looks_one', 'BRONZE': 'looks_two', 'SILVER': 'filter_3', 'GOLD': 'star', 'PLATINUM': 'workspace_premium', 'EMERALD': 'eco', 'DIAMOND': 'diamond', 'MASTER': 'military_tech', 'GRANDMASTER': 'local_fire_department', 'CHALLENGER': 'whatshot' }[soloEntry.tier] || 'shield'
    : 'shield';

  return (
    <div className="summoner-banner">
      {/* Background layers */}
      <div className="banner-bg-splash" />
      <div className="banner-bg-gradient" />
      <div className="banner-bg-grid grid-pattern-cyan" />

      {/* Content */}
      <div className="banner-content">
        {/* Profile icon */}
        <div className="banner-icon-wrap">
          <div className="banner-icon-frame">
            <div className="banner-icon-inner-border" />
            <img
              src={profileIconUrl(ddVersion, summoner.profileIconId)}
              alt="Summoner Icon"
              className="banner-icon-img"
            />
          </div>
          <div className="banner-level">LVL {summoner.summonerLevel}</div>
        </div>

        {/* Info */}
        <div className="banner-info">
          <div className="banner-name-row">
            <h1 className="banner-name">{account.gameName.toUpperCase()}</h1>
            <span className="badge">{account.tagLine?.toUpperCase()}</span>
          </div>

          <div className="banner-meta">
            {activeGame && (
              <>
                <span className="banner-status">
                  <span className="live-dot" /> Online
                </span>
                <span className="banner-dot" />
              </>
            )}
            {soloEntry && (
              <>
                <span>Prev: <span className="text-white-color font-bold">{tierDisplay} {lpDisplay}</span></span>
                <span className="banner-dot" />
                <span>{winsLosses}</span>
              </>
            )}
          </div>

          <div className="banner-actions">
            <button className="btn btn-primary" onClick={onRefresh}>
              <span className="material-icons" style={{ fontSize: '0.875rem' }}>refresh</span> Update
            </button>
            {activeGame && (
              <button className="btn btn-secondary">
                <span className="live-dot-red" style={{ width: 8, height: 8 }} /> Live Game
              </button>
            )}
          </div>
        </div>

        {/* Rank hexagon */}
        {soloEntry && (
          <div className="banner-rank-hex">
            <div className="hex-glow" />
            <div className="hex-shape">
              <span className="material-icons hex-icon">{tierIcon}</span>
            </div>
            <div className="hex-label">
              <h2 className="hex-tier">{tierDisplay.toUpperCase()}</h2>
              <p className="hex-lp">{lpDisplay} <span className="text-muted-color">|</span> WR {winRate}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummonerBanner;
