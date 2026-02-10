import api from './riotApi';

// ── VAL Content ────────────────────────────────────────────────

export async function getValContent(shard = 'na', locale = 'en-US') {
  const { data } = await api.get(`/val/content/${shard}?locale=${locale}`);
  return data;
}

// ── VAL Ranked Leaderboard ─────────────────────────────────────

export async function getValLeaderboard(shard, actId, { size = 200, startIndex = 0 } = {}) {
  const { data } = await api.get(`/val/ranked/${shard}/${actId}?size=${size}&startIndex=${startIndex}`);
  return data;
}

// ── VAL Match ──────────────────────────────────────────────────

export async function getValMatch(shard, matchId) {
  const { data } = await api.get(`/val/match/${shard}/${matchId}`);
  return data;
}

export async function getValMatchHistory(shard, puuid) {
  const { data } = await api.get(`/val/matchlist/${shard}/${puuid}`);
  return data;
}

// ── VAL Recent Matches by Queue ────────────────────────────────

export async function getValRecentMatches(shard, queue) {
  const { data } = await api.get(`/val/recent/${shard}/${queue}`);
  return data;
}

// ── VAL Platform Status ────────────────────────────────────────

export async function getValStatus(shard = 'na') {
  const { data } = await api.get(`/val/status/${shard}`);
  return data;
}
