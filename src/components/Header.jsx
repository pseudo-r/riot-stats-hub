import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import usePlayerStore from '../store/usePlayerStore';
import useAuthStore from '../store/useAuthStore';
import './Header.css';

const PLATFORMS = [
  { id: 'na1', label: 'NA', region: 'americas' },
  { id: 'euw1', label: 'EUW', region: 'europe' },
  { id: 'eune1', label: 'EUNE', region: 'europe' },
  { id: 'kr', label: 'KR', region: 'asia' },
  { id: 'jp1', label: 'JP', region: 'asia' },
  { id: 'br1', label: 'BR', region: 'americas' },
  { id: 'oc1', label: 'OCE', region: 'americas' },
  { id: 'tr1', label: 'TR', region: 'europe' },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { platform, setPlatform } = usePlayerStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');

  // Determine which game section is active
  const path = location.pathname;
  const activeGame = path.startsWith('/tft') ? 'tft'
    : path.startsWith('/valorant') ? 'valorant'
    : path.startsWith('/lor') ? 'lor'
    : 'lol';

  const handleSearch = (e) => {
    e.preventDefault();
    const input = searchInput.trim();
    if (!input.includes('#')) return;
    const [name, tag] = input.split('#');
    if (!name || !tag) return;
    const plat = PLATFORMS.find(p => p.id === platform) || PLATFORMS[0];

    if (activeGame === 'tft') {
      navigate(`/tft/player/${plat.region}/${plat.id}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
    } else {
      navigate(`/summoner/${plat.region}/${plat.id}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
    }
    setSearchInput('');
  };

  return (
    <nav className="header">
      <div className="header-inner">
        {/* Left: Logo + Game Selector + Nav */}
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="material-icons header-logo-icon">bolt</span>
            <span className="header-logo-text">RIOT STATS HUB</span>
          </Link>

          <div className="header-divider" />

          {/* Game Selector */}
          <div className="header-games">
            <Link to="/" className={`header-game-pill ${activeGame === 'lol' ? 'active lol' : ''}`}>LoL</Link>
            <Link to="/tft" className={`header-game-pill ${activeGame === 'tft' ? 'active tft' : ''}`}>TFT</Link>
            <Link to="/valorant" className={`header-game-pill ${activeGame === 'valorant' ? 'active val' : ''}`}>VAL</Link>
            <Link to="/lor" className={`header-game-pill ${activeGame === 'lor' ? 'active lor' : ''}`}>LoR</Link>
          </div>

          <div className="header-divider" />

          {/* Game-specific nav links */}
          <div className="header-nav">
            {activeGame === 'lol' && (
              <>
                <Link to="/" className={`header-nav-link ${path === '/' || path.startsWith('/summoner') ? 'active' : ''}`}>Overview</Link>
                <Link to="/champions" className={`header-nav-link ${path === '/champions' ? 'active' : ''}`}>Champions</Link>
                <Link to="/leaderboards" className={`header-nav-link ${path === '/leaderboards' ? 'active' : ''}`}>Leaderboards</Link>
                <Link to="/pro-builds" className={`header-nav-link ${path === '/pro-builds' ? 'active' : ''}`}>Pro Builds</Link>
              </>
            )}
            {activeGame === 'tft' && (
              <>
                <Link to="/tft" className={`header-nav-link tft ${path === '/tft' ? 'active' : ''}`}>Overview</Link>
                <Link to="/tft/leaderboard" className={`header-nav-link tft ${path === '/tft/leaderboard' ? 'active' : ''}`}>Leaderboard</Link>
                <Link to="/tft/comps" className={`header-nav-link tft ${path === '/tft/comps' ? 'active' : ''}`}>Meta Comps</Link>
                <Link to="/tft/champions" className={`header-nav-link tft ${path === '/tft/champions' ? 'active' : ''}`}>Champions</Link>
                <Link to="/tft/traits" className={`header-nav-link tft ${path === '/tft/traits' ? 'active' : ''}`}>Traits</Link>
                <Link to="/tft/items" className={`header-nav-link tft ${path === '/tft/items' ? 'active' : ''}`}>Items</Link>
                <Link to="/tft/augments" className={`header-nav-link tft ${path === '/tft/augments' ? 'active' : ''}`}>Augments</Link>
              </>
            )}
            {activeGame === 'valorant' && (
              <>
                <Link to="/valorant" className={`header-nav-link val ${path === '/valorant' ? 'active' : ''}`}>Overview</Link>
                <Link to="/valorant/agents" className={`header-nav-link val ${path === '/valorant/agents' ? 'active' : ''}`}>Agents</Link>
                <Link to="/valorant/maps" className={`header-nav-link val ${path === '/valorant/maps' ? 'active' : ''}`}>Maps</Link>
                <Link to="/valorant/weapons" className={`header-nav-link val ${path === '/valorant/weapons' ? 'active' : ''}`}>Arsenal</Link>
                <Link to="/valorant/ranks" className={`header-nav-link val ${path === '/valorant/ranks' ? 'active' : ''}`}>Ranks</Link>
                <Link to="/valorant/game-modes" className={`header-nav-link val ${path === '/valorant/game-modes' ? 'active' : ''}`}>Modes</Link>
                <Link to="/valorant/sprays" className={`header-nav-link val ${path === '/valorant/sprays' ? 'active' : ''}`}>Sprays</Link>
                <Link to="/valorant/player-cards" className={`header-nav-link val ${path === '/valorant/player-cards' ? 'active' : ''}`}>Cards</Link>
                <Link to="/valorant/buddies" className={`header-nav-link val ${path === '/valorant/buddies' ? 'active' : ''}`}>Buddies</Link>
                <Link to="/valorant/leaderboard" className={`header-nav-link val ${path === '/valorant/leaderboard' ? 'active' : ''}`}>Leaderboard</Link>
              </>
            )}
            {activeGame === 'lor' && (
              <>
                <Link to="/lor" className={`header-nav-link lor ${path === '/lor' ? 'active' : ''}`}>Overview</Link>
                <Link to="/lor/leaderboard" className={`header-nav-link lor ${path === '/lor/leaderboard' ? 'active' : ''}`}>Leaderboard</Link>
                <Link to="/lor/cards" className={`header-nav-link lor ${path === '/lor/cards' ? 'active' : ''}`}>Card Database</Link>
              </>
            )}
          </div>
        </div>

        {/* Right: Search + User */}
        <div className="header-right">
          <form className="header-search" onSubmit={handleSearch}>
            <span className="material-icons header-search-icon">search</span>
            <input
              type="text"
              className="header-search-input"
              placeholder={activeGame === 'tft' ? 'Search TFT Player...' : activeGame === 'valorant' ? 'Search Agent...' : 'Search Summoner...'}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </form>

          <div className="header-user-area">
            {isLoggedIn ? (
              <>
                <div className="header-user-info">
                  <span className="header-user-name">{user?.username}</span>
                </div>
                <button className="header-avatar" onClick={logout}>
                  <span className="material-icons" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>account_circle</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="header-avatar">
                <span className="material-icons" style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>account_circle</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
