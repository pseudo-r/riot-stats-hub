import express from 'express';
const router = express.Router();

// LoR uses region-based routing
const LOR_REGION_HOSTS = {
  americas: 'americas.api.riotgames.com',
  europe: 'europe.api.riotgames.com',
  asia: 'asia.api.riotgames.com',
  sea: 'sea.api.riotgames.com',
};

export default function lorRoutes(riotRequest) {

  // ── LoR Ranked Leaderboard ─────────────────────────────────────
  router.get('/ranked/:region', async (req, res) => {
    try {
      const { region } = req.params;
      const host = LOR_REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/lor/ranked/v1/leaderboards`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── LoR Match IDs by PUUID ─────────────────────────────────────
  router.get('/matches/:region/:puuid', async (req, res) => {
    try {
      const { region, puuid } = req.params;
      const host = LOR_REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/lor/match/v1/matches/by-puuid/${puuid}/ids`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── LoR Match Detail ───────────────────────────────────────────
  router.get('/match/:region/:matchId', async (req, res) => {
    try {
      const { region, matchId } = req.params;
      const host = LOR_REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/lor/match/v1/matches/${matchId}`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── LoR Player Decks ───────────────────────────────────────────
  // NOTE: Requires OAuth2. Only works with authorized access tokens.
  router.get('/decks/:region', async (req, res) => {
    try {
      const { region } = req.params;
      const host = LOR_REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/lor/deck/v1/decks/me`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── LoR Player Inventory ───────────────────────────────────────
  // NOTE: Requires OAuth2. Only works with authorized access tokens.
  router.get('/inventory/:region', async (req, res) => {
    try {
      const { region } = req.params;
      const host = LOR_REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/lor/inventory/v1/cards/me`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // ── LoR Platform Status ────────────────────────────────────────
  router.get('/status/:region', async (req, res) => {
    try {
      const { region } = req.params;
      const host = LOR_REGION_HOSTS[region.toLowerCase()];
      if (!host) return res.status(400).json({ error: 'Invalid region' });

      const data = await riotRequest(host, `/lor/status/v1/platform-data`);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  return router;
}
