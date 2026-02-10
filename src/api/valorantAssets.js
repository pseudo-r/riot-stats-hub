/**
 * Valorant Assets API — valorant-api.com (community CDN)
 *
 * Primary API:  valorantApi.js  (Riot endpoints proxied via backend)
 * Assets API:   valorantAssets.js  (this file — direct CDN, cached)
 *
 * All endpoints from https://valorant-api.com documentation.
 * Every fetch is cached in-memory with a configurable TTL.
 */

const BASE = 'https://valorant-api.com/v1';
const MEDIA = 'https://media.valorant-api.com';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/* ── Cache utility ──────────────────────────────────────── */
const _cache = {};

async function cachedFetch(key, url, transform) {
  const entry = _cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const data = transform ? transform(json.data || []) : json.data || [];
    _cache[key] = { data, ts: Date.now() };
    return data;
  } catch {
    return entry?.data || [];
  }
}

/* ── Agents ─────────────────────────────────────────────── */

export function fetchAgents() {
  return cachedFetch('agents', `${BASE}/agents?isPlayableCharacter=true`, list =>
    list.map(a => ({
      uuid: a.uuid,
      name: a.displayName,
      description: a.description,
      developerName: a.developerName,
      role: a.role?.displayName || 'Unknown',
      roleIcon: a.role?.displayIcon || null,
      icon: a.displayIcon,
      portrait: a.fullPortrait,
      fullPortraitV2: a.fullPortraitV2,
      killfeedPortrait: a.killfeedPortrait,
      bustPortrait: a.bustPortrait,
      background: a.background,
      isFullPortraitRightFacing: a.isFullPortraitRightFacing,
      assetPath: a.assetPath,
      gradientColors: a.backgroundGradientColors || [],
      abilities: (a.abilities || []).map(ab => ({
        slot: ab.slot,
        name: ab.displayName,
        description: ab.description,
        icon: ab.displayIcon,
      })),
      voiceLine: a.voiceLine,
    }))
  );
}

/* ── Maps ───────────────────────────────────────────────── */

export function fetchMaps() {
  return cachedFetch('maps', `${BASE}/maps`, list =>
    list.filter(m => m.displayName && m.displayName !== 'Null UI Data')
      .map(m => ({
        uuid: m.uuid,
        name: m.displayName,
        narrativeDescription: m.narrativeDescription,
        tacticalDescription: m.tacticalDescription,
        coordinates: m.coordinates,
        splash: m.splash,
        listIcon: m.listViewIcon,
        minimap: m.displayIcon,
        premierBackgroundImage: m.premierBackgroundImage,
        assetPath: m.assetPath,
        mapUrl: m.mapUrl,
        xMultiplier: m.xMultiplier,
        yMultiplier: m.yMultiplier,
        xScalarToAdd: m.xScalarToAdd,
        yScalarToAdd: m.yScalarToAdd,
        callouts: m.callouts || [],
      }))
  );
}

/* ── Weapons ────────────────────────────────────────────── */

export function fetchWeapons() {
  return cachedFetch('weapons', `${BASE}/weapons`, list =>
    list.map(w => ({
      uuid: w.uuid,
      name: w.displayName,
      category: w.category,
      defaultSkinUuid: w.defaultSkinUuid,
      icon: w.displayIcon,
      killStreamIcon: w.killStreamIcon,
      shopData: w.shopData,
      stats: w.weaponStats,
      skins: (w.skins || []).map(s => ({
        uuid: s.uuid,
        name: s.displayName,
        icon: s.displayIcon,
        wallpaper: s.wallpaper,
        themeUuid: s.themeUuid,
        contentTierUuid: s.contentTierUuid,
        chromas: s.chromas || [],
        levels: s.levels || [],
      })),
    }))
  );
}

/* ── Buddies ────────────────────────────────────────────── */

export function fetchBuddies() {
  return cachedFetch('buddies', `${BASE}/buddies`, list =>
    list.map(b => ({
      uuid: b.uuid,
      name: b.displayName,
      icon: b.displayIcon,
      isHiddenIfNotOwned: b.isHiddenIfNotOwned,
      themeUuid: b.themeUuid,
      assetPath: b.assetPath,
      levels: b.levels || [],
    }))
  );
}

/* ── Sprays ─────────────────────────────────────────────── */

export function fetchSprays() {
  return cachedFetch('sprays', `${BASE}/sprays`, list =>
    list.map(s => ({
      uuid: s.uuid,
      name: s.displayName,
      icon: s.displayIcon,
      fullIcon: s.fullTransparentIcon,
      animationPng: s.animationPng,
      animationGif: s.animationGif,
      category: s.category,
      themeUuid: s.themeUuid,
      isNullSpray: s.isNullSpray,
      assetPath: s.assetPath,
      levels: s.levels || [],
    }))
  );
}

