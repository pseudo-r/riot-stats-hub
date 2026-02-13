import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import SummonerOverview from './pages/SummonerOverview';
import Champions from './pages/Champions';
import Leaderboards from './pages/Leaderboards';
import ProBuilds from './pages/ProBuilds';
import TftLanding from './pages/TftLanding';
import TftLeaderboard from './pages/TftLeaderboard';
import TftComps from './pages/TftComps';
import TftOverview from './pages/TftOverview';
import TftChampions from './pages/TftChampions';
import TftTraits from './pages/TftTraits';
import TftItems from './pages/TftItems';
import TftAugments from './pages/TftAugments';
import ValorantLanding from './pages/ValorantLanding';
import ValorantAgents from './pages/ValorantAgents';
import ValorantMaps from './pages/ValorantMaps';
import ValorantLeaderboard from './pages/ValorantLeaderboard';
import ValorantWeapons from './pages/ValorantWeapons';
import ValorantRanks from './pages/ValorantRanks';
import ValorantGameModes from './pages/ValorantGameModes';
import ValorantSprays from './pages/ValorantSprays';
import ValorantPlayerCards from './pages/ValorantPlayerCards';
import ValorantBuddies from './pages/ValorantBuddies';
import LorLanding from './pages/LorLanding';
import LorOverview from './pages/LorOverview';
import LorCards from './pages/LorCards';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      {/* Global scanline overlay */}
      <div className="scanline-overlay" />
      <Header />
      <Routes>
        {/* ── League of Legends ─────────────────────── */}
        <Route path="/" element={<Landing />} />
        <Route path="/summoner/:region/:platform/:name/:tag" element={<SummonerOverview />} />
        <Route path="/champions" element={<Champions />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/pro-builds" element={<ProBuilds />} />

        {/* ── Teamfight Tactics ─────────────────────── */}
        <Route path="/tft" element={<TftLanding />} />
        <Route path="/tft/leaderboard" element={<TftLeaderboard />} />
        <Route path="/tft/comps" element={<TftComps />} />
        <Route path="/tft/champions" element={<TftChampions />} />
        <Route path="/tft/traits" element={<TftTraits />} />
        <Route path="/tft/items" element={<TftItems />} />
        <Route path="/tft/augments" element={<TftAugments />} />
        <Route path="/tft/player/:region/:platform/:name/:tag" element={<TftOverview />} />

        {/* ── Valorant ──────────────────────────────── */}
        <Route path="/valorant" element={<ValorantLanding />} />
        <Route path="/valorant/agents" element={<ValorantAgents />} />
        <Route path="/valorant/maps" element={<ValorantMaps />} />
        <Route path="/valorant/leaderboard" element={<ValorantLeaderboard />} />
        <Route path="/valorant/weapons" element={<ValorantWeapons />} />
        <Route path="/valorant/ranks" element={<ValorantRanks />} />
        <Route path="/valorant/game-modes" element={<ValorantGameModes />} />
        <Route path="/valorant/sprays" element={<ValorantSprays />} />
        <Route path="/valorant/player-cards" element={<ValorantPlayerCards />} />
        <Route path="/valorant/buddies" element={<ValorantBuddies />} />

        {/* ── Legends of Runeterra ──────────────────── */}
        <Route path="/lor" element={<LorLanding />} />
        <Route path="/lor/leaderboard" element={<LorOverview />} />
        <Route path="/lor/cards" element={<LorCards />} />

        {/* ── Auth ──────────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
