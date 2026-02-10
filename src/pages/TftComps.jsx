import { useState, useEffect } from 'react';
import { getTftChallengerLeague } from '../api/tftApi';
import { fetchLatestVersion } from '../api/tftAssets';
import './GamePages.css';

const PLATFORMS = [
  { id: 'na1', label: 'NA' },
  { id: 'euw1', label: 'EUW' },
  { id: 'kr', label: 'KR' },
  { id: 'eune1', label: 'EUNE' },
  { id: 'br1', label: 'BR' },
  { id: 'jp1', label: 'JP' },
  { id: 'oc1', label: 'OCE' },
];

/* Placeholder TFT meta comps — uses Data Dragon champion icons */
const META_COMPS = [
  { name: 'Rebels', core: ['Jinx', 'MissFortune', 'Ziggs', 'Yasuo'], traits: ['Rebel', 'Blaster'], tier: 'S' },
  { name: 'Mech Pilots', core: ['Annie', 'Rumble', 'Fizz', 'Gangplank'], traits: ['Mech-Pilot', 'Demolitionist'], tier: 'S' },
  { name: 'Cybernetics', core: ['Irelia', 'Vayne', 'Ekko', 'Lucian'], traits: ['Cybernetic', 'Blademaster'], tier: 'A' },
  { name: 'Star Guardians', core: ['Syndra', 'Soraka', 'Neeko', 'Janna'], traits: ['Star Guardian', 'Sorcerer'], tier: 'A' },
  { name: 'Dark Stars', core: ['Jhin', 'Shaco', 'Karma', 'Lux'], traits: ['Dark Star', 'Sniper'], tier: 'A' },
  { name: 'Void Brawlers', core: ['Velkoz', 'Khazix', 'Chogath', 'Blitzcrank'], traits: ['Void', 'Brawler'], tier: 'B' },
];

function TftComps() {
  const [platform, setPlatform] = useState('na1');
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ddVersion, setDdVersion] = useState(null);

  useEffect(() => {
    fetchLatestVersion().then(v => setDdVersion(v));
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getTftChallengerLeague(platform);
        const sorted = (data.entries || [])
          .sort((a, b) => b.leaguePoints - a.leaguePoints)
          .slice(0, 5);
        setTopPlayers(sorted);
      } catch {
        setTopPlayers([]);
      }
      setLoading(false);
    }
    load();
  }, [platform]);

  const tierColor = { S: '#ff4655', A: '#f5a623', B: '#38b6ff' };

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge tft">TFT</div>
        <div>
          <h1 className="game-page-title">Meta Comps</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            Popular team compositions and strategies
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {PLATFORMS.map(p => (
            <button key={p.id} className={`filter-chip ${platform === p.id ? 'active' : ''}`} onClick={() => setPlatform(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comps Grid */}
      <div className="comps-grid">
        {META_COMPS.map(comp => (
          <div key={comp.name} className="comp-card">
            <div className="comp-header">
              <span className="comp-tier" style={{ background: tierColor[comp.tier] || '#666' }}>{comp.tier}</span>
              <h3 className="comp-name">{comp.name}</h3>
            </div>
            <div className="comp-traits">
              {comp.traits.map(t => (
                <span key={t} className="comp-trait">{t}</span>
              ))}
            </div>
            <div className="comp-core">
              <span className="comp-core-label">Core:</span>
              {comp.core.map(c => (
                <div key={c} className="comp-unit-icon-wrap" title={c}>
                  {ddVersion ? (
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/${ddVersion}/img/champion/${c}.png`}
                      alt={c}
                      className="comp-unit-img"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <span className="comp-unit-fallback" style={{ display: ddVersion ? 'none' : 'flex' }}>
                    {c.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Top Challenger Preview */}
      <div style={{ marginTop: '2rem' }}>
        <h3 className="game-stat-title">
          <span className="material-icons" style={{ fontSize: '1rem', color: '#c77dff' }}>emoji_events</span>
          Top TFT Challengers ({PLATFORMS.find(p => p.id === platform)?.label})
        </h3>
        {loading ? (
          <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading...</p></div>
        ) : (
          <div className="game-table-wrap">
            <table className="game-table">
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}>#</th>
                  <th>Player</th>
                  <th>LP</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((p, i) => {
                  const games = p.wins + p.losses;
                  const wr = games > 0 ? Math.round((p.wins / games) * 100) : 0;
                  return (
                    <tr key={p.summonerId || i} className="game-row">
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#c77dff' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>{p.summonerName || 'TFT Player'}</td>
                      <td style={{ color: '#c77dff', fontWeight: 700 }}>{p.leaguePoints.toLocaleString()} LP</td>
                      <td style={{ fontWeight: 600 }}>{wr}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TftComps;
