import { useState, useEffect } from 'react';
import { fetchValMaps } from '../api/valorantAssets';
import './GamePages.css';

function ValorantMaps() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchValMaps();
        setMaps(data);
      } catch {
        setMaps([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = maps.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Maps</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {maps.length} maps in the rotation
          </p>
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input
          type="text"
          placeholder="Search maps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="game-search-input"
        />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading maps...</p></div>
      ) : (
        <div className="val-maps-grid">
          {filtered.map(map => (
            <div key={map.uuid} className="val-map-card has-splash">
              {map.splash ? (
                <img
                  src={map.splash}
                  alt={map.name}
                  className="val-map-splash"
                  loading="lazy"
                />
              ) : map.listIcon ? (
                <img
                  src={map.listIcon}
                  alt={map.name}
                  className="val-map-splash"
                  loading="lazy"
                />
              ) : (
                <div className="val-map-visual">
                  <span className="material-icons">map</span>
                </div>
              )}
              <div className="val-map-overlay">
                <h3 className="val-map-name">{map.name}</h3>
                {map.coordinates && (
                  <p className="val-map-coords">{map.coordinates}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValorantMaps;
