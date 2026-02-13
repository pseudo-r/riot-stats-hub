import { describe, it, expect } from 'vitest';
import {
  calcWinRate,
  calcAvgKDA,
  calcAvgCSPerMin,
  calcAvgKillParticipation,
  formatNumber,
  formatDuration,
  getQueueName,
} from '../utils/stats';

// ── Helper: build a fake match object ──────────────────────────
function makeMatch(puuid, { win = true, kills = 5, deaths = 2, assists = 7, cs = 180, duration = 1800, teamKills = 30 } = {}) {
  return {
    info: {
      gameDuration: duration,
      participants: [
        {
          puuid,
          win,
          kills,
          deaths,
          assists,
          totalMinionsKilled: cs,
          neutralMinionsKilled: 20,
          teamId: 100,
          totalDamageDealtToChampions: 25000,
          visionScore: 30,
        },
        // Teammate to test kill participation
        {
          puuid: 'teammate-1',
          win,
          kills: teamKills - kills,
          deaths: 3,
          assists: 5,
          totalMinionsKilled: 100,
          neutralMinionsKilled: 0,
          teamId: 100,
          totalDamageDealtToChampions: 15000,
          visionScore: 20,
        },
        // Enemy
        {
          puuid: 'enemy-1',
          win: !win,
          kills: 4,
          deaths: 5,
          assists: 3,
          totalMinionsKilled: 120,
          neutralMinionsKilled: 10,
          teamId: 200,
          totalDamageDealtToChampions: 18000,
          visionScore: 15,
        },
      ],
    },
  };
}

const PUUID = 'test-puuid-12345';

// ══════════════════════════════════════════════════════════════════
// calcWinRate
// ══════════════════════════════════════════════════════════════════
describe('calcWinRate', () => {
  it('returns 100% for all wins', () => {
    const matches = [
      makeMatch(PUUID, { win: true }),
      makeMatch(PUUID, { win: true }),
      makeMatch(PUUID, { win: true }),
    ];
    const result = calcWinRate(matches, PUUID);
    expect(result.wins).toBe(3);
    expect(result.losses).toBe(0);
    expect(result.winRate).toBe(100);
  });

  it('returns 0% for all losses', () => {
    const matches = [
      makeMatch(PUUID, { win: false }),
      makeMatch(PUUID, { win: false }),
    ];
    const result = calcWinRate(matches, PUUID);
    expect(result.wins).toBe(0);
    expect(result.losses).toBe(2);
    expect(result.winRate).toBe(0);
  });

  it('calculates mixed results correctly', () => {
    const matches = [
      makeMatch(PUUID, { win: true }),
      makeMatch(PUUID, { win: false }),
      makeMatch(PUUID, { win: true }),
      makeMatch(PUUID, { win: false }),
    ];
    const result = calcWinRate(matches, PUUID);
    expect(result.wins).toBe(2);
    expect(result.losses).toBe(2);
    expect(result.winRate).toBe(50);
  });

  it('handles empty match array', () => {
    const result = calcWinRate([], PUUID);
    expect(result.wins).toBe(0);
    expect(result.losses).toBe(0);
    expect(result.winRate).toBe(0);
  });

  it('skips matches where player is not found', () => {
    const matches = [makeMatch('other-puuid', { win: true })];
    const result = calcWinRate(matches, PUUID);
    expect(result.wins).toBe(0);
    expect(result.losses).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════
// calcAvgKDA
// ══════════════════════════════════════════════════════════════════
describe('calcAvgKDA', () => {
  it('calculates average KDA from multiple games', () => {
    const matches = [
      makeMatch(PUUID, { kills: 10, deaths: 2, assists: 8 }),
      makeMatch(PUUID, { kills: 4, deaths: 4, assists: 6 }),
    ];
    const result = calcAvgKDA(matches, PUUID);
    expect(result.avgKills).toBe(7);
    expect(result.avgDeaths).toBe(3);
    expect(result.avgAssists).toBe(7);
    expect(result.kdaRatio).toBeGreaterThan(0);
  });

  it('handles zero deaths (perfect KDA)', () => {
    const matches = [
      makeMatch(PUUID, { kills: 10, deaths: 0, assists: 5 }),
    ];
    const result = calcAvgKDA(matches, PUUID);
    expect(result.avgDeaths).toBe(0);
    // Perfect KDA = kills + assists
    expect(result.kdaRatio).toBe(15);
  });

  it('returns zeros for empty matches', () => {
    const result = calcAvgKDA([], PUUID);
    expect(result.avgKills).toBe(0);
    expect(result.avgDeaths).toBe(0);
    expect(result.avgAssists).toBe(0);
    expect(result.kdaRatio).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════
// calcAvgCSPerMin
// ══════════════════════════════════════════════════════════════════
describe('calcAvgCSPerMin', () => {
  it('calculates CS per minute', () => {
    // 180 minions + 20 neutral = 200 CS in 1800s (30 min) → 6.67 CS/min
    const matches = [makeMatch(PUUID, { cs: 180, duration: 1800 })];
    const result = calcAvgCSPerMin(matches, PUUID);
    expect(result).toBeCloseTo(6.7, 0);
  });

  it('returns 0 for empty matches', () => {
    expect(calcAvgCSPerMin([], PUUID)).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════
// calcAvgKillParticipation
// ══════════════════════════════════════════════════════════════════
describe('calcAvgKillParticipation', () => {
  it('calculates kill participation percentage', () => {
    // Player: 5 kills + 7 assists = 12, Team total: 30 kills → 40%
    const matches = [makeMatch(PUUID, { kills: 5, assists: 7, teamKills: 30 })];
    const result = calcAvgKillParticipation(matches, PUUID);
    expect(result).toBe(40);
  });

  it('returns 0 for empty matches', () => {
    expect(calcAvgKillParticipation([], PUUID)).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════
// formatNumber
// ══════════════════════════════════════════════════════════════════
describe('formatNumber', () => {
  it('formats thousands', () => {
    expect(formatNumber(24200)).toBe('24.2k');
  });

  it('formats millions', () => {
    expect(formatNumber(1500000)).toBe('1.5M');
  });

  it('leaves small numbers as-is', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

// ══════════════════════════════════════════════════════════════════
// formatDuration
// ══════════════════════════════════════════════════════════════════
describe('formatDuration', () => {
  it('formats seconds to minutes and seconds', () => {
    expect(formatDuration(1512)).toBe('25m 12s');
  });

  it('handles exact minutes', () => {
    expect(formatDuration(1800)).toBe('30m 0s');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0m 0s');
  });
});

// ══════════════════════════════════════════════════════════════════
// getQueueName
// ══════════════════════════════════════════════════════════════════
describe('getQueueName', () => {
  it('returns known queue names', () => {
    expect(getQueueName(420)).toBe('Ranked Solo');
    expect(getQueueName(440)).toBe('Ranked Flex');
    expect(getQueueName(450)).toBe('ARAM');
  });

  it('returns fallback for unknown queue', () => {
    expect(getQueueName(9999)).toBe('Mode 9999');
  });
});
