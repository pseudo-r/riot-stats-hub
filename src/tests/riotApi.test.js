import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
  getRegionForPlatform,
  resolveAccount,
  getSummoner,
  getLeagueEntries,
  getMatchIds,
  getMatchDetail,
  getChampionMastery,
  getActiveGame,
  checkHealth,
  getChallengerLeague,
} from '../api/riotApi';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: mockAxios };
});

const api = axios.create();

beforeEach(() => {
  vi.clearAllMocks();
});

// ══════════════════════════════════════════════════════════════════
// getRegionForPlatform (pure function, no mocking needed)
// ══════════════════════════════════════════════════════════════════
describe('getRegionForPlatform', () => {
  it('maps NA1 to americas', () => {
    expect(getRegionForPlatform('na1')).toBe('americas');
  });

  it('maps EUW1 to europe', () => {
    expect(getRegionForPlatform('euw1')).toBe('europe');
  });

  it('maps KR to asia', () => {
    expect(getRegionForPlatform('kr')).toBe('asia');
  });

  it('maps JP1 to asia', () => {
    expect(getRegionForPlatform('jp1')).toBe('asia');
  });

  it('maps BR1 to americas', () => {
    expect(getRegionForPlatform('br1')).toBe('americas');
  });

  it('handles uppercase input', () => {
    expect(getRegionForPlatform('NA1')).toBe('americas');
  });

  it('returns americas for unknown platform', () => {
    expect(getRegionForPlatform('unknown')).toBe('americas');
  });
});

// ══════════════════════════════════════════════════════════════════
// resolveAccount
// ══════════════════════════════════════════════════════════════════
describe('resolveAccount', () => {
  it('calls correct endpoint and returns account data', async () => {
    const mockData = { puuid: 'abc-123', gameName: 'Faker', tagLine: 'KR1' };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await resolveAccount('asia', 'Faker', 'KR1');
    expect(api.get).toHaveBeenCalledWith('/account/asia/Faker/KR1');
    expect(result).toEqual(mockData);
  });

  it('encodes special characters in name', async () => {
    const mockData = { puuid: 'xyz', gameName: 'Test User', tagLine: 'NA1' };
    api.get.mockResolvedValueOnce({ data: mockData });

    await resolveAccount('americas', 'Test User', 'NA1');
    expect(api.get).toHaveBeenCalledWith('/account/americas/Test%20User/NA1');
  });
});

// ══════════════════════════════════════════════════════════════════
// getSummoner
// ══════════════════════════════════════════════════════════════════
describe('getSummoner', () => {
  it('fetches summoner profile', async () => {
    const mockData = { id: 'sum-1', profileIconId: 4567, summonerLevel: 350 };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getSummoner('na1', 'puuid-abc');
    expect(api.get).toHaveBeenCalledWith('/summoner/na1/puuid-abc');
    expect(result).toEqual(mockData);
  });
});

// ══════════════════════════════════════════════════════════════════
// getLeagueEntries
// ══════════════════════════════════════════════════════════════════
describe('getLeagueEntries', () => {
  it('fetches ranked entries', async () => {
    const mockData = [
      { queueType: 'RANKED_SOLO_5x5', tier: 'DIAMOND', rank: 'II', leaguePoints: 75 },
    ];
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getLeagueEntries('na1', 'puuid-abc');
    expect(api.get).toHaveBeenCalledWith('/league/na1/puuid-abc');
    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe('DIAMOND');
  });
});

// ══════════════════════════════════════════════════════════════════
// getMatchIds
// ══════════════════════════════════════════════════════════════════
describe('getMatchIds', () => {
  it('fetches match IDs with default params', async () => {
    const mockData = ['NA1_123', 'NA1_456', 'NA1_789'];
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getMatchIds('americas', 'puuid-abc');
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/matches/americas/puuid-abc'));
    expect(result).toHaveLength(3);
  });

  it('passes custom start and count params', async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    await getMatchIds('americas', 'puuid-abc', { start: 20, count: 10 });
    const callUrl = api.get.mock.calls[0][0];
    expect(callUrl).toContain('start=20');
    expect(callUrl).toContain('count=10');
  });
});

// ══════════════════════════════════════════════════════════════════
// getMatchDetail
// ══════════════════════════════════════════════════════════════════
describe('getMatchDetail', () => {
  it('fetches full match detail', async () => {
    const mockData = { metadata: { matchId: 'NA1_123' }, info: { gameDuration: 1800 } };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getMatchDetail('americas', 'NA1_123');
    expect(api.get).toHaveBeenCalledWith('/match/americas/NA1_123');
    expect(result.info.gameDuration).toBe(1800);
  });
});

// ══════════════════════════════════════════════════════════════════
// getChampionMastery
// ══════════════════════════════════════════════════════════════════
describe('getChampionMastery', () => {
  it('fetches top mastery champions', async () => {
    const mockData = [
      { championId: 21, championLevel: 7, championPoints: 350000 },
      { championId: 99, championLevel: 6, championPoints: 120000 },
    ];
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getChampionMastery('na1', 'puuid-abc', 5);
    expect(api.get).toHaveBeenCalledWith('/mastery/na1/puuid-abc?count=5');
    expect(result).toHaveLength(2);
    expect(result[0].championPoints).toBe(350000);
  });
});

// ══════════════════════════════════════════════════════════════════
// getActiveGame
// ══════════════════════════════════════════════════════════════════
describe('getActiveGame', () => {
  it('returns game data when in game', async () => {
    const mockData = { gameId: 12345, mapId: 11 };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getActiveGame('na1', 'puuid-abc');
    expect(result.gameId).toBe(12345);
  });
});

// ══════════════════════════════════════════════════════════════════
// checkHealth
// ══════════════════════════════════════════════════════════════════
describe('checkHealth', () => {
  it('returns health status', async () => {
    api.get.mockResolvedValueOnce({ data: { status: 'ok' } });

    const result = await checkHealth();
    expect(api.get).toHaveBeenCalledWith('/health');
    expect(result.status).toBe('ok');
  });
});

// ══════════════════════════════════════════════════════════════════
// getChallengerLeague
// ══════════════════════════════════════════════════════════════════
describe('getChallengerLeague', () => {
  it('fetches challenger league data', async () => {
    const mockData = { tier: 'CHALLENGER', entries: [{ summonerName: 'Player1', leaguePoints: 1500 }] };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getChallengerLeague('na1');
    expect(api.get).toHaveBeenCalledWith('/league-tier/na1/challenger?queue=RANKED_SOLO_5x5');
    expect(result.tier).toBe('CHALLENGER');
  });
});
