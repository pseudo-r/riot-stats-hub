/**
 * Derived stats computation from match data.
 * All functions expect an array of participant-level match entries
 * (the player's own participant data extracted from Match-V5).
 */

/**
 * Calculate win rate from matches.
 * @param {Array} matches - Array of { info: { participants } } with player PUUID
 * @param {string} puuid - The player's PUUID
 * @returns {{ wins: number, losses: number, winRate: number }}
 */
export function calcWinRate(matches, puuid) {
  let wins = 0;
  let losses = 0;

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;
    if (player.win) wins++;
    else losses++;
  }

  const total = wins + losses;
  return {
    wins,
    losses,
    winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
  };
}

/**
 * Calculate average KDA.
 * @returns {{ avgKills: number, avgDeaths: number, avgAssists: number, kdaRatio: number }}
 */
export function calcAvgKDA(matches, puuid) {
  let totalKills = 0, totalDeaths = 0, totalAssists = 0, count = 0;

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;
    totalKills += player.kills;
    totalDeaths += player.deaths;
    totalAssists += player.assists;
    count++;
  }

  if (count === 0) return { avgKills: 0, avgDeaths: 0, avgAssists: 0, kdaRatio: 0 };

  const avgKills = totalKills / count;
  const avgDeaths = totalDeaths / count;
  const avgAssists = totalAssists / count;
  const kdaRatio = avgDeaths === 0 ? avgKills + avgAssists : (avgKills + avgAssists) / avgDeaths;

  return {
    avgKills: +avgKills.toFixed(1),
    avgDeaths: +avgDeaths.toFixed(1),
    avgAssists: +avgAssists.toFixed(1),
    kdaRatio: +kdaRatio.toFixed(2),
  };
}

/**
 * Calculate average CS per minute.
 */
export function calcAvgCSPerMin(matches, puuid) {
  let totalCSPM = 0, count = 0;

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;
    const minutes = match.info.gameDuration / 60;
    if (minutes > 0) {
      totalCSPM += (player.totalMinionsKilled + (player.neutralMinionsKilled || 0)) / minutes;
      count++;
    }
  }

  return count > 0 ? +(totalCSPM / count).toFixed(1) : 0;
}

/**
 * Get most played champions from match data.
 * @returns {Array<{ championId: number, championName: string, games: number, wins: number, winRate: number }>}
 */
export function getMostPlayed(matches, puuid, limit = 5) {
  const champMap = {};

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;

    const key = player.championId;
    if (!champMap[key]) {
      champMap[key] = {
        championId: key,
        championName: player.championName,
        games: 0,
        wins: 0,
      };
    }
    champMap[key].games++;
    if (player.win) champMap[key].wins++;
  }

  return Object.values(champMap)
    .map(c => ({
      ...c,
      winRate: c.games > 0 ? Math.round((c.wins / c.games) * 100) : 0,
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, limit);
}

/**
 * Calculate average damage dealt per game.
 */
export function calcAvgDamage(matches, puuid) {
  let total = 0, count = 0;

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;
    total += player.totalDamageDealtToChampions || 0;
    count++;
  }

  return count > 0 ? Math.round(total / count) : 0;
}

/**
 * Calculate average vision score per game.
 */
export function calcAvgVision(matches, puuid) {
  let total = 0, count = 0;

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;
    total += player.visionScore || 0;
    count++;
  }

  return count > 0 ? +(total / count).toFixed(1) : 0;
}

/**
 * Calculate average kill participation.
 */
export function calcAvgKillParticipation(matches, puuid) {
  let totalKP = 0, count = 0;

  for (const match of matches) {
    const player = findPlayer(match, puuid);
    if (!player) continue;

    // Get team total kills
    const teamId = player.teamId;
    const teamKills = match.info.participants
      .filter(p => p.teamId === teamId)
      .reduce((sum, p) => sum + p.kills, 0);

    if (teamKills > 0) {
      totalKP += (player.kills + player.assists) / teamKills;
      count++;
    }
  }

  return count > 0 ? Math.round((totalKP / count) * 100) : 0;
}

/**
 * Find the player's participant data in a match.
 */
function findPlayer(match, puuid) {
  return match?.info?.participants?.find(p => p.puuid === puuid) || null;
}

/**
 * Format large numbers (e.g., 24200 → "24.2k").
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return String(num);
}

/**
 * Format game duration (seconds → "25m 12s").
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

/**
 * Format relative time (timestamp → "2 hours ago").
 */
export function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/** Queue ID labels */
const QUEUE_NAMES = {
  420: 'Ranked Solo',
  440: 'Ranked Flex',
  400: 'Normal Draft',
  430: 'Normal Blind',
  450: 'ARAM',
  700: 'Clash',
  900: 'URF',
  1020: 'One for All',
  1300: 'Nexus Blitz',
  1400: 'Ultimate Spellbook',
};

export function getQueueName(queueId) {
  return QUEUE_NAMES[queueId] || `Mode ${queueId}`;
}
