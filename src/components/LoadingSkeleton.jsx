import './LoadingSkeleton.css';

function LoadingSkeleton({ variant = 'page' }) {
  if (variant === 'matches') {
    return (
      <div className="skel-matches">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skel-match-row">
            <div className="skeleton skel-bar" style={{ width: 3, height: '100%' }} />
            <div className="skel-match-inner">
              <div className="skeleton" style={{ width: '5rem', height: '100%' }} />
              <div className="skeleton" style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div className="skeleton" style={{ width: '60%', height: '0.75rem' }} />
                <div className="skeleton" style={{ width: '40%', height: '0.5rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="skeleton" style={{ width: '1.5rem', height: '1.5rem' }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="skel-sidebar">
        <div className="skeleton" style={{ height: '8rem' }} />
        <div className="skeleton" style={{ height: '8rem', marginTop: '1rem' }} />
        <div className="skeleton" style={{ height: '12rem', marginTop: '1rem' }} />
      </div>
    );
  }

  return (
    <div className="skel-page">
      <div className="skeleton skel-banner" />
      <div className="skel-row">
        <div className="skeleton skel-stat-card" />
        <div className="skeleton skel-stat-card" />
        <div className="skeleton skel-stat-card" />
      </div>
      <div className="skel-grid">
        <div className="skel-content">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton skel-match-placeholder" />
          ))}
        </div>
        <div className="skel-side">
          <div className="skeleton" style={{ height: '10rem' }} />
          <div className="skeleton" style={{ height: '10rem', marginTop: '1rem' }} />
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
