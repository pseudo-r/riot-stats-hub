import { useState, useEffect } from 'react';
import { fetchAugments } from '../api/tftAssets';
import './GamePages.css';

function TftAugments() {
  const [augments, setAugments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAugments().then(data => {
      // Dedupe by name
      const map = new Map();
      data.filter(a => a.name).forEach(a => map.set(a.name, a));
      setAugments([...map.values()]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = augments.filter(a =>
    (a.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Augments</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {augments.length} augments in the pool
          </p>
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search augments..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading augments...</p></div>
      ) : filtered.length === 0 ? (
        <div className="game-empty">
          <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>search_off</span>
          <p>No augments found. The current TFT set data may not include augment data.</p>
        </div>
      ) : (
        <div className="tft-augments-grid">
          {filtered.map(a => (
            <div key={a.apiName} className="tft-augment-card">
              <div className="tft-augment-icon-wrap">
                {a.icon ? (
                  <img src={a.icon} alt={a.name} className="tft-augment-icon" loading="lazy" />
                ) : (
                  <span className="material-icons" style={{ fontSize: '1.5rem', color: '#c77dff' }}>auto_fix_high</span>
                )}
              </div>
              <div className="tft-augment-info">
                <h3 className="tft-augment-name">{a.name}</h3>
                <p className="tft-augment-desc">{a.desc?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No description'}</p>
                {a.associatedTraits?.length > 0 && (
                  <div className="tft-augment-traits">
                    {a.associatedTraits.map(t => <span key={t} className="tft-champ-trait">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TftAugments;
