import { useState, useEffect } from 'react';
import { fetchTraits } from '../api/tftAssets';
import './GamePages.css';

function TftTraits() {
  const [traits, setTraits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchTraits().then(data => {
      const map = new Map();
      data.forEach(t => map.set(t.name, t));
      setTraits([...map.values()]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = traits.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Traits</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {traits.length} TFT traits · Synergies & breakpoints
          </p>
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search traits..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading traits...</p></div>
      ) : (
        <div className="tft-traits-grid">
          {filtered.map(t => (
            <div
              key={t.apiName}
              className={`tft-trait-card ${expanded === t.apiName ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === t.apiName ? null : t.apiName)}
            >
              <div className="tft-trait-header">
                {t.icon && <img src={t.icon} alt={t.name} className="tft-trait-icon" loading="lazy" />}
                <h3 className="tft-trait-name">{t.name}</h3>
              </div>
              <p className="tft-trait-desc">{t.desc?.replace(/<[^>]*>/g, '').slice(0, expanded === t.apiName ? undefined : 120) || 'No description'}{t.desc?.length > 120 && expanded !== t.apiName ? '...' : ''}</p>
              {t.effects?.length > 0 && (
                <div className="tft-trait-effects">
                  {t.effects.map((eff, i) => (
                    <div key={i} className="tft-trait-effect">
                      <span className="tft-effect-count">{eff.minUnits}{eff.maxUnits ? `-${eff.maxUnits}` : '+'}</span>
                      <span className="tft-effect-desc">
                        {eff.style != null && <span className={`tft-effect-style style-${eff.style}`}>●</span>}
                        {Object.entries(eff.variables || {}).filter(([, v]) => v !== 0 && v != null).map(([k, v]) => `${k}: ${v}`).join(', ') || 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TftTraits;