/* ── Player Cards ───────────────────────────────────────── */

export function fetchPlayerCards() {
  return cachedFetch('playercards', `${BASE}/playercards`, list =>
    list.map(c => ({
      uuid: c.uuid,
      name: c.displayName,
      icon: c.displayIcon,
      smallArt: c.smallArt,
      wideArt: c.wideArt,
      largeArt: c.largeArt,
      isHiddenIfNotOwned: c.isHiddenIfNotOwned,
      themeUuid: c.themeUuid,
      assetPath: c.assetPath,
    }))
  );
}

/* ── Player Titles ──────────────────────────────────────── */

export function fetchPlayerTitles() {
  return cachedFetch('playertitles', `${BASE}/playertitles`, list =>
    list.map(t => ({
      uuid: t.uuid,
      name: t.displayName,
      titleText: t.titleText,
      isHiddenIfNotOwned: t.isHiddenIfNotOwned,
      assetPath: t.assetPath,
    }))
  );
}

/* ── Competitive Tiers ──────────────────────────────────── */

export function fetchCompetitiveTiers() {
  return cachedFetch('competitivetiers', `${BASE}/competitivetiers`, list =>
    list.map(season => ({
      uuid: season.uuid,
      assetObjectName: season.assetObjectName,
      tiers: (season.tiers || []).map(t => ({
        tier: t.tier,
        name: t.tierName,
        division: t.divisionName,
        color: t.color,
        backgroundColor: t.backgroundColor,
        smallIcon: t.smallIcon,
        largeIcon: t.largeIcon,
        rankTriangleDownIcon: t.rankTriangleDownIcon,
        rankTriangleUpIcon: t.rankTriangleUpIcon,
      })),
    }))
  );
}

/* ── Game Modes ─────────────────────────────────────────── */

export function fetchGameModes() {
  return cachedFetch('gamemodes', `${BASE}/gamemodes`, list =>
    list.map(g => ({
      uuid: g.uuid,
      name: g.displayName,
      icon: g.displayIcon,
      duration: g.duration,
      economyType: g.economyType,
      allowsMatchTimeouts: g.allowsMatchTimeouts,
      isTeamVoiceAllowed: g.isTeamVoiceAllowed,
      isMinimapHidden: g.isMinimapHidden,
      orbCount: g.orbCount,
      roundsPerHalf: g.roundsPerHalf,
      assetPath: g.assetPath,
      gameFeatureOverrides: g.gameFeatureOverrides || [],
      gameRuleBoolOverrides: g.gameRuleBoolOverrides || [],
    }))
  );
}

/* ── Game Mode Equippables ──────────────────────────────── */

export function fetchGameModeEquippables() {
  return cachedFetch('gamemodeequippables', `${BASE}/gamemodes/equippables`, list =>
    list.map(e => ({
      uuid: e.uuid,
      name: e.displayName,
      category: e.category,
      icon: e.displayIcon,
      killStreamIcon: e.killStreamIcon,
      assetPath: e.assetPath,
    }))
  );
}

/* ── Seasons ────────────────────────────────────────────── */

export function fetchSeasons() {
  return cachedFetch('seasons', `${BASE}/seasons`, list =>
    list.map(s => ({
      uuid: s.uuid,
      name: s.displayName,
      type: s.type,
      startTime: s.startTime,
      endTime: s.endTime,
      parentUuid: s.parentUuid,
      assetPath: s.assetPath,
    }))
  );
}

/* ── Competitive Seasons ────────────────────────────────── */

export function fetchCompetitiveSeasons() {
  return cachedFetch('compseasons', `${BASE}/seasons/competitive`, list =>
    list.map(s => ({
      uuid: s.uuid,
      startTime: s.startTime,
      endTime: s.endTime,
      seasonUuid: s.seasonUuid,
      competitiveTiersUuid: s.competitiveTiersUuid,
      borders: s.borders || [],
      assetPath: s.assetPath,
    }))
  );
}

/* ── Events ─────────────────────────────────────────────── */

export function fetchEvents() {
  return cachedFetch('events', `${BASE}/events`, list =>
    list.map(e => ({
      uuid: e.uuid,
      name: e.displayName,
      shortName: e.shortDisplayName,
      startTime: e.startTime,
      endTime: e.endTime,
      assetPath: e.assetPath,
    }))
  );
}

/* ── Currencies ─────────────────────────────────────────── */

