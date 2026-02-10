import './ErrorState.css';

const ERROR_CONFIGS = {
  notFound: {
    icon: 'search_off',
    title: 'SUMMONER NOT FOUND',
    desc: 'We couldn\'t locate this summoner. Check the Riot ID and region.',
  },
  rateLimited: {
    icon: 'timer',
    title: 'RATE LIMIT EXCEEDED',
    desc: 'Too many requests. Data may be delayed up to 5 minutes.',
  },
  noRanked: {
    icon: 'shield',
    title: 'UNRANKED',
    desc: 'This summoner has not played ranked this season.',
  },
  noMatches: {
    icon: 'sports_esports',
    title: 'NO MATCHES FOUND',
    desc: 'No recent match data available for this summoner.',
  },
  notInGame: {
    icon: 'visibility_off',
    title: 'NOT IN GAME',
    desc: 'This summoner is not currently in an active game.',
  },
  generic: {
    icon: 'error_outline',
    title: 'SOMETHING WENT WRONG',
    desc: 'An unexpected error occurred. Please try again.',
  },
};

function ErrorState({ type = 'generic', message, onRetry }) {
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.generic;

  return (
    <div className="error-state">
      <span className="material-icons error-state-icon">{config.icon}</span>
      <h3 className="error-state-title">{config.title}</h3>
      <p className="error-state-desc">{message || config.desc}</p>
      {onRetry && (
        <button className="btn btn-primary btn-sm" onClick={onRetry} style={{ marginTop: '1rem' }}>
          <span className="material-icons" style={{ fontSize: '0.875rem' }}>refresh</span>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
