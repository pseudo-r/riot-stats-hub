/**
 * Data Dragon CDN URL builders.
 * Uses latest version by default, fetched once on first call.
 */

const DD_BASE = 'https://ddragon.leagueoflegends.com';
let _version = null;
let _championMap = null;

/** Fetch latest Data Dragon version */
export async function getLatestVersion() {
  if (_version) return _version;
  try {
    const res = await fetch(`${DD_BASE}/api/versions.json`);
    const versions = await res.json();
    _version = versions[0];
    return _version;
  } catch {
    _version = '14.10.1'; // fallback
    return _version;
  }
}

/** Fetch champion data and build championId → champion key map */
export async function getChampionMap() {
  if (_championMap) return _championMap;
  const version = await getLatestVersion();
  try {
    const res = await fetch(`${DD_BASE}/cdn/${version}/data/en_US/champion.json`);
    const json = await res.json();
    _championMap = {};
    for (const [key, champ] of Object.entries(json.data)) {
      _championMap[parseInt(champ.key, 10)] = {
        id: champ.id,
        name: champ.name,
        key: key,
      };
    }
    return _championMap;
  } catch {
    _championMap = {};
    return _championMap;
  }
}

/** Get champion name from championId */
export async function getChampionName(championId) {
  const map = await getChampionMap();
  return map[championId]?.name || `Champion ${championId}`;
}

/** Champion square icon URL */
export function championIconUrl(version, championKey) {
  return `${DD_BASE}/cdn/${version}/img/champion/${championKey}.png`;
}

/** Profile icon URL */
export function profileIconUrl(version, iconId) {
  return `${DD_BASE}/cdn/${version}/img/profileicon/${iconId}.png`;
}

/** Item icon URL */
export function itemIconUrl(version, itemId) {
  if (!itemId || itemId === 0) return null;
  return `${DD_BASE}/cdn/${version}/img/item/${itemId}.png`;
}

/** Summoner spell icon URL */
export function spellIconUrl(version, spellKey) {
  return `${DD_BASE}/cdn/${version}/img/spell/${spellKey}.png`;
}

/** Rank emblem (local assets or CDN) */
export function rankEmblemUrl(tier) {
  const t = tier?.toLowerCase();
  if (!t) return null;
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${t}.png`;
}



// Summoner spell ID → key mapping (common spells)
const SPELL_MAP = {
  1: 'SummonerBoost',       // Cleanse
  3: 'SummonerExhaust',
  4: 'SummonerFlash',
  6: 'SummonerHaste',       // Ghost
  7: 'SummonerHeal',
  11: 'SummonerSmite',
  12: 'SummonerTeleport',
  13: 'SummonerMana',       // Clarity
  14: 'SummonerDot',        // Ignite
  21: 'SummonerBarrier',
  30: 'SummonerPoroRecall', // To the King! (ARAM)
  31: 'SummonerPoroThrow',  // Poro Toss (ARAM)
  32: 'SummonerSnowball',   // Mark (ARAM)
  39: 'SummonerSnowURFSnowball_Mark', // Mark (URF)
  54: 'Placeholder',
  55: 'Placeholder',
};

export function getSpellKey(spellId) {
  return SPELL_MAP[spellId] || 'SummonerFlash';
}

export default {
  getLatestVersion,
  getChampionMap,
  getChampionName,
  championIconUrl,
  profileIconUrl,
  itemIconUrl,
  spellIconUrl,
  rankEmblemUrl,
  getSpellKey,
};
