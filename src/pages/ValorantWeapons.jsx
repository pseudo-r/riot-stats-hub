import { useState, useEffect } from 'react';
import { fetchWeapons } from '../api/valorantAssets';
import './GamePages.css';

const CATEGORIES = ['All', 'Sidearm', 'SMG', 'Shotgun', 'Rifle', 'Sniper', 'Heavy', 'Melee'];

function ValorantWeapons() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [skinView, setSkinView] = useState(null);

  useEffect(() => {
    fetchWeapons().then(data => { setWeapons(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const parseCategory = (cat) => {
    if (!cat) return 'Melee';
    return cat.replace('EEquippableCategory::', '');
  };

  const filtered = weapons.filter(w =>
    category === 'All' || parseCategory(w.category) === category
  );

  const selectedWeapon = selected ? weapons.find(w => w.uuid === selected) : null;

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Arsenal</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {weapons.length} weapons · Stats, skins & chromas
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-chip ${category === c ? 'active' : ''}`} onClick={() => { setCategory(c); setSelected(null); }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading arsenal...</p></div>
      ) : (
        <>
          <div className="weapons-grid">
            {filtered.map(w => (
              <div
                key={w.uuid}
                className={`weapon-card ${selected === w.uuid ? 'active' : ''}`}
                onClick={() => { setSelected(w.uuid); setSkinView(null); }}
              >
                {w.icon ? (
                  <img src={w.icon} alt={w.name} className="weapon-icon" loading="lazy" />
                ) : (
                  <div className="weapon-icon-placeholder"><span className="material-icons">gavel</span></div>
                )}
                <div className="weapon-card-info">
                  <h3 className="weapon-card-name">{w.name}</h3>
                  <span className="weapon-card-cat">{parseCategory(w.category)}</span>
                  {w.shopData?.cost != null && (
                    <span className="weapon-card-cost">{w.shopData.cost} ¤</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedWeapon && (
            <div className="weapon-detail">
              <div className="weapon-detail-header">
                <h2>{selectedWeapon.name}</h2>
                {selectedWeapon.shopData && (
                  <span className="weapon-detail-cost">{selectedWeapon.shopData.cost} Credits</span>
                )}
              </div>

              {selectedWeapon.stats && (
                <div className="weapon-stats-grid">
                  {selectedWeapon.stats.fireRate != null && (
                    <div className="weapon-stat">
                      <span className="weapon-stat-label">Fire Rate</span>
                      <span className="weapon-stat-value">{selectedWeapon.stats.fireRate}/s</span>
                    </div>
                  )}
                  {selectedWeapon.stats.magazineSize != null && (
                    <div className="weapon-stat">
                      <span className="weapon-stat-label">Magazine</span>
                      <span className="weapon-stat-value">{selectedWeapon.stats.magazineSize}</span>
                    </div>
                  )}
                  {selectedWeapon.stats.runSpeedMultiplier != null && (
                    <div className="weapon-stat">
                      <span className="weapon-stat-label">Move Speed</span>
                      <span className="weapon-stat-value">{(selectedWeapon.stats.runSpeedMultiplier * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  {selectedWeapon.stats.reloadTimeSeconds != null && (
                    <div className="weapon-stat">
                      <span className="weapon-stat-label">Reload</span>
                      <span className="weapon-stat-value">{selectedWeapon.stats.reloadTimeSeconds}s</span>
                    </div>
                  )}
                  {selectedWeapon.stats.firstBulletAccuracy != null && (
                    <div className="weapon-stat">
                      <span className="weapon-stat-label">1st Bullet Acc</span>
                      <span className="weapon-stat-value">{selectedWeapon.stats.firstBulletAccuracy.toFixed(2)}°</span>
                    </div>
                  )}
                  {selectedWeapon.stats.equipTimeSeconds != null && (
                    <div className="weapon-stat">
                      <span className="weapon-stat-label">Equip Time</span>
                      <span className="weapon-stat-value">{selectedWeapon.stats.equipTimeSeconds}s</span>
                    </div>
                  )}
                </div>
              )}

              {selectedWeapon.skins?.length > 0 && (
                <div className="weapon-skins-section">
                  <h3 className="game-stat-title" style={{ marginTop: '1rem' }}>
                    <span className="material-icons" style={{ fontSize: '1rem', color: '#ff4655' }}>palette</span>
                    Skins ({selectedWeapon.skins.length})
                  </h3>
                  <div className="weapon-skins-grid">
                    {selectedWeapon.skins.filter(s => s.icon).map(skin => (
                      <div
                        key={skin.uuid}
                        className={`weapon-skin-card ${skinView === skin.uuid ? 'active' : ''}`}
                        onClick={() => setSkinView(skinView === skin.uuid ? null : skin.uuid)}
                      >
                        <img src={skin.icon} alt={skin.name} className="weapon-skin-img" loading="lazy" />
                        <span className="weapon-skin-name">{skin.name.replace(selectedWeapon.name, '').trim() || 'Standard'}</span>
                        {skin.chromas?.length > 1 && (
                          <span className="weapon-skin-chromas">{skin.chromas.length} chromas</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {skinView && (() => {
                    const skin = selectedWeapon.skins.find(s => s.uuid === skinView);
                    if (!skin || !skin.chromas?.length) return null;
                    return (
                      <div className="weapon-chromas">
                        <h4 style={{ fontSize: '0.857rem', color: 'var(--text-white)', margin: '0.75rem 0 0.5rem' }}>Chromas</h4>
                        <div className="weapon-chromas-grid">
                          {skin.chromas.filter(c => c.displayIcon || c.fullRender).map(c => (
                            <div key={c.uuid} className="weapon-chroma-item">
                              <img src={c.displayIcon || c.fullRender} alt={c.displayName} className="weapon-chroma-img" />
                              <span className="weapon-chroma-name">{c.displayName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ValorantWeapons;
