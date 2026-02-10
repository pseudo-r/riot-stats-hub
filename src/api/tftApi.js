import api from './riotApi';

// Re-use the shared axios instance and region mapping from riotApi.js
import { getRegionForPlatform } from './riotApi';

// ── TFT Summoner ───────────────────────────────────────────────

export async function getTftSummoner(platform, puuid) {
  const { data } = await api.get(`/tft/summoner/${platform}/${puuid}`);
  return data;
}

// ── TFT League ─────────────────────────────────────────────────

export async function getTftLeagueEntries(platform, puuid) {
  const { data } = await api.get(`/tft/league/${platform}/${puuid}`);
  return data;
}

export async function getTftLeagueEntriesByTier(platform, tier, division, page = 1) {
  const { data } = await api.get(`/tft/league-entries/${platform}/${tier}/${division}?page=${page}`);
  return data;
}

export async function getTftLeagueById(platform, leagueId) {
  const { data } = await api.get(`/tft/league-by-id/${platform}/${leagueId}`);
  return data;
}

export async function getTftChallengerLeague(platform) {
  const { data } = await api.get(`/tft/league-tier/${platform}/challenger`);
  return data;
}

export async function getTftGrandmasterLeague(platform) {
  const { data } = await api.get(`/tft/league-tier/${platform}/grandmaster`);
  return data;
}

export async function getTftMasterLeague(platform) {
  const { data } = await api.get(`/tft/league-tier/${platform}/master`);
  return data;
}

// ── TFT Top Rated Ladder ───────────────────────────────────────

export async function getTftTopRatedLadder(platform, queue = 'RANKED_TFT_TURBO') {
  const { data } = await api.get(`/tft/rated/${platform}/${queue}`);
  return data;
}

// ── TFT Platform Status ───────────────────────────────────────

export async function getTftStatus(platform) {
  const { data } = await api.get(`/tft/status/${platform}`);
  return data;
}

// ── TFT Matches ────────────────────────────────────────────────

export async function getTftMatchIds(region, puuid, { start = 0, count = 20 } = {}) {
  const { data } = await api.get(`/tft/matches/${region}/${puuid}?start=${start}&count=${count}`);
  return data;
}

export async function getTftMatchDetail(region, matchId) {
  const { data } = await api.get(`/tft/match/${region}/${matchId}`);
  return data;
}

export { getRegionForPlatform };
