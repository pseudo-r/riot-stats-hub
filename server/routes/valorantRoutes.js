import express from 'express';
const router = express.Router();

// Valorant uses different platform shards
const VAL_PLATFORM_HOSTS = {
  na: 'na.api.riotgames.com',
  eu: 'eu.api.riotgames.com',
  ap: 'ap.api.riotgames.com',
  kr: 'kr.api.riotgames.com',
  br: 'br.api.riotgames.com',
  latam: 'latam.api.riotgames.com',
};

export default function valorantRoutes(riotRequest, _PLATFORM_HOSTS, REGION_HOSTS) {

  // ── VAL Content (agents, maps, game modes, etc.) ───────────────
  router.get('/content/:shard', async (req, res) => {
    try {
      const { shard } = req.params;
      const locale = req.query.locale || 'en-US';
      const host = VAL_PLATFORM_HOSTS[shard.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid shard' });

      const data = await riotRequest(host, `/val/content/v1/contents?locale=${locale}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── VAL Ranked Leaderboard ─────────────────────────────────────
  router.get('/ranked/:shard/:actId', async (req, res) => {
    try {
      const { shard, actId } = req.params;
      const size = req.query.size || 200;
      const startIndex = req.query.startIndex || 0;
      const host = VAL_PLATFORM_HOSTS[shard.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid shard' });

      const data = await riotRequest(host, `/val/ranked/v1/leaderboards/by-act/${actId}?size=${size}&startIndex=${startIndex}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── VAL Match by ID ────────────────────────────────────────────
  router.get('/match/:shard/:matchId', async (req, res) => {
    try {
      const { shard, matchId } = req.params;
      const host = VAL_PLATFORM_HOSTS[shard.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid shard' });

      const data = await riotRequest(host, `/val/match/v1/matches/${matchId}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── VAL Match History by PUUID ─────────────────────────────────
  router.get('/matchlist/:shard/:puuid', async (req, res) => {
    try {
      const { shard, puuid } = req.params;
      const host = VAL_PLATFORM_HOSTS[shard.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid shard' });

      const data = await riotRequest(host, `/val/match/v1/matchlists/by-puuid/${puuid}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── VAL Recent Matches by Queue ────────────────────────────────
  router.get('/recent/:shard/:queue', async (req, res) => {
    try {
      const { shard, queue } = req.params;
      const host = VAL_PLATFORM_HOSTS[shard.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid shard' });

      const data = await riotRequest(host, `/val/match/v1/recent-matches/by-queue/${queue}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── VAL Platform Status ────────────────────────────────────────
  router.get('/status/:shard', async (req, res) => {
    try {
      const { shard } = req.params;
      const host = VAL_PLATFORM_HOSTS[shard.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid shard' });

      const data = await riotRequest(host, `/val/status/v1/platform-data`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  return router;
}
