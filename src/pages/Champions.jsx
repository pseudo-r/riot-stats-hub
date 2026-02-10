import { useState, useEffect } from 'react';
import { getLatestVersion, getChampionMap, championIconUrl } from '../api/dataDragon';
import { getChampionRotations } from '../api/riotApi';
import './Champions.css';

function Champions() {
  const [champions, setChampions] = useState([]);
  const [version, setVersion] = useState('');
  const [search, setSearch] = useState('');
  const [freeRotation, setFreeRotation] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const ver = await getLatestVersion();
        setVersion(ver);

        // Fetch full champion list with tags from Data Dragon
        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/champion.json`);
        const json = await res.json();
        const list = Object.values(json.data)
          .map(c => ({
            id: c.id,
            key: parseInt(c.key, 10),
            name: c.name,
            title: c.title,
            tags: c.tags, // ['Mage', 'Assassin']
            info: c.info,  // { attack, defense, magic, difficulty }
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setChampions(list);

        // Fetch free rotation
        try {
          const rotation = await getChampionRotations('na1');
          setFreeRotation(rotation.freeChampionIds || []);
        } catch {
          // Non-critical - ignore
        }
      } catch (err) {
        console.error('Failed to load champions:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filters = ['All', 'Free Rotation', 'Assassin', 'Fighter', 'Mage', 'Marksman', 'Support', 'Tank'];

  const filtered = champions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'Free Rotation') return matchesSearch && freeRotation.includes(c.key);
    return matchesSearch && c.tags?.includes(filter);
  });

  return (
    <div className="main-content">
      <div className="champs-header">
        <div>
          <h1 className="champs-title">
            <span className="material-icons" style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>shield</span>
            Champion Database
          </h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {champions.length} champions · Patch {version} · {freeRotation.length} free this week
          </p>
        </div>
        <div className="champs-search-area">
          <div className="champs-search">
            <span className="material-icons" style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>search</span>
            <input
              type="text"
              className="champs-search-input"
              placeholder="Search champions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="champs-filters">
        {filters.map(f => (
          <button
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'Free Rotation' && <span className="material-icons" style={{ fontSize: '0.875rem' }}>lock_open</span>}
            {f}
            {f !== 'All' && f !== 'Free Rotation' && (
              <span className="chip-count">
                {champions.filter(c => c.tags?.includes(f)).length}
              </span>
            )}
            {f === 'Free Rotation' && (
              <span className="chip-count">{freeRotation.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="champs-loading">
          <span className="material-icons spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}>autorenew</span>
          <p className="text-muted-color">Loading champion data...</p>
        </div>
      ) : (
        <>
          <p className="text-muted-color" style={{ fontSize: '0.786rem', marginBottom: '0.75rem' }}>
            Showing {filtered.length} of {champions.length} champions
          </p>
          <div className="champs-grid">
            {filtered.map(champ => {
              const isFree = freeRotation.includes(champ.key);
              return (
                <div key={champ.id} className={`champ-card ${isFree ? 'free' : ''}`}>
                  <div className="champ-card-img-wrap">
                    <img
                      src={championIconUrl(version, champ.id)}
                      alt={champ.name}
                      className="champ-card-img"
                      loading="lazy"
                    />
                    <div className="champ-card-overlay" />
                    {isFree && <div className="champ-free-badge">FREE</div>}
                    <div className="champ-card-difficulty">
                      {Array.from({ length: 3 }, (_, i) => (
                        <span
                          key={i}
                          className="diff-dot"
                          style={{ background: i < Math.ceil(champ.info.difficulty / 4) ? 'var(--primary)' : 'var(--border-color)' }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="champ-card-name">{champ.name}</div>
                  <div className="champ-card-tags">
                    {champ.tags?.map(t => (
                      <span key={t} className="champ-tag">{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="champs-empty">
                <span className="material-icons" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>search_off</span>
                <p>No champions match "{search}"</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Champions;
