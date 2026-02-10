import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import tftRoutes from './routes/tftRoutes.js';
import valorantRoutes from './routes/valorantRoutes.js';
import lorRoutes from './routes/lorRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.RIOT_API_KEY;

app.use(cors());
app.use(express.json());

// ── Region / Platform Mapping ──────────────────────────────────
const REGION_HOSTS = {
  americas: 'americas.api.riotgames.com',
  europe: 'europe.api.riotgames.com',
  asia: 'asia.api.riotgames.com',
};

const PLATFORM_HOSTS = {
  na1: 'na1.api.riotgames.com',
  euw1: 'euw1.api.riotgames.com',
  eune1: 'eun1.api.riotgames.com',
  kr: 'kr.api.riotgames.com',
  jp1: 'jp1.api.riotgames.com',
  br1: 'br1.api.riotgames.com',
  la1: 'la1.api.riotgames.com',
  la2: 'la2.api.riotgames.com',
  oc1: 'oc1.api.riotgames.com',
  tr1: 'tr1.api.riotgames.com',
  ru: 'ru.api.riotgames.com',
  ph2: 'ph2.api.riotgames.com',
  sg2: 'sg2.api.riotgames.com',
  th2: 'th2.api.riotgames.com',
  tw2: 'tw2.api.riotgames.com',
  vn2: 'vn2.api.riotgames.com',
};

// ── Riot API Proxy Helper with 429 Retry ───────────────────────
async function riotRequest(host, path, retries = 3) {
  const url = `https://${host}${path}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: { 'X-Riot-Token': API_KEY },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 429 && attempt < retries) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '2', 10);
          console.warn(`[429] Rate limited. Retrying in ${retryAfter}s... (attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        const err = new Error(error.response.data?.status?.message || `Riot API error ${status}`);
        err.status = status;
        throw err;
      }
      throw error;
    }
  }
}

// ── Health Check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    apiKeyConfigured: !!API_KEY && API_KEY !== 'RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  });
});

// ── Account-V1: PUUID → Riot ID ──────────────────────────────
app.get('/api/account/:region/by-puuid/:puuid', async (req, res) => {
  try {
    const { region, puuid } = req.params;
    const host = REGION_HOSTS[region.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid region' });

    const data = await riotRequest(host, `/riot/account/v1/accounts/by-puuid/${puuid}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Account-V1: Resolve Riot ID → PUUID ───────────────────────
app.get('/api/account/:region/:gameName/:tagLine', async (req, res) => {
  try {
    const { region, gameName, tagLine } = req.params;
    const host = REGION_HOSTS[region.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid region' });

    const data = await riotRequest(host, `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Summoner-V4: Get Summoner by PUUID ────────────────────────
app.get('/api/summoner/:platform/:puuid', async (req, res) => {
  try {
    const { platform, puuid } = req.params;
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/summoner/v4/summoners/by-puuid/${puuid}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── League-V4: Ranked Entries by PUUID ────────────────────────
app.get('/api/league/:platform/:puuid', async (req, res) => {
  try {
    const { platform, puuid } = req.params;
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/league/v4/entries/by-puuid/${puuid}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Match-V5: Match IDs by PUUID ──────────────────────────────
app.get('/api/matches/:region/:puuid', async (req, res) => {
  try {
    const { region, puuid } = req.params;
    const host = REGION_HOSTS[region.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid region' });

    const { start = 0, count = 20, queue, type } = req.query;
    let path = `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
    if (queue) path += `&queue=${queue}`;
    if (type) path += `&type=${type}`;

    const data = await riotRequest(host, path);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Match-V5: Match Detail ────────────────────────────────────
app.get('/api/match/:region/:matchId', async (req, res) => {
  try {
    const { region, matchId } = req.params;
    const host = REGION_HOSTS[region.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid region' });

    const data = await riotRequest(host, `/lol/match/v5/matches/${matchId}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Champion Mastery-V4: Top Mastery by PUUID ─────────────────
app.get('/api/mastery/:platform/:puuid', async (req, res) => {
  try {
    const { platform, puuid } = req.params;
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const count = req.query.count || 5;
    const data = await riotRequest(host, `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Spectator-V4: Active Game by PUUID ────────────────────────
app.get('/api/spectator/:platform/:puuid', async (req, res) => {
  try {
    const { platform, puuid } = req.params;
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/spectator/v4/active-games/by-summoner/${puuid}`);
    res.json(data);
  } catch (err) {
    if (err.status === 404) {
      return res.json(null); // Not in game
    }
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── League-V4: Challenger League ──────────────────────────────
app.get('/api/league-tier/:platform/challenger', async (req, res) => {
  try {
    const { platform } = req.params;
    const queue = req.query.queue || 'RANKED_SOLO_5x5';
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/league/v4/challengerleagues/by-queue/${queue}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── League-V4: Grandmaster League ─────────────────────────────
app.get('/api/league-tier/:platform/grandmaster', async (req, res) => {
  try {
    const { platform } = req.params;
    const queue = req.query.queue || 'RANKED_SOLO_5x5';
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/league/v4/grandmasterleagues/by-queue/${queue}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── League-V4: Master League ──────────────────────────────────
app.get('/api/league-tier/:platform/master', async (req, res) => {
  try {
    const { platform } = req.params;
    const queue = req.query.queue || 'RANKED_SOLO_5x5';
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/league/v4/masterleagues/by-queue/${queue}`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── LoL Status-V4: Platform Status ────────────────────────────
app.get('/api/lol-status/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/status/v4/platform-data`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Champion-V3: Free Rotation ────────────────────────────────
app.get('/api/champion-rotations/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const host = PLATFORM_HOSTS[platform.toLowerCase()];
    if (!host) return res.status(400).json({ error: 'Invalid platform' });

    const data = await riotRequest(host, `/lol/platform/v3/champion-rotations`);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});


// ── Mount Game-Specific Routes ────────────────────────────────
app.use('/api/tft', tftRoutes(riotRequest, PLATFORM_HOSTS, REGION_HOSTS));
app.use('/api/val', valorantRoutes(riotRequest, PLATFORM_HOSTS, REGION_HOSTS));
app.use('/api/lor', lorRoutes(riotRequest, PLATFORM_HOSTS, REGION_HOSTS));

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚡ Riot Stats Hub API proxy running on http://localhost:${PORT}`);
  console.log(`   API Key configured: ${!!API_KEY && API_KEY !== 'RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}`);
  console.log('');
});
