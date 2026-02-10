import express from 'express';
const router = express.Router();

export default function tftRoutes(riotRequest, PLATFORM_HOSTS, REGION_HOSTS) {

  // ── TFT Summoner by PUUID ──────────────────────────────────────
  router.get('/summoner/:platform/:puuid', async (req, res) => {
    try {
      const { platform, puuid } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/summoner/v1/summoners/by-puuid/${puuid}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT League Entries by PUUID ────────────────────────────────
  router.get('/league/:platform/:puuid', async (req, res) => {
    try {
      const { platform, puuid } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/entries/by-puuid/${puuid}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT League Entries by Tier & Division (paginated) ──────────
  router.get('/league-entries/:platform/:tier/:division', async (req, res) => {
    try {
      const { platform, tier, division } = req.params;
      const page = req.query.page || 1;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/entries/${tier}/${division}?page=${page}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT League by League ID ────────────────────────────────────
  router.get('/league-by-id/:platform/:leagueId', async (req, res) => {
    try {
      const { platform, leagueId } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/leagues/${leagueId}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Challenger League ──────────────────────────────────────
  router.get('/league-tier/:platform/challenger', async (req, res) => {
    try {
      const { platform } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/challenger`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Grandmaster League ─────────────────────────────────────
  router.get('/league-tier/:platform/grandmaster', async (req, res) => {
    try {
      const { platform } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/grandmaster`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Master League ──────────────────────────────────────────
  router.get('/league-tier/:platform/master', async (req, res) => {
    try {
      const { platform } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/master`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Top Rated Ladder ───────────────────────────────────────
  router.get('/rated/:platform/:queue', async (req, res) => {
    try {
      const { platform, queue } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/league/v1/rated-ladders/${queue}/top`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Platform Status ────────────────────────────────────────
  router.get('/status/:platform', async (req, res) => {
    try {
      const { platform } = req.params;
      const host = PLATFORM_HOSTS[platform.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid platform' });

      const data = await riotRequest(host, `/tft/status/v1/platform-data`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Match IDs ──────────────────────────────────────────────
  router.get('/matches/:region/:puuid', async (req, res) => {
    try {
      const { region, puuid } = req.params;
      const host = REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const start = req.query.start || 0;
      const count = req.query.count || 20;
      const data = await riotRequest(host, `/tft/match/v1/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── TFT Match Detail ───────────────────────────────────────────
  router.get('/match/:region/:matchId', async (req, res) => {
    try {
      const { region, matchId } = req.params;
      const host = REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/tft/match/v1/matches/${matchId}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  return router;
}
