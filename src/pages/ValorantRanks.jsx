import { useState, useEffect } from 'react';
import { fetchCompetitiveTiers } from '../api/valorantAssets';
import './GamePages.css';

function ValorantRanks() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitiveTiers().then(data => { setSeasons(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Use the last season (most current tier definitions)
  const current = seasons[seasons.length - 1];
  const tiers = current?.tiers?.filter(t => t.tier > 0) || [];

  // Group tiers by division
  const groups = {};
  for (const t of tiers) {
    const div = t.division || t.name;
    if (!groups[div]) groups[div] = [];
    groups[div].push(t);
  }

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Competitive Ranks</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            All competitive tiers from Iron to Radiant
          </p>
        </div>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading ranks...</p></div>
      ) : (
        <div className="ranks-grid">
          {tiers.map(t => (
            <div
              key={t.tier}
              className="rank-card"
              style={{ borderColor: t.color ? `#${t.color.slice(0, 6)}` : 'var(--border-color)' }}
            >
              <div className="rank-icon-wrap">
                {t.largeIcon ? (
                  <img src={t.largeIcon} alt={t.name} className="rank-icon" />
                ) : t.smallIcon ? (
                  <img src={t.smallIcon} alt={t.name} className="rank-icon" />
                ) : (
                  <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>military_tech</span>
                )}
              </div>
              <div className="rank-info">
                <span className="rank-name">{t.name}</span>
                {t.division && t.division !== t.name && (
                  <span className="rank-division">{t.division}</span>
                )}
              </div>
              <span className="rank-tier-num">#{t.tier}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValorantRanks;
