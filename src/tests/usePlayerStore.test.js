import { describe, it, expect, beforeEach } from 'vitest';
import usePlayerStore from '../store/usePlayerStore';

// Reset store before each test
beforeEach(() => {
  usePlayerStore.setState({
    region: 'americas',
    platform: 'na1',
    searchQuery: '',
    account: null,
    summoner: null,
    leagueEntries: [],
    mastery: [],
    matchIds: [],
    matches: [],
    activeGame: null,
    derivedStats: null,
    loading: false,
    loadingMatches: false,
    error: null,
  });
});

// ══════════════════════════════════════════════════════════════════
// Initial State
// ══════════════════════════════════════════════════════════════════
describe('usePlayerStore – Initial State', () => {
  it('has correct default region and platform', () => {
    const state = usePlayerStore.getState();
    expect(state.region).toBe('americas');
    expect(state.platform).toBe('na1');
  });

  it('starts with no player data', () => {
    const state = usePlayerStore.getState();
    expect(state.account).toBeNull();
    expect(state.summoner).toBeNull();
    expect(state.leagueEntries).toEqual([]);
    expect(state.matches).toEqual([]);
  });

  it('starts with loading false', () => {
    const state = usePlayerStore.getState();
    expect(state.loading).toBe(false);
    expect(state.loadingMatches).toBe(false);
  });

  it('starts with no error', () => {
    expect(usePlayerStore.getState().error).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════
// Actions – setRegion, setPlatform, setSearchQuery
// ══════════════════════════════════════════════════════════════════
describe('usePlayerStore – Setters', () => {
  it('sets region', () => {
    usePlayerStore.getState().setRegion('europe');
    expect(usePlayerStore.getState().region).toBe('europe');
  });

  it('sets platform and derives region', () => {
    usePlayerStore.getState().setPlatform('euw1');
    const state = usePlayerStore.getState();
    expect(state.platform).toBe('euw1');
    expect(state.region).toBe('europe');
  });

  it('sets platform to KR and region to asia', () => {
    usePlayerStore.getState().setPlatform('kr');
    expect(usePlayerStore.getState().region).toBe('asia');
  });

  it('sets search query', () => {
    usePlayerStore.getState().setSearchQuery('Faker#KR1');
    expect(usePlayerStore.getState().searchQuery).toBe('Faker#KR1');
  });
});

// ══════════════════════════════════════════════════════════════════
// Actions – clearPlayer
// ══════════════════════════════════════════════════════════════════
describe('usePlayerStore – clearPlayer', () => {
  it('clears all player data', () => {
    // Simulate some data being set
    usePlayerStore.setState({
      account: { puuid: 'abc', gameName: 'Test', tagLine: 'NA1' },
      summoner: { id: 's1', summonerLevel: 100 },
      leagueEntries: [{ tier: 'GOLD' }],
      matches: [{ info: {} }],
      derivedStats: { winRate: 50 },
      error: { type: 'generic', message: 'test' },
    });

    usePlayerStore.getState().clearPlayer();
    const state = usePlayerStore.getState();

    expect(state.account).toBeNull();
    expect(state.summoner).toBeNull();
    expect(state.leagueEntries).toEqual([]);
    expect(state.matches).toEqual([]);
    expect(state.derivedStats).toBeNull();
    expect(state.error).toBeNull();
  });
});
