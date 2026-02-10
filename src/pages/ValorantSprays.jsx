import { useState, useEffect } from 'react';
import { fetchSprays } from '../api/valorantAssets';
import './GamePages.css';

function ValorantSprays() {
  const [sprays, setSprays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchSprays().then(data => {
      setSprays(data.filter(s => !s.isNullSpray));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = sprays.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Sprays</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {sprays.length} sprays in the collection
          </p>
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search sprays..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading sprays...</p></div>
      ) : (
        <div className="sprays-grid">
          {filtered.map(s => (
            <div
              key={s.uuid}
              className={`spray-card ${selected === s.uuid ? 'active' : ''}`}
              onClick={() => setSelected(selected === s.uuid ? null : s.uuid)}
            >
              {(s.animationGif || s.fullIcon || s.icon) ? (
                <img
                  src={selected === s.uuid && s.animationGif ? s.animationGif : (s.fullIcon || s.icon)}
                  alt={s.name}
                  className="spray-img"
                  loading="lazy"
                />
              ) : (
                <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>brush</span>
              )}
              <span className="spray-name">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValorantSprays;
