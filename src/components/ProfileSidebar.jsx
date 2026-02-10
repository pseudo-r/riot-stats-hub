import { useState, useEffect } from 'react';
import RankBadge from './RankBadge';
import { getLatestVersion, championIconUrl } from '../api/dataDragon';
import './ProfileSidebar.css';

function ProfileSidebar({ leagueEntries, championMastery }) {
  const [ddVersion, setDdVersion] = useState('14.10.1');

  useEffect(() => {
    getLatestVersion().then(setDdVersion);
  }, []);

  const soloEntry = leagueEntries?.find(e => e.queueType === 'RANKED_SOLO_5x5');
  const flexEntry = leagueEntries?.find(e => e.queueType === 'RANKED_FLEX_SR');
  const topChamps = championMastery?.slice(0, 5) || [];

  return (
    <div className="profile-sidebar">
      {/* Ranked Badges */}
      <div className="sidebar-section">
        <RankBadge entry={soloEntry} queueLabel="Solo / Duo" />
      </div>
      <div className="sidebar-section">
        <RankBadge entry={flexEntry} queueLabel="Flex 5v5" />
      </div>

      {/* Top Champions */}
      <div className="sidebar-section">
        <div className="section-header">
          <span className="section-title">
            <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--primary)' }}>star</span>
            Top Champions
          </span>
          <a href="#" className="sidebar-view-all">View All</a>
        </div>
        <div className="mastery-list">
          {topChamps.length === 0 ? (
            <div className="mastery-empty">
              <span className="material-icons" style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>emoji_events</span>
              <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>No mastery data</span>
            </div>
          ) : (
            topChamps.map((champ) => {
              const maxPts = 200000;
              const pct = Math.min((champ.championPoints / maxPts) * 100, 100);
              return (
                <div key={champ.championId} className="mastery-row">
                  <div className="mastery-champ-icon-wrap">
                    <img
                      src={championIconUrl(ddVersion, champ.championId)}
                      alt=""
                      className="mastery-champ-icon"
                    />
                    <span className="mastery-level">M{champ.championLevel}</span>
                  </div>
                  <div className="mastery-info">
                    <div className="mastery-name">{champ.championId}</div>
                    <div className="mastery-points">
                      {(champ.championPoints / 1000).toFixed(0)}k pts
                    </div>
                    <div className="progress-bar" style={{ marginTop: '0.25rem' }}>
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
