import './RankBadge.css';

function RankBadge({ entry, queueLabel }) {
  if (!entry) {
    return (
      <div className="rank-card">
        <div className="rank-card-header">
          <span className="material-icons rank-card-icon">shield</span>
          <span className="rank-card-label">{queueLabel || 'Ranked'}</span>
        </div>
        <div className="rank-card-body rank-card-unranked">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-dark)' }}>do_not_disturb</span>
          <span className="text-muted-color" style={{ fontSize: '0.857rem' }}>Unranked</span>
        </div>
      </div>
    );
  }

  const { tier, rank, leaguePoints, wins, losses } = entry;
  const winRate = Math.round((wins / (wins + losses)) * 100);
  const tDisplay = `${tier.charAt(0) + tier.slice(1).toLowerCase()} ${rank}`;

  const tierIcon = { 'IRON': 'looks_one', 'BRONZE': 'looks_two', 'SILVER': 'filter_3', 'GOLD': 'star', 'PLATINUM': 'workspace_premium', 'EMERALD': 'eco', 'DIAMOND': 'diamond', 'MASTER': 'military_tech', 'GRANDMASTER': 'local_fire_department', 'CHALLENGER': 'whatshot' }[tier] || 'shield';

  return (
    <div className="rank-card">
      <div className="rank-card-header">
        <span className="material-icons rank-card-icon">{tierIcon}</span>
        <span className="rank-card-label">{queueLabel || 'Ranked'}</span>
        <span className={`rank-card-wr ${winRate >= 50 ? 'wr-positive' : 'wr-negative'}`}>
          {winRate}%
        </span>
      </div>
      <div className="rank-card-body">
        <div className="rank-tier">{tDisplay}</div>
        <div className="rank-lp">{leaguePoints} LP</div>
        <div className="rank-wl">
          <span className="text-primary-color">{wins}W</span> <span className="text-loss-color">{losses}L</span>
        </div>

        {/* LP progress bar */}
        <div className="rank-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${leaguePoints}%` }} />
          </div>
          <div className="rank-progress-labels">
            <span>{leaguePoints} LP</span>
            <span>100 LP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankBadge;
