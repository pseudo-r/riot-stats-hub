import './LiveGameBanner.css';

function LiveGameBanner({ activeGame }) {
  if (!activeGame) return null;

  const gameMins = Math.floor((Date.now() - activeGame.gameStartTime) / 60000);

  return (
    <div className="live-banner">
      <div className="live-banner-header">
        <div className="live-dot" />
        <span className="live-banner-title text-uppercase">In Game</span>
        <span className="live-banner-time text-mono text-muted">{gameMins}m</span>
      </div>

      <div className="live-banner-mode text-xs text-muted">
        {activeGame.gameMode || 'Classic'} · {activeGame.mapId === 11 ? "Summoner's Rift" : activeGame.mapId === 12 ? 'ARAM' : `Map ${activeGame.mapId}`}
      </div>

      <div className="live-teams">
        <div className="live-team live-team-blue">
          <span className="live-team-label text-xs text-uppercase">Blue</span>
          {activeGame.participants
            ?.filter(p => p.teamId === 100)
            .map((p, i) => (
              <span key={i} className="live-player text-xs">
                {p.summonerName || p.riotId || `Player ${i + 1}`}
              </span>
            ))}
        </div>
        <div className="live-vs text-xs text-muted">VS</div>
        <div className="live-team live-team-red">
          <span className="live-team-label text-xs text-uppercase">Red</span>
          {activeGame.participants
            ?.filter(p => p.teamId === 200)
            .map((p, i) => (
              <span key={i} className="live-player text-xs">
                {p.summonerName || p.riotId || `Player ${i + 1}`}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export default LiveGameBanner;
