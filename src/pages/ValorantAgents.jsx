import { useState, useEffect } from 'react';
import { fetchValAgents } from '../api/valorantAssets';
import './GamePages.css';

const ROLES = ['All', 'Duelist', 'Initiator', 'Controller', 'Sentinel'];

function ValorantAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [hoveredAgent, setHoveredAgent] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchValAgents();
        setAgents(data);
      } catch {
        setAgents([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="main-content">
      <div className="game-page-header">
        <div className="game-badge valorant">VAL</div>
        <div>
          <h1 className="game-page-title">Agents</h1>
          <p className="text-muted-color" style={{ fontSize: '0.857rem' }}>
            {agents.length} playable agents
          </p>
        </div>
      </div>

      <div className="game-controls">
        <div className="game-tabs">
          {ROLES.map(r => (
            <button key={r} className={`filter-chip ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="game-search-bar">
        <span className="material-icons" style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>search</span>
        <input
          type="text"
          placeholder="Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="game-search-input"
        />
        <span className="text-muted-color" style={{ fontSize: '0.786rem' }}>{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="game-loading"><span className="material-icons spin">autorenew</span><p>Loading agents...</p></div>
      ) : (
        <div className="val-agents-grid">
          {filtered.map(agent => {
            const gradBg = agent.gradientColors?.length >= 2
              ? `linear-gradient(135deg, #${agent.gradientColors[0].slice(0,6)}, #${agent.gradientColors[1].slice(0,6)})`
              : 'linear-gradient(135deg, #1a1a2e, #0f1923)';
            return (
              <div
                key={agent.uuid}
                className="val-agent-card has-portrait"
                style={{ background: gradBg }}
                onMouseEnter={() => setHoveredAgent(agent.uuid)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <div className="val-agent-portrait-wrap">
                  <img
                    src={agent.icon}
                    alt={agent.name}
                    className="val-agent-portrait"
                    loading="lazy"
                  />
                </div>
                <div className="val-agent-info">
                  <h3 className="val-agent-name">{agent.name}</h3>
                  <div className="val-agent-role">
                    {agent.roleIcon && <img src={agent.roleIcon} alt={agent.role} className="val-role-icon" />}
                    <span>{agent.role}</span>
                  </div>
                </div>
                {hoveredAgent === agent.uuid && agent.abilities?.length > 0 && (
                  <div className="val-agent-abilities">
                    {agent.abilities.filter(ab => ab.icon).slice(0, 4).map(ab => (
                      <img
                        key={ab.slot}
                        src={ab.icon}
                        alt={ab.name}
                        title={ab.name}
                        className="val-ability-icon"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ValorantAgents;
