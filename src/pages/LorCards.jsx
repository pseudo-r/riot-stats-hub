import { useState, useEffect } from 'react';
import { fetchAllCards, fetchRegions } from '../api/lorAssets';
import './GamePages.css';

const TYPES = ['All', 'Unit', 'Spell', 'Landmark', 'Equipment', 'Trap'];
const RARITIES = ['All', 'Common', 'Rare', 'Epic', 'Champion'];

function LorCards() {
  const [cards, setCards] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 60;

  useEffect(() => {
    Promise.all([fetchAllCards(), fetchRegions()])
      .then(([c, r]) => {
        // Only collectible cards
        setCards(c.filter(card => card.collectible));
        setRegions(r);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const regionNames = ['All', ...new Set(cards.flatMap(c => c.regions || []))].filter(Boolean);

  const filtered = cards.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || c.type === typeFilter;
    const matchRarity = rarityFilter === 'All' || c.rarity === rarityFilter;
    const matchRegion = regionFilter === 'All' || (c.regions || []).includes(regionFilter);
    return matchSearch && matchType && matchRarity && matchRegion;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const selectedCard = selected ? cards.find(c => c.cardCode === selected) : null;

  useEffect(() => { setPage(0); }, [search, typeFilter, rarityFilter, regionFilter]);

  const rarityColors = { Common: '#9e9e9e', Rare: '#4caf50', Epic: '#ab47bc', Champion: '#f5a623' };

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge lor">LoR</div>
        <div>
          <h1 className="game-page-title">Card Database</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {cards.length} collectible cards · All sets
          </p>
        </div>
      </div>

      <div className="game-controls" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="game-tabs">
          {TYPES.map(t => (
            <button key={t} className={`filter-chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>
        <div className="game-tabs">
          {RARITIES.map(r => (
            <button key={r} className={`filter-chip ${rarityFilter === r ? 'active' : ''}`}
              style={r !== 'All' ? { color: rarityFilter === r ? '#fff' : rarityColors[r] } : {}}
              onClick={() => setRarityFilter(r)}
            >{r}</button>
          ))}
        </div>
      </div>

      {regionNames.length > 2 && (
        <div className="game-controls">
          <div className="game-tabs">
            {regionNames.map(r => (
              <button key={r} className={`filter-chip ${regionFilter === r ? 'active' : ''}`} onClick={() => setRegionFilter(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading card database...</p></div>
      ) : (
        <>
          <div className="lor-cards-grid">
            {paged.map(c => {
              const art = c.assets?.[0]?.gameAbsolutePath;
              return (
                <div
                  key={c.cardCode}
                  className={`lor-card ${selected === c.cardCode ? 'active' : ''}`}
                  onClick={() => setSelected(selected === c.cardCode ? null : c.cardCode)}
                >
                  {art ? (
                    <img src={art} alt={c.name} className="lor-card-art" loading="lazy" />
                  ) : (
                    <div className="lor-card-placeholder">
                      <span className="material-icons">style</span>
                      <span>{c.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="lor-pagination">
              <button className="filter-chip" disabled={page === 0} onClick={() => setPage(page - 1)}>← Prev</button>
              <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>Page {page + 1} of {totalPages}</span>
              <button className="filter-chip" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}

          {selectedCard && (
            <div className="lor-card-detail">
              <div className="lor-card-detail-header">
                {selectedCard.assets?.[0]?.fullAbsolutePath && (
                  <img src={selectedCard.assets[0].fullAbsolutePath} alt={selectedCard.name} className="lor-card-detail-art" />
                )}
                <div className="lor-card-detail-info">
                  <h2>{selectedCard.name}</h2>
                  <div className="lor-card-meta">
                    <span className="lor-card-type">{selectedCard.type}</span>
                    <span className="lor-card-rarity" style={{ color: rarityColors[selectedCard.rarity] }}>{selectedCard.rarity}</span>
                    {selectedCard.cost != null && <span className="lor-card-mana">{selectedCard.cost} Mana</span>}
                    {selectedCard.attack != null && <span className="lor-card-atk">{selectedCard.attack} ATK</span>}
                    {selectedCard.health != null && <span className="lor-card-hp">{selectedCard.health} HP</span>}
                  </div>
                  {selectedCard.regions?.length > 0 && (
                    <div className="lor-card-regions">{selectedCard.regions.join(' · ')}</div>
                  )}
                  {selectedCard.keywords?.length > 0 && (
                    <div className="lor-card-keywords">
                      {selectedCard.keywords.map(k => <span key={k} className="lor-keyword">{k}</span>)}
                    </div>
                  )}
                  {selectedCard.description && <p className="lor-card-desc">{selectedCard.description}</p>}
                  {selectedCard.levelupDescription && <p className="lor-card-levelup">Level Up: {selectedCard.levelupDescription}</p>}
                  {selectedCard.flavorText && <p className="lor-card-flavor">"{selectedCard.flavorText}"</p>}
                  {selectedCard.artistName && <p className="lor-card-artist">Art by {selectedCard.artistName}</p>}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LorCards;
