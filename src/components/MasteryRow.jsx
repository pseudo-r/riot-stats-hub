import { useState, useEffect } from 'react';
import { getLatestVersion, championIconUrl, getChampionMap } from '../api/dataDragon';
import { formatNumber } from '../utils/stats';
import './MasteryRow.css';

function MasteryRow({ mastery }) {
  const [ddVersion, setDdVersion] = useState('14.10.1');
  const [champMap, setChampMap] = useState({});

  useEffect(() => {
    getLatestVersion().then(setDdVersion);
    getChampionMap().then(setChampMap);
  }, []);

  if (!mastery) return null;

  const { championId, championLevel, championPoints } = mastery;
  const champData = champMap[championId];
  const champName = champData?.name || `Champion ${championId}`;
  const champIcon = champData ? championIconUrl(ddVersion, champData.id) : null;

  const levelColors = {
    7: 'var(--accent-cyan)',
    6: 'var(--accent-purple)',
    5: 'var(--color-defeat)',
  };

  const borderColor = levelColors[championLevel] || 'var(--border-color)';

  return (
    <div className="mastery-row" style={{ '--mastery-color': borderColor }}>
      <div className="mastery-icon-wrap">
        {champIcon ? (
          <img src={champIcon} alt={champName} className="mastery-icon" />
        ) : (
          <div className="mastery-icon mastery-placeholder">{championId}</div>
        )}
        <span className="mastery-level-badge" style={{ background: borderColor }}>
          {championLevel}
        </span>
      </div>

      <div className="mastery-info">
        <span className="mastery-name">{champName}</span>
        <span className="mastery-points text-xs text-mono text-muted">
          {formatNumber(championPoints)} pts
        </span>
      </div>

      <div className="mastery-bar-wrap">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((championPoints / 500000) * 100, 100)}%`,
              background: borderColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MasteryRow;
