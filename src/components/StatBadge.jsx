import './StatBadge.css';

function StatBadge({ label, value, subLabel, accent }) {
  return (
    <div className={`stat-badge ${accent ? 'stat-badge-accent' : ''}`}>
      <span className="stat-badge-value text-mono">{value}</span>
      <span className="stat-badge-label">{label}</span>
      {subLabel && <span className="stat-badge-sub text-xs text-muted">{subLabel}</span>}
    </div>
  );
}

export default StatBadge;
