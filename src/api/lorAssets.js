/**
 * LoR Assets API — Data Dragon for Legends of Runeterra
 *
 * Primary API:  lorApi.js    (Riot endpoints proxied via backend)
 * Assets API:   lorAssets.js (this file — direct CDN, cached)
 *
 * Sources:
 *   - dd.b.pvp.net (LoR Data Dragon — card sets, core bundles)
 *   - Note: LoR has been sunset by Riot Games, data may be limited
 */

// Use Vite proxy to avoid CORS — /lor-data is proxied to https://dd.b.pvp.net
const LOR_DD = '/lor-data';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes (static data, changes rarely)

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
    return entry?.data || (transform ? transform([]) : []);
  }
}

/* ── Core Data (Globals / Keywords / Regions / Spell Speeds) */

export function fetchGlobals() {
  return cachedFetch('lor_globals', `${LOR_DD}/latest/core/en_us/data/globals-en_us.json`, json => ({
    vocabTerms: json?.vocabTerms || [],
    keywords: json?.keywords || [],
    regions: json?.regions || [],
    spellSpeeds: json?.spellSpeeds || [],
    rarities: json?.rarities || [],
    sets: json?.sets || [],
  }));
}

/* ── Card Regions ───────────────────────────────────────── */

export async function fetchRegions() {
  const globals = await fetchGlobals();
  return (globals.regions || []).map(r => ({
    abbreviation: r.abbreviation,
    name: r.name,
    nameRef: r.nameRef,
    icon: r.iconAbsolutePath,
  }));
}

/* ── Keywords ───────────────────────────────────────────── */

export async function fetchKeywords() {
  const globals = await fetchGlobals();
  return (globals.keywords || []).map(k => ({
    name: k.name,
    nameRef: k.nameRef,
    description: k.description,
  }));
}

/* ── Spell Speeds ───────────────────────────────────────── */

export async function fetchSpellSpeeds() {
  const globals = await fetchGlobals();
  return (globals.spellSpeeds || []).map(s => ({
    name: s.name,
    nameRef: s.nameRef,
  }));
}

/* ── Rarities ───────────────────────────────────────────── */

export async function fetchRarities() {
  const globals = await fetchGlobals();
  return (globals.rarities || []).map(r => ({
    name: r.name,
    nameRef: r.nameRef,
  }));
}

/* ── Card Sets (individual set data) ────────────────────── */

const KNOWN_SETS = [
  'set1', 'set2', 'set3', 'set4', 'set5',
  'set6', 'set6cde', 'set7', 'set7b', 'set8',
];

export async function fetchCardSet(setName) {
  const key = `lor_set_${setName}`;
  return cachedFetch(key, `${LOR_DD}/latest/${setName}/en_us/data/${setName}-en_us.json`, cards =>
    (Array.isArray(cards) ? cards : []).map(c => ({
      cardCode: c.cardCode,
      name: c.name,
      type: c.type,
      set: c.set,
      rarity: c.rarity || c.rarityRef,
      cost: c.cost,
      attack: c.attack,
      health: c.health,
      description: c.descriptionRaw || c.description,
      levelupDescription: c.levelupDescriptionRaw || c.levelupDescription,
      flavorText: c.flavorText,
      artistName: c.artistName,
      subtypes: c.subtypes || [],
      supertype: c.supertype,
      keywords: c.keywords || c.keywordRefs || [],
      regions: c.regions || c.regionRefs || [],
      spellSpeed: c.spellSpeed || c.spellSpeedRef,
      collectible: c.collectible,
      associatedCardRefs: c.associatedCardRefs || [],
      assets: (c.assets || []).map(a => ({
        gameAbsolutePath: a.gameAbsolutePath,
        fullAbsolutePath: a.fullAbsolutePath,
      })),
    }))
  );
}

/** Fetch all known card sets */
export async function fetchAllCards() {
  const results = await Promise.all(
    KNOWN_SETS.map(s => fetchCardSet(s).catch(() => []))
  );
  return results.flat();
}

/* ── URL Builders ───────────────────────────────────────── */

/** Card art (game-resolution) URL by card code */
export function cardGameArtUrl(setNumber, cardCode) {
  return `${LOR_DD}/latest/set${setNumber}/en_us/img/cards/${cardCode}.png`;
}

/** Card art (full-resolution) URL by card code */
export function cardFullArtUrl(setNumber, cardCode) {
  return `${LOR_DD}/latest/set${setNumber}/en_us/img/cards/${cardCode}-full.png`;
}

/** Region icon URL */
export function regionIconUrl(regionRef) {
  return `${LOR_DD}/latest/core/en_us/img/regions/icon-${regionRef.toLowerCase()}.png`;
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
  fetchGlobals,
  fetchRegions,
  fetchKeywords,
  fetchSpellSpeeds,
  fetchRarities,
  fetchCardSet,
  fetchAllCards,
  // URL builders
  cardGameArtUrl,
  cardFullArtUrl,
  regionIconUrl,
  // Cache
  clearCache,
  getCacheStats,
};
