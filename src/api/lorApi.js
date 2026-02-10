import api from './riotApi';

// ── LoR Ranked Leaderboard ─────────────────────────────────────

export async function getLorRankedLeaderboard(region = 'americas') {
  const { data } = await api.get(`/lor/ranked/${region}`);
  return data;
}

// ── LoR Matches ────────────────────────────────────────────────

export async function getLorMatchIds(region, puuid) {
  const { data } = await api.get(`/lor/matches/${region}/${puuid}`);
  return data;
}

export async function getLorMatch(region, matchId) {
  const { data } = await api.get(`/lor/match/${region}/${matchId}`);
  return data;
}

// ── LoR Decks (OAuth2 required) ────────────────────────────────

export async function getLorDecks(region = 'americas') {
  const { data } = await api.get(`/lor/decks/${region}`);
  return data;
}

// ── LoR Inventory (OAuth2 required) ────────────────────────────

export async function getLorInventory(region = 'americas') {
  const { data } = await api.get(`/lor/inventory/${region}`);
  return data;
}

// ── LoR Platform Status ────────────────────────────────────────

export async function getLorStatus(region = 'americas') {
  const { data } = await api.get(`/lor/status/${region}`);
  return data;
}
