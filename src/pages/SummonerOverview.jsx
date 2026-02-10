import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usePlayerStore from '../store/usePlayerStore';
import SummonerBanner from '../components/SummonerBanner';
import ProfileSidebar from '../components/ProfileSidebar';
import MatchCard from '../components/MatchCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import './SummonerOverview.css';

function SummonerOverview() {
  const { region, platform, name, tag } = useParams();
  const {
    account, summoner, leagueEntries, matches, activeGame, mastery,
    loading, error, fetchPlayer, derivedStats,
  } = usePlayerStore();

  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    if (name && tag && platform && region) {
      fetchPlayer(region, platform, name, tag);
    }
  }, [name, tag, platform, region, fetchPlayer]);

  if (loading) {
    return (
      <div className="main-content">
        <LoadingSkeleton variant="page" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <ErrorState
          type={error.type || 'generic'}
          message={error.message}
          onRetry={() => fetchPlayer(region, platform, name, tag)}
        />
      </div>
    );
  }

  const matchList = matches || [];

  return (
    <div className="main-content">
      {/* Profile Banner */}
      <SummonerBanner
        account={account}
        summoner={summoner}
        leagueEntries={leagueEntries}
        activeGame={activeGame}
        onRefresh={() => fetchPlayer(region, platform, name, tag)}
      />

      {/* Stats row */}
      {derivedStats && (
        <div className="overview-stats-row">
          <div className="overview-stat-card">
            <div className="section-header">
              <span className="section-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--primary)' }}>query_stats</span>
                Last {matchList.length} Games
              </span>
            </div>
            <div className="overview-stat-body">
              <div className="overview-stat-big text-primary-color">{derivedStats.winRate || 0}%</div>
              <div className="text-muted-color" style={{ fontSize: '0.786rem' }}>Win Rate</div>
              <div className="overview-stat-detail">
                <span className="text-primary-color">{derivedStats.wins || 0}W</span>
                <span className="text-loss-color">{derivedStats.losses || 0}L</span>
              </div>
            </div>
          </div>
          <div className="overview-stat-card">
            <div className="section-header">
              <span className="section-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--primary)' }}>trending_up</span>
                KDA Average
              </span>
            </div>
            <div className="overview-stat-body">
              <div className="overview-stat-big text-white-color">{derivedStats.kdaRatio || '0.00'}</div>
              <div className="text-muted-color" style={{ fontSize: '0.786rem' }}>
                {derivedStats.avgKills || 0} / {derivedStats.avgDeaths || 0} / {derivedStats.avgAssists || 0}
              </div>
            </div>
          </div>
          <div className="overview-stat-card">
            <div className="section-header">
              <span className="section-title">
                <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--primary)' }}>pest_control</span>
                CS / min
              </span>
            </div>
            <div className="overview-stat-body">
              <div className="overview-stat-big text-white-color">{derivedStats.csPerMin || '0.0'}</div>
              <div className="text-muted-color" style={{ fontSize: '0.786rem' }}>
                KP: {derivedStats.killParticipation || 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="overview-grid">
        {/* Match History */}
        <div className="overview-main">
          {/* Match history header */}
          <div className="overview-history-header">
            <div>
              <h2 className="overview-history-title">
                Match History
                <span className="badge" style={{ marginLeft: '0.75rem' }}>Live</span>
              </h2>
              <p className="text-muted-color" style={{ fontSize: '0.857rem', marginTop: '0.25rem' }}>
                Analyzing last {matchList.length} games
              </p>
            </div>
            <div className="overview-history-controls">
              <div className="filter-bar">
                <button
                  className={`filter-chip ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                >
                  Cards
                </button>
                <button
                  className={`filter-chip ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Match list */}
          <div className="overview-match-list">
            {matchList.length === 0 ? (
              <ErrorState type="noMatches" />
            ) : (
              matchList.map((match) => (
                <MatchCard
                  key={match.metadata?.matchId || Math.random()}
                  match={match}
                  puuid={account?.puuid}
                />
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="overview-sidebar">
          <ProfileSidebar
            leagueEntries={leagueEntries}
            championMastery={mastery}
          />
        </div>
      </div>
    </div>
  );
}

export default SummonerOverview;
