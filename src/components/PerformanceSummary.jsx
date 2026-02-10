import StatBadge from './StatBadge';
import './PerformanceSummary.css';

function PerformanceSummary({ derivedStats, matchCount }) {
  if (!derivedStats) return null;

  const { winRate, wins, losses, kdaRatio, avgKills, avgDeaths, avgAssists, csPerMin, killParticipation } = derivedStats;

  return (
    <div className="performance-summary">
      <div className="section-header">
        <h3 className="section-title">
          <span className="icon">▸</span>
          Recent Performance
        </h3>
        <span className="text-xs text-muted">{matchCount || 0} games</span>
      </div>

      <div className="perf-badges">
        <StatBadge
          label="Win Rate"
          value={`${winRate}%`}
          subLabel={`${wins}W ${losses}L`}
          accent={winRate >= 55}
        />
        <StatBadge
          label="KDA"
          value={kdaRatio}
          subLabel={`${avgKills}/${avgDeaths}/${avgAssists}`}
          accent={kdaRatio >= 3}
        />
        <StatBadge
          label="CS/min"
          value={csPerMin}
          accent={csPerMin >= 7}
        />
        <StatBadge
          label="Kill Part."
          value={`${killParticipation}%`}
          accent={killParticipation >= 60}
        />
      </div>
    </div>
  );
}

export default PerformanceSummary;
