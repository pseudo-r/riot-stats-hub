<div align="center">

# 🎮 Riot Stats Hub

**A unified competitive analytics dashboard for the Riot Games ecosystem.**

Track player stats, explore game data, and climb leaderboards across League of Legends, Teamfight Tactics, Valorant, and Legends of Runeterra — all in one place.

[![CI](https://github.com/pseudo-r/riot-stats-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/pseudo-r/riot-stats-hub/actions)
![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Node 20](https://img.shields.io/badge/Node-20-339933?logo=node.js&logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Overview

Riot Stats Hub is an open-source web app that aggregates player statistics, game databases, and competitive rankings from multiple Riot titles into a single, cohesive interface. It uses a secure Express backend to proxy Riot API requests, keeping your API key safe.

### Supported Games

| Game | Key Features |
|------|-------------|
| **League of Legends** | Summoner lookup, champion database, ranked leaderboards, pro builds |
| **Teamfight Tactics** | Player profiles, 3,000+ items, 1,400+ augments, traits, meta comps |
| **Valorant** | Agent gallery, map explorer, weapon arsenal, rank tiers, cosmetics |
| **Legends of Runeterra** | 1,500+ card database with full-art images, player rankings |

---

## Tech Stack

| | Technology |
|-|-----------|
| **Frontend** | React 18 · React Router 6 · Zustand |
| **Backend** | Express 4 (API proxy with rate-limit retry) |
| **Build** | Vite 6 |
| **Testing** | Vitest · Playwright · React Testing Library |
| **CI/CD** | GitHub Actions · Docker |
| **Design** | Glassmorphism design system · Vanilla CSS |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Riot API Key](https://developer.riotgames.com/) (free developer key)

### Setup

```bash
# Clone & install
git clone https://github.com/pseudo-r/riot-stats-hub.git
cd riot-stats-hub
npm install && cd server && npm install && cd ..

# Configure API key
cp server/.env.example server/.env
# Edit server/.env → set RIOT_API_KEY=RGAPI-your-key-here
```

Then start both servers in separate terminals:

```bash
# Terminal 1 — Backend (port 3001)
cd server && npm run dev
```

```bash
# Terminal 2 — Frontend (port 5173)
npm run dev
```

### Docker

```bash
docker compose up --build    # App → localhost:8080
```

---

## Testing

| Suite | Framework | Tests | Command |
|-------|-----------|-------|---------|
| **Unit & API** | Vitest + RTL | 76 | `npm run test:ci` |
| **End-to-End** | Playwright | 12 | `npm run test:e2e` |

Unit tests cover API modules, Zustand stores, utility functions, and component rendering. E2E tests verify page loads, game navigation, mobile menu, and app availability against the Docker container.

---

## CI/CD Pipeline

Every push and PR to `main` triggers a three-stage pipeline:

```
Unit & API Tests  →  E2E Tests (Docker + Playwright)  →  Production Build
```

Each stage gates the next — if tests fail, the pipeline stops.

### Required: GitHub Secrets

The E2E stage builds a Docker container that needs your API key:

1. Go to **Settings → Secrets and variables → Actions**
2. Add a secret named `RIOT_API_KEY` with your key

> ⚠️ Development keys expire every 24 hours. [Apply for a production key](https://developer.riotgames.com/) for stable CI.

---

## Security

- API keys are **never exposed to the browser** — all Riot API calls are proxied through the Express backend
- `.env` files are gitignored by default
- Rate limiting with automatic 429 retry logic

---

## Data Sources

| Source | Purpose |
|--------|---------|
| [Riot Games API](https://developer.riotgames.com/) | Player data, match history, leaderboards |
| [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) | Champion data, card sets |
| [Community Dragon](https://communitydragon.org/) | TFT assets (champions, items, augments) |
| [valorant-api.com](https://valorant-api.com/) | Agents, maps, weapons, cosmetics |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<sub>Riot Stats Hub isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</sub>
