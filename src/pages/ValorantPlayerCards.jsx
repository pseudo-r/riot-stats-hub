import { useState, useEffect } from 'react';
import { fetchPlayerCards } from '../api/valorantAssets';
import './GamePages.css';

function ValorantPlayerCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchPlayerCards().then(data => { setCards(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = cards.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Player Cards</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {cards.length} player cards
          </p>
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search cards..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading player cards...</p></div>
      ) : (
        <div className="playercards-grid">
          {filtered.map(c => (
            <div
              key={c.uuid}
              className={`playercard-card ${expanded === c.uuid ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === c.uuid ? null : c.uuid)}
            >
              {expanded === c.uuid && c.largeArt ? (
                <img src={c.largeArt} alt={c.name} className="playercard-large" loading="lazy" />
              ) : c.wideArt ? (
                <img src={c.wideArt} alt={c.name} className="playercard-wide" loading="lazy" />
              ) : c.smallArt ? (
                <img src={c.smallArt} alt={c.name} className="playercard-small" loading="lazy" />
              ) : c.icon ? (
                <img src={c.icon} alt={c.name} className="playercard-small" loading="lazy" />
              ) : (
                <div className="playercard-placeholder"><span className="material-icons">badge</span></div>
              )}
              <span className="playercard-name">{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValorantPlayerCards;
