import { useState, useEffect } from 'react';
import { fetchBuddies } from '../api/valorantAssets';
import './GamePages.css';

function ValorantBuddies() {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBuddies().then(data => { setBuddies(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = buddies.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Weapon Buddies</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {buddies.length} buddies in the collection
          </p>
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search buddies..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading buddies...</p></div>
      ) : (
        <div className="buddies-grid">
          {filtered.map(b => (
            <div key={b.uuid} className="buddy-card">
              {b.icon ? (
                <img src={b.icon} alt={b.name} className="buddy-icon" loading="lazy" />
              ) : (
                <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>pets</span>
              )}
              <span className="buddy-name">{b.name}</span>
              {b.levels?.length > 1 && (
                <span className="buddy-levels">{b.levels.length} levels</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValorantBuddies;
