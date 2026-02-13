import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import usePlayerStore from '../store/usePlayerStore';
import useAuthStore from '../store/useAuthStore';
import { PLATFORMS } from '../constants/platforms';
import './Header.css';

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
    <nav className="header glass-header">
      <div className="header-inner">
        {/* Left: Logo + Game Selector + Hamburger */}
        <div className="header-left">
          <Link to="/" className="header-logo">
            <span className="material-icons header-logo-icon">bolt</span>
            <span className="header-logo-text">RIOT STATS HUB</span>
          </Link>

          <div className="header-divider" />

          {/* Game Selector (Desktop) */}
          <div className="header-games desktop-only">
            <Link to="/" className={`header-game-pill ${activeGame === 'lol' ? 'active lol' : ''}`}>LoL</Link>
            <Link to="/tft" className={`header-game-pill ${activeGame === 'tft' ? 'active tft' : ''}`}>TFT</Link>
            <Link to="/valorant" className={`header-game-pill ${activeGame === 'valorant' ? 'active val' : ''}`}>VAL</Link>
            <Link to="/lor" className={`header-game-pill ${activeGame === 'lor' ? 'active lor' : ''}`}>LoR</Link>
          </div>

          <div className="header-divider desktop-only" />

          {/* Game-specific nav links (Desktop) */}
          <div className="header-nav desktop-only">
            {activeGame === 'lol' && (
              <>
                <Link to="/" className={`header-nav-link ${path === '/' || path.startsWith('/summoner') ? 'active' : ''}`}>Overview</Link>
                <Link to="/champions" className={`header-nav-link ${path === '/champions' ? 'active' : ''}`}>Champions</Link>
                <Link to="/leaderboards" className={`header-nav-link ${path === '/leaderboards' ? 'active' : ''}`}>Leaderboards</Link>
              </>
            )}
            {activeGame === 'tft' && (
              <>
                <Link to="/tft" className={`header-nav-link tft ${path === '/tft' ? 'active' : ''}`}>Overview</Link>
                <Link to="/tft/comps" className={`header-nav-link tft ${path === '/tft/comps' ? 'active' : ''}`}>Comps</Link>
                <Link to="/tft/champions" className={`header-nav-link tft ${path === '/tft/champions' ? 'active' : ''}`}>Champions</Link>
              </>
            )}
            {activeGame === 'valorant' && (
              <>
                <Link to="/valorant" className={`header-nav-link val ${path === '/valorant' ? 'active' : ''}`}>Overview</Link>
                <Link to="/valorant/agents" className={`header-nav-link val ${path === '/valorant/agents' ? 'active' : ''}`}>Agents</Link>
                <Link to="/valorant/maps" className={`header-nav-link val ${path === '/valorant/maps' ? 'active' : ''}`}>Maps</Link>
              </>
            )}
            {activeGame === 'lor' && (
              <>
                <Link to="/lor" className={`header-nav-link lor ${path === '/lor' ? 'active' : ''}`}>Overview</Link>
                <Link to="/lor/cards" className={`header-nav-link lor ${path === '/lor/cards' ? 'active' : ''}`}>Cards</Link>
              </>
            )}
          </div>
        </div>

        {/* Right: Search + User + Mobile Toggle */}
        <div className="header-right">
          <form className="header-search desktop-only" onSubmit={handleSearch}>
            <span className="material-icons header-search-icon">search</span>
            <input
              type="text"
              className="header-search-input"
              placeholder={activeGame === 'tft' ? 'Search TFT Player...' : activeGame === 'valorant' ? 'Search Agent...' : 'Search Summoner...'}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </form>

          <div className="header-user-area desktop-only">
            {isLoggedIn ? (
              <button className="header-avatar" onClick={logout}>
                <span className="material-icons">logout</span>
              </button>
            ) : (
              <Link to="/login" className="header-avatar">
                <span className="material-icons">login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu – rendered OUTSIDE nav to escape backdrop-filter stacking context */}
    {isMenuOpen && (
      <div className="mobile-menu">
        <div className="mobile-search">
          <form onSubmit={(e) => { handleSearch(e); toggleMenu(); }}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        
        <div className="mobile-games">
           <Link to="/" onClick={toggleMenu} className={activeGame === 'lol' ? 'active' : ''}>LoL</Link>
           <Link to="/tft" onClick={toggleMenu} className={activeGame === 'tft' ? 'active' : ''}>TFT</Link>
           <Link to="/valorant" onClick={toggleMenu} className={activeGame === 'valorant' ? 'active' : ''}>VAL</Link>
           <Link to="/lor" onClick={toggleMenu} className={activeGame === 'lor' ? 'active' : ''}>LoR</Link>
        </div>

        <div className="mobile-nav-links">
          <Link to={`/${activeGame}`} onClick={toggleMenu}>Overview</Link>
          {activeGame === 'lol' && <Link to="/champions" onClick={toggleMenu}>Champions</Link>}
          {activeGame === 'tft' && <Link to="/tft/comps" onClick={toggleMenu}>Meta Comps</Link>}
          {activeGame === 'valorant' && <Link to="/valorant/agents" onClick={toggleMenu}>Agents</Link>}
          {activeGame === 'lor' && <Link to="/lor/cards" onClick={toggleMenu}>Cards</Link>}
        </div>
      </div>
    )}
    </>
  );
}

export default Header;
