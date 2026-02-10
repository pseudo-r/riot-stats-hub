import { create } from 'zustand';
import {
  resolveAccount,
  getSummoner,
  getLeagueEntries,
  getMatchIds,
  getMatchDetail,
  getChampionMastery,
  getActiveGame,
  getRegionForPlatform,
} from '../api/riotApi';
import { calcWinRate, calcAvgKDA, calcAvgCSPerMin, calcAvgKillParticipation } from '../utils/stats';

const usePlayerStore = create((set, get) => ({
  // ── Search state ─────────────────────────────────
  region: 'americas',
  platform: 'na1',
  searchQuery: '',

  // ── Player data ──────────────────────────────────
  account: null,       // { puuid, gameName, tagLine }
  summoner: null,      // { id, profileIconId, summonerLevel, ... }
  leagueEntries: [],   // [{ queueType, tier, rank, lp, wins, losses }]
  mastery: [],         // [{ championId, championLevel, championPoints }]
  matchIds: [],
  matches: [],         // Full match details
  activeGame: null,    // Live game data or null

  // ── Derived stats ────────────────────────────────
  derivedStats: null,

  // ── UI state ─────────────────────────────────────
  loading: false,
  loadingMatches: false,
  error: null,         // { type: 'notFound' | 'rateLimited' | 'generic', message }

  // ── Actions ──────────────────────────────────────

  setRegion: (region) => set({ region }),
  setPlatform: (platform) => set({ platform, region: getRegionForPlatform(platform) }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  clearPlayer: () =>
    set({
      account: null,
      summoner: null,
      leagueEntries: [],
      mastery: [],
      matchIds: [],
      matches: [],
      activeGame: null,
      derivedStats: null,
      error: null,
    }),

  /** Full player lookup: Riot ID → all data */
  fetchPlayer: async (region, platform, gameName, tagLine) => {
    set({ loading: true, error: null });

    try {
      // 1. Resolve Riot ID → PUUID
      const account = await resolveAccount(region, gameName, tagLine);
      set({ account, region, platform });

      // 2. Summoner profile
      const summoner = await getSummoner(platform, account.puuid);
      set({ summoner });

      // 3. League entries (ranked data)
      const leagueEntries = await getLeagueEntries(platform, account.puuid);
      set({ leagueEntries });

      // 4. Champion mastery (top 5)
      const mastery = await getChampionMastery(platform, account.puuid, 5);
      set({ mastery });

      // 5. Active game (fire and forget)
      getActiveGame(platform, account.puuid)
        .then(activeGame => set({ activeGame }))
        .catch(() => set({ activeGame: null }));

      // 6. Match history
      set({ loadingMatches: true });
      const matchIds = await getMatchIds(region, account.puuid, { count: 20 });
      set({ matchIds });

      // Fetch match details (batch)
      const matchPromises = matchIds.slice(0, 20).map(id => getMatchDetail(region, id));
      const matches = await Promise.allSettled(matchPromises);
      const validMatches = matches
        .filter(m => m.status === 'fulfilled')
        .map(m => m.value);

      // Calculate derived stats
      const winRate = calcWinRate(validMatches, account.puuid);
      const kda = calcAvgKDA(validMatches, account.puuid);
      const csPerMin = calcAvgCSPerMin(validMatches, account.puuid);
      const killParticipation = calcAvgKillParticipation(validMatches, account.puuid);

      set({
        matches: validMatches,
        derivedStats: { ...winRate, ...kda, csPerMin, killParticipation },
        loadingMatches: false,
        loading: false,
      });

    } catch (err) {
      const status = err?.response?.status;
      let error;

      if (status === 404) {
        error = { type: 'notFound', message: 'Player not found. Check the Riot ID and region.' };
      } else if (status === 429) {
        error = { type: 'rateLimited', message: 'Rate limit exceeded. Please wait and try again.' };
      } else {
        error = { type: 'generic', message: err.message || 'An error occurred.' };
      }

      set({ error, loading: false, loadingMatches: false });
    }
  },

  /** Load more matches */
  loadMoreMatches: async () => {
    const { region, account, matchIds, matches } = get();
    if (!account?.puuid) return;

    set({ loadingMatches: true });
    try {
      const newIds = await getMatchIds(region, account.puuid, {
        start: matchIds.length,
        count: 10,
      });

      const matchPromises = newIds.map(id => getMatchDetail(region, id));
      const results = await Promise.allSettled(matchPromises);
      const newMatches = results
        .filter(m => m.status === 'fulfilled')
        .map(m => m.value);

      const allMatches = [...matches, ...newMatches];
      const derivedStats = {
        ...calcWinRate(allMatches, account.puuid),
        ...calcAvgKDA(allMatches, account.puuid),
        csPerMin: calcAvgCSPerMin(allMatches, account.puuid),
        killParticipation: calcAvgKillParticipation(allMatches, account.puuid),
      };

      set({
        matchIds: [...matchIds, ...newIds],
        matches: allMatches,
        derivedStats,
        loadingMatches: false,
      });
    } catch {
      set({ loadingMatches: false });
    }
  },
}));

export default usePlayerStore;
