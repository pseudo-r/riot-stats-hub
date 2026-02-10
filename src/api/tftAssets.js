/**
 * TFT Assets API — Community Dragon + Data Dragon CDN
 *
 * Primary API:  tftApi.js   (Riot endpoints proxied via backend)
 * Assets API:   tftAssets.js (this file — direct CDN, cached)
 *
 * Sources:
 *   - ddragon.leagueoflegends.com  (champion icons, profile icons)
 *   - raw.communitydragon.org      (TFT-specific sets, items, traits, augments)
 */

const DD_BASE = 'https://ddragon.leagueoflegends.com';
const CD_BASE = 'https://raw.communitydragon.org/latest';
const CD_TFT  = `${CD_BASE}/cdragon/tft/en_us.json`;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/* ── Cache utility ──────────────────────────────────────── */
const _cache = {};

async function cachedFetch(key, url, transform) {
  const entry = _cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const data = transform ? transform(json) : json;
    _cache[key] = { data, ts: Date.now() };
    return data;
  } catch {
    return entry?.data || (transform ? transform({}) : {});
  }
}

/* ── Data Dragon Version ────────────────────────────────── */

export function fetchLatestVersion() {
  return cachedFetch('dd_version', `${DD_BASE}/api/versions.json`, versions =>
    versions?.[0] || '14.10.1'
  );
}

/* ── Full TFT Data (Community Dragon) ───────────────────── */

export function fetchTftData() {
  return cachedFetch('tft_data', CD_TFT, json => json);
}

/* ── Champions ──────────────────────────────────────────── */

export async function fetchChampions() {
  const data = await fetchTftData();
  const sets = data?.sets || {};
  const champions = [];
  for (const setKey of Object.keys(sets)) {
    const set = sets[setKey];
    for (const champ of set.champions || []) {
      champions.push({
        apiName: champ.apiName,
        name: champ.name,
        cost: champ.cost,
        icon: champ.icon ? cdAssetUrl(champ.icon) : null,
        traits: champ.traits || [],
        ability: champ.ability ? {
          name: champ.ability.name,
          desc: champ.ability.desc,
          icon: champ.ability.icon ? cdAssetUrl(champ.ability.icon) : null,
        } : null,
        stats: champ.stats || {},
        set: setKey,
      });
    }
  }
  return champions;
}

/* ── Traits ─────────────────────────────────────────────── */

export async function fetchTraits() {
  const data = await fetchTftData();
  const sets = data?.sets || {};
  const traits = [];
  for (const setKey of Object.keys(sets)) {
    const set = sets[setKey];
    for (const trait of set.traits || []) {
      traits.push({
        apiName: trait.apiName,
        name: trait.name,
        desc: trait.desc,
        icon: trait.icon ? cdAssetUrl(trait.icon) : null,
        effects: trait.effects || [],
        set: setKey,
      });
    }
  }
  return traits;
}

/* ── Items ──────────────────────────────────────────────── */

export async function fetchItems() {
  const data = await fetchTftData();
  return (data?.items || []).map(item => ({
    apiName: item.apiName,
    name: item.name,
    desc: item.desc,
    icon: item.icon ? cdAssetUrl(item.icon) : null,
    composition: item.composition || [],
    associatedTraits: item.associatedTraits || [],
    incompatibleTraits: item.incompatibleTraits || [],
    unique: item.unique || false,
  }));
}

/* ── Augments ───────────────────────────────────────────── */

export async function fetchAugments() {
  const data = await fetchTftData();
  return (data?.items || [])
    .filter(i => i.apiName?.startsWith('TFT') && i.apiName?.includes('Augment'))
    .map(aug => ({
      apiName: aug.apiName,
      name: aug.name,
      desc: aug.desc,
      icon: aug.icon ? cdAssetUrl(aug.icon) : null,
      associatedTraits: aug.associatedTraits || [],
      composition: aug.composition || [],
    }));
}

/* ── Set Data (metadata for each TFT set) ───────────────── */

export async function fetchSetData() {
  const data = await fetchTftData();
  const sets = data?.sets || {};
  return Object.entries(sets).map(([key, set]) => ({
    number: key,
    name: set.name || `Set ${key}`,
    mutator: set.mutator,
    championCount: (set.champions || []).length,
    traitCount: (set.traits || []).length,
  }));
}

/* ── Champion Map (Data Dragon — LoL champions shared with TFT) ── */

export async function fetchChampionMap() {
  const version = await fetchLatestVersion();
  return cachedFetch('dd_champions', `${DD_BASE}/cdn/${version}/data/en_US/champion.json`, json => {
    const map = {};
    for (const [key, champ] of Object.entries(json.data || {})) {
      map[parseInt(champ.key, 10)] = { id: champ.id, name: champ.name, key };
    }
    return map;
  });
}

/* ── URL Builders ───────────────────────────────────────── */

/** Convert Community Dragon asset path to full URL */
function cdAssetUrl(path) {
  if (!path) return null;
  // paths come as "ASSETS/..." — normalize to lowercase for the CDN
  const clean = path.toLowerCase().replace(/\.tex$/, '.png');
  return `${CD_BASE}/game/${clean}`;
}

/** Champion icon from Data Dragon (LoL icon, works for many TFT champs) */
export async function championIconUrl(championKey) {
  const version = await fetchLatestVersion();
  return `${DD_BASE}/cdn/${version}/img/champion/${championKey}.png`;
}

/** Profile icon from Data Dragon */
export async function profileIconUrl(iconId) {
  const version = await fetchLatestVersion();
  return `${DD_BASE}/cdn/${version}/img/profileicon/${iconId}.png`;
}

/** TFT rank crest from Community Dragon */
export function rankCrestUrl(tier) {
  const t = tier?.toLowerCase();
  if (!t) return null;
  return `${CD_BASE}/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${t}.png`;
}

/** TFT item icon (by numeric ID, via Community Dragon) */
export function itemIconByIdUrl(itemId) {
  return `${CD_BASE}/game/assets/maps/particles/tft/item_icons/standard/${String(itemId).padStart(2, '0')}_icon.png`;
}

/** TFT trait icon by trait name */
export function traitIconUrl(traitName) {
  const clean = traitName.toLowerCase().replace(/[^a-z]/g, '');
  return `${CD_BASE}/game/assets/ux/traiticons/trait_icon_${clean}.png`;
}

/* ── Cache Management ───────────────────────────────────── */

export function clearCache() {
  Object.keys(_cache).forEach(k => delete _cache[k]);
}

export function getCacheStats() {
  return Object.entries(_cache).map(([key, entry]) => ({
    key,
    age: Date.now() - entry.ts,
    itemCount: Array.isArray(entry.data) ? entry.data.length : 1,
  }));
}

export default {
  // Fetchers
  fetchLatestVersion,
  fetchTftData,
  fetchChampions,
  fetchTraits,
  fetchItems,
  fetchAugments,
  fetchSetData,
  fetchChampionMap,
  // URL Builders
  championIconUrl,
  profileIconUrl,
  rankCrestUrl,
  itemIconByIdUrl,
  traitIconUrl,
  cdAssetUrl,
  // Cache
  clearCache,
  getCacheStats,
};
