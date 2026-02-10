import { useState, useEffect } from 'react';
import { fetchItems } from '../api/tftAssets';
import './GamePages.css';

function TftItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All'); // All / Component / Combined
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchItems().then(data => { setItems((data || []).filter(i => i.name)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const components = items.filter(i => !i.composition || i.composition.length === 0);
  const combined = items.filter(i => i.composition && i.composition.length > 0);

  const filtered = (filter === 'Component' ? components : filter === 'Combined' ? combined : items)
    .filter(i => (i.name || '').toLowerCase().includes(search.toLowerCase()));

  const selectedItem = selected ? items.find(i => i.apiName === selected) : null;

  // find component item data by apiName
  const findItem = (apiName) => items.find(i => i.apiName === apiName);

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Items</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {items.length} items · {components.length} components · {combined.length} combined
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {['All', 'Component', 'Combined'].map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="game-search-input" />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading items...</p></div>
      ) : (
        <>
          <div className="tft-items-grid">
            {filtered.map(item => (
              <div
                key={item.apiName}
                className={`tft-item-card ${selected === item.apiName ? 'active' : ''}`}
                onClick={() => setSelected(selected === item.apiName ? null : item.apiName)}
              >
                {item.icon ? (
                  <img src={item.icon} alt={item.name} className="tft-item-icon" loading="lazy" />
                ) : (
                  <div className="tft-item-icon-placeholder"><span className="material-icons">extension</span></div>
                )}
                <span className="tft-item-name">{item.name}</span>
                {item.composition?.length > 0 && (
                  <div className="tft-item-recipe-mini">
                    {item.composition.map((comp, i) => {
                      const compItem = findItem(comp);
                      return compItem?.icon ? (
                        <img key={i} src={compItem.icon} alt={compItem.name} className="tft-item-recipe-icon" title={compItem.name} />
                      ) : (
                        <span key={i} className="tft-item-recipe-placeholder" title={comp}>?</span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedItem && (
            <div className="tft-item-detail">
              <div className="tft-item-detail-header">
                {selectedItem.icon && <img src={selectedItem.icon} alt={selectedItem.name} className="tft-item-detail-icon" />}
                <div>
                  <h2>{selectedItem.name}</h2>
                  {selectedItem.unique && <span className="tft-item-unique">Unique</span>}
                </div>
              </div>
              <p className="tft-item-detail-desc">{selectedItem.desc?.replace(/<[^>]*>/g, '') || 'No description'}</p>
              {selectedItem.composition?.length > 0 && (
                <div className="tft-item-recipe">
                  <h4>Recipe</h4>
                  <div className="tft-item-recipe-visual">
                    {selectedItem.composition.map((comp, i) => {
                      const compItem = findItem(comp);
                      return (
                        <div key={i} className="tft-recipe-component">
                          {compItem?.icon && <img src={compItem.icon} alt={compItem?.name} className="tft-recipe-comp-icon" />}
                          <span>{compItem?.name || comp}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TftItems;
