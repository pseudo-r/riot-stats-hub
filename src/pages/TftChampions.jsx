import { useState, useEffect } from 'react';
import { fetchChampions, fetchTraits } from '../api/tftAssets';
import './GamePages.css';

const COSTS = ['All', 1, 2, 3, 4, 5];

function TftChampions() {
  const [champions, setChampions] = useState([]);
  const [traits, setTraits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [costFilter, setCostFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([fetchChampions(), fetchTraits()])
      .then(([c, t]) => {
        // Deduplicate by name (keep latest set), skip null names
        const map = new Map();
        c.filter(ch => ch.name).forEach(ch => map.set(ch.name, ch));
        setChampions([...map.values()]);
        const tMap = new Map();
        t.filter(tr => tr.name).forEach(tr => tMap.set(tr.name, tr));
        setTraits([...tMap.values()]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = champions.filter(c => {
    const matchCost = costFilter === 'All' || c.cost === costFilter;
    const matchSearch = (c.name || '').toLowerCase().includes(search.toLowerCase());
    return matchCost && matchSearch;
  });

  const costColors = { 1: '#9e9e9e', 2: '#4caf50', 3: '#2196f3', 4: '#ab47bc', 5: '#f5a623' };
  const selectedChamp = selected ? champions.find(c => c.apiName === selected) : null;

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Champions</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {champions.length} TFT champions · Stats, abilities & traits
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {COSTS.map(c => (
            <button key={c} className={`filter-chip ${costFilter === c ? 'active' : ''}`}
              style={c !== 'All' ? { color: costFilter === c ? '#fff' : costColors[c], borderColor: costColors[c] } : {}}
              onClick={() => setCostFilter(c)}
            >
              {c === 'All' ? 'All' : `${c}★`}
            </button>
          ))}
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search champions..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading champions...</p></div>
      ) : (
        <>
          <div className="tft-champs-grid">
            {filtered.map(c => (
              <div
                key={c.apiName}
                className={`tft-champ-card ${selected === c.apiName ? 'active' : ''}`}
                style={{ borderColor: costColors[c.cost] || 'var(--border-color)' }}
                onClick={() => setSelected(selected === c.apiName ? null : c.apiName)}
              >
                <div className="tft-champ-icon-wrap" style={{ borderColor: costColors[c.cost] }}>
                  {c.icon ? (
                    <img src={c.icon} alt={c.name} className="tft-champ-icon" loading="lazy" />
                  ) : (
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: costColors[c.cost] }}>{c.name.charAt(0)}</span>
                  )}
                </div>
                <div className="tft-champ-info">
                  <span className="tft-champ-name">{c.name}</span>
                  <div className="tft-champ-traits">
                    {c.traits.slice(0, 3).map(t => (
                      <span key={t} className="tft-champ-trait">{t}</span>
                    ))}
                  </div>
                </div>
                <span className="tft-champ-cost" style={{ color: costColors[c.cost] }}>{c.cost}★</span>
              </div>
            ))}
          </div>

          {selectedChamp && (
            <div className="tft-champ-detail" style={{ borderColor: costColors[selectedChamp.cost] }}>
              <div className="tft-champ-detail-header">
                {selectedChamp.icon && <img src={selectedChamp.icon} alt={selectedChamp.name} className="tft-champ-detail-icon" />}
                <div>
                  <h2>{selectedChamp.name}</h2>
                  <span style={{ color: costColors[selectedChamp.cost], fontWeight: 700 }}>{selectedChamp.cost}-Cost</span>
                  <div className="tft-champ-traits" style={{ marginTop: '0.25rem' }}>
                    {selectedChamp.traits.map(t => <span key={t} className="tft-champ-trait">{t}</span>)}
                  </div>
                </div>
              </div>
              {selectedChamp.ability && (
                <div className="tft-champ-ability">
                  <div className="tft-ability-header">
                    {selectedChamp.ability.icon && <img src={selectedChamp.ability.icon} alt={selectedChamp.ability.name} className="tft-ability-icon" />}
                    <strong>{selectedChamp.ability.name}</strong>
                  </div>
                  <p className="tft-ability-desc">{selectedChamp.ability.desc?.replace(/<[^>]*>/g, '') || 'No description'}</p>
                </div>
              )}
              {selectedChamp.stats && Object.keys(selectedChamp.stats).length > 0 && (
                <div className="tft-champ-stats">
                  {Object.entries(selectedChamp.stats).map(([key, val]) => (
                    val != null && <div key={key} className="tft-stat-item"><span className="tft-stat-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span><span className="tft-stat-val">{typeof val === 'object' ? JSON.stringify(val) : val}</span></div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TftChampions;