export function fetchCurrencies() {
  return cachedFetch('currencies', `${BASE}/currencies`, list =>
    list.map(c => ({
      uuid: c.uuid,
      name: c.displayName,
      namesingular: c.displayNameSingular,
      icon: c.displayIcon,
      largeIcon: c.largeIcon,
      assetPath: c.assetPath,
    }))
  );
}

/* ── Contracts ──────────────────────────────────────────── */

export function fetchContracts() {
  return cachedFetch('contracts', `${BASE}/contracts`, list =>
    list.map(c => ({
      uuid: c.uuid,
      name: c.displayName,
      icon: c.displayIcon,
      shipIt: c.shipIt,
      freeRewardScheduleUuid: c.freeRewardScheduleUuid,
      content: c.content,
      assetPath: c.assetPath,
    }))
  );
}

/* ── Gear ───────────────────────────────────────────────── */

export function fetchGear() {
  return cachedFetch('gear', `${BASE}/gear`, list =>
    list.map(g => ({
      uuid: g.uuid,
      name: g.displayName,
      description: g.description,
      icon: g.displayIcon,
      shopData: g.shopData,
      assetPath: g.assetPath,
    }))
  );
}

/* ── Level Borders ──────────────────────────────────────── */

export function fetchLevelBorders() {
  return cachedFetch('levelborders', `${BASE}/levelborders`, list =>
    list.map(l => ({
      uuid: l.uuid,
      startingLevel: l.startingLevel,
      icon: l.levelNumberAppearance,
      smallIcon: l.smallPlayerCardAppearance,
      assetPath: l.assetPath,
    }))
  );
}

/* ── Content Tiers ──────────────────────────────────────── */

export function fetchContentTiers() {
  return cachedFetch('contenttiers', `${BASE}/contenttiers`, list =>
    list.map(t => ({
      uuid: t.uuid,
      name: t.devName,
      rank: t.rank,
      juiceValue: t.juiceValue,
      juiceCost: t.juiceCost,
      color: t.highlightColor,
      icon: t.displayIcon,
      assetPath: t.assetPath,
    }))
  );
}

/* ── Themes ─────────────────────────────────────────────── */

export function fetchThemes() {
  return cachedFetch('themes', `${BASE}/themes`, list =>
    list.map(t => ({
      uuid: t.uuid,
      name: t.displayName,
      icon: t.displayIcon,
      storeFeaturedImage: t.storeFeaturedImage,
      assetPath: t.assetPath,
    }))
  );
}

/* ── Ceremonies ─────────────────────────────────────────── */

export function fetchCeremonies() {
  return cachedFetch('ceremonies', `${BASE}/ceremonies`, list =>
    list.map(c => ({
      uuid: c.uuid,
      name: c.displayName,
      assetPath: c.assetPath,
    }))
  );
}

/* ── Direct URL builders ────────────────────────────────── */

export function agentIconUrl(uuid)     { return `${MEDIA}/agents/${uuid}/displayicon.png`; }
export function agentPortraitUrl(uuid) { return `${MEDIA}/agents/${uuid}/fullportrait.png`; }
export function mapSplashUrl(uuid)     { return `${MEDIA}/maps/${uuid}/splash.png`; }
export function mapListIconUrl(uuid)   { return `${MEDIA}/maps/${uuid}/listviewicon.png`; }
export function weaponIconUrl(uuid)    { return `${MEDIA}/weapons/${uuid}/displayicon.png`; }
export function sprayIconUrl(uuid)     { return `${MEDIA}/sprays/${uuid}/displayicon.png`; }
export function playerCardUrl(uuid)    { return `${MEDIA}/playercards/${uuid}/displayicon.png`; }

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

/* ── Backward-compatibility aliases ─────────────────────── */
export const fetchValAgents = fetchAgents;
export const fetchValMaps = fetchMaps;

export default {
  // Fetchers
  fetchAgents,
  fetchMaps,
  fetchWeapons,
  fetchBuddies,
  fetchSprays,
  fetchPlayerCards,
  fetchPlayerTitles,
  fetchCompetitiveTiers,
  fetchGameModes,
  fetchGameModeEquippables,
  fetchSeasons,
  fetchCompetitiveSeasons,
  fetchEvents,
  fetchCurrencies,
  fetchContracts,
  fetchGear,
  fetchLevelBorders,
  fetchContentTiers,
  fetchThemes,
  fetchCeremonies,
  // URL builders
  agentIconUrl,
  agentPortraitUrl,
  mapSplashUrl,
  mapListIconUrl,
  weaponIconUrl,
  sprayIconUrl,
  playerCardUrl,
  // Cache
  clearCache,
  getCacheStats,
};
