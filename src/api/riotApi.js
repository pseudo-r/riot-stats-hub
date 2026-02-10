import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// ── Platform ↔ Region mapping ──────────────────────────────────
const PLATFORM_TO_REGION = {
  na1: 'americas',
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',
  euw1: 'europe',
  eune1: 'europe',
  tr1: 'europe',
  ru: 'europe',
  kr: 'asia',
  jp1: 'asia',
  oc1: 'americas',
  ph2: 'asia',
  sg2: 'asia',
  th2: 'asia',
  tw2: 'asia',
  vn2: 'asia',
};

export function getRegionForPlatform(platform) {
  return PLATFORM_TO_REGION[platform.toLowerCase()] || 'americas';
}

// ── Account-V1 ─────────────────────────────────────────────────

/** Resolve Riot ID (name#tag) → account data (puuid, gameName, tagLine) */
export async function resolveAccount(region, gameName, tagLine) {
  const { data } = await api.get(`/account/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
  return data;
}

/** Get Riot ID from PUUID */
export async function getAccountByPuuid(region, puuid) {
  const { data } = await api.get(`/account/${region}/by-puuid/${puuid}`);
  return data;
}

// ── Summoner-V4 ────────────────────────────────────────────────

/** Get summoner profile (level, profileIconId, id) */
export async function getSummoner(platform, puuid) {
  const { data } = await api.get(`/summoner/${platform}/${puuid}`);
  return data;
}

// ── League-V4 ──────────────────────────────────────────────────

/** Get ranked entries for a summoner (by PUUID) */
export async function getLeagueEntries(platform, puuid) {
  const { data } = await api.get(`/league/${platform}/${puuid}`);
  return data;
}

// ── Match-V5 ───────────────────────────────────────────────────

/** Get list of match IDs */
export async function getMatchIds(region, puuid, { start = 0, count = 20, queue, type } = {}) {
  const params = new URLSearchParams({ start: String(start), count: String(count) });
  if (queue) params.set('queue', String(queue));
  if (type) params.set('type', type);
  const { data } = await api.get(`/matches/${region}/${puuid}?${params}`);
  return data;
}

/** Get full match detail */
export async function getMatchDetail(region, matchId) {
  const { data } = await api.get(`/match/${region}/${matchId}`);
  return data;
}

// ── Champion Mastery-V4 ────────────────────────────────────────

/** Get top champion masteries */
export async function getChampionMastery(platform, puuid, count = 5) {
  const { data } = await api.get(`/mastery/${platform}/${puuid}?count=${count}`);
  return data;
}

// ── Spectator-V4 ───────────────────────────────────────────────

/** Get active game (returns null if not in game) */
export async function getActiveGame(platform, puuid) {
  const { data } = await api.get(`/spectator/${platform}/${puuid}`);
  return data;
}

// ── Health ─────────────────────────────────────────────────────

export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

// ── League Tiers (Challenger / Grandmaster / Master) ──────────

/** Get challenger league for a queue */
export async function getChallengerLeague(platform, queue = 'RANKED_SOLO_5x5') {
  const { data } = await api.get(`/league-tier/${platform}/challenger?queue=${queue}`);
  return data;
}

/** Get grandmaster league for a queue */
export async function getGrandmasterLeague(platform, queue = 'RANKED_SOLO_5x5') {
  const { data } = await api.get(`/league-tier/${platform}/grandmaster?queue=${queue}`);
  return data;
}

/** Get master league for a queue */
export async function getMasterLeague(platform, queue = 'RANKED_SOLO_5x5') {
  const { data } = await api.get(`/league-tier/${platform}/master?queue=${queue}`);
  return data;
}

// ── LoL Platform Status ───────────────────────────────────────

export async function getLolStatus(platform) {
  const { data } = await api.get(`/lol-status/${platform}`);
  return data;
}

// ── Champion Rotations ────────────────────────────────────────

export async function getChampionRotations(platform) {
  const { data } = await api.get(`/champion-rotations/${platform}`);
  return data;
}

export default api;
