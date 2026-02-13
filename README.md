# 🎮 Riot Stats Hub

A multi-game stats tracker and data explorer for **League of Legends**, **Teamfight Tactics**, **Valorant**, and **Legends of Runeterra** — powered by the Riot Games API ecosystem.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)
![CI](https://github.com/pseudo-r/riot-stats-hub/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### League of Legends
- **Summoner Lookup** — Search any player by Riot ID, view rank, match history & stats
- **Champion Database** — Browse all champions with icons and details
- **Leaderboard** — Challenger / Grandmaster / Master rankings across all regions
- **Pro Builds** — See what the pros are building

### Teamfight Tactics
- **Player Profiles** — TFT-specific rank and match data
- **Champion Browser** — All TFT champions with cost, traits, abilities & stats
- **Trait Explorer** — Every trait with scaling breakpoints
- **Item Database** — 3,000+ items with recipes and composition breakdowns
- **Augment Pool** — 1,400+ augments searchable by name
- **Meta Comps** — Popular team compositions
- **Leaderboard** — Regional TFT rankings

### Valorant
- **Agent Gallery** — All agents with abilities and role info
- **Map Explorer** — Interactive map details
- **Arsenal** — Full weapon database with damage stats and spray patterns
- **Rank Tiers** — Competitive rank breakdown
- **Game Modes** — Every mode explained
- **Sprays, Player Cards & Buddies** — Cosmetic collections
- **Leaderboard** — Regional competitive rankings

### Legends of Runeterra
- **Card Database** — 1,500+ collectible cards across all sets with full-art images
- **Leaderboard** — LoR player rankings

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, React Router 6, Zustand |
| **Build Tool** | Vite 6 |
| **Backend** | Express 4 (API proxy) |
| **Testing** | Vitest 4, React Testing Library, jsdom |
| **CI/CD** | GitHub Actions (Node 18 + 20 matrix) |
| **APIs** | Riot Games API, Community Dragon, Data Dragon, valorant-api.com |
| **Styling** | Vanilla CSS with custom Glassmorphism design system |

---

## 📁 Project Structure

```
riot-stats-hub/
├── .github/workflows/ci.yml   # CI/CD pipeline (test → build)
├── index.html                  # Entry HTML
├── vite.config.js              # Vite config (dev proxy + test config)
├── package.json                # Dependencies & scripts
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Route definitions
│   ├── index.css               # Global styles & design tokens
│   ├── api/                    # API modules
│   │   ├── riotApi.js          # LoL Riot API calls
│   │   ├── dataDragon.js       # LoL Data Dragon CDN
│   │   ├── tftApi.js           # TFT Riot API calls
│   │   ├── tftAssets.js        # TFT Community Dragon CDN
│   │   ├── valorantApi.js      # Valorant Riot API calls
│   │   ├── valorantAssets.js   # valorant-api.com CDN
│   │   ├── lorApi.js           # LoR Riot API calls
│   │   └── lorAssets.js        # LoR Data Dragon CDN
│   ├── components/             # Shared UI components (Header, etc.)
│   ├── pages/                  # Route page components (29 pages)
│   ├── store/                  # Zustand state stores
│   ├── tests/                  # Test suite (78 tests)
│   │   ├── setup.js            # Test environment setup
│   │   ├── stats.test.js       # Stats utility unit tests
│   │   ├── riotApi.test.js     # API module tests (mocked)
│   │   ├── useAuthStore.test.js    # Auth store tests
│   │   ├── usePlayerStore.test.js  # Player store tests
│   │   ├── Landing.test.jsx    # Landing page component tests
│   │   ├── TftPages.test.jsx   # TFT page render tests
│   │   ├── ValorantPages.test.jsx  # Valorant page render tests
│   │   ├── Header.test.jsx     # Header component tests
│   │   └── App.test.jsx        # Full app smoke test
│   └── utils/                  # Helper utilities (stats, formatting)
└── server/
    ├── index.js                # Express server (Riot API proxy)
    ├── routes/                 # API route handlers
    ├── package.json            # Server dependencies
    └── .env.example            # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Riot Games API Key** — get one at [developer.riotgames.com](https://developer.riotgames.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/pseudo-r/riot-stats-hub.git
cd riot-stats-hub
```

### 2. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3. Configure Environment

```bash
# Copy the example and fill in your API key
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
RIOT_API_KEY=RGAPI-your-key-here
PORT=3001
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (API proxy on port 3001)
cd server
npm run dev

# Terminal 2 — Frontend (Vite dev server on port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

Output is in the `dist/` directory.

---

## 🧪 Testing

The project uses **Vitest** with **React Testing Library** for a comprehensive test suite.

### Running Tests

```bash
# Interactive watch mode (development)
npm test

# Single run (CI mode)
npm run test:ci

# With coverage report
npm run test:coverage
```

### Test Coverage

| Category | File | Tests |
|----------|------|-------|
| **Utilities** | `stats.test.js` | 20 — Win rate, KDA, CS/min, kill participation, formatting |
| **API Layer** | `riotApi.test.js` | 12 — All endpoints with mocked Axios |
| **State (Auth)** | `useAuthStore.test.js` | 10 — Login/logout, favorites, preferences |
| **State (Player)** | `usePlayerStore.test.js` | 8 — Region mapping, state reset |
| **Landing Page** | `Landing.test.jsx` | 9 — Rendering, search validation, interactions |
| **TFT Pages** | `TftPages.test.jsx` | 3 — Champions, Items, Augments |
| **Valorant Pages** | `ValorantPages.test.jsx` | 3 — Agents, Maps, Weapons |
| **Components** | `Header.test.jsx`, `App.test.jsx` | 2 — Smoke tests |
| | **Total** | **78 tests** |

---

## 🔄 CI/CD

The project uses **GitHub Actions** for continuous integration.

### Pipeline

```
Push / PR to main
       │
       ▼
┌─────────────┐
│   Test Job   │  ← Unit & API tests (Node 18 + 20)
│  npm run     │
│  test:ci     │
└──────┬──────┘
       │ ✅ All 78 tests pass
       ▼
┌─────────────┐
│   E2E Job    │  ← Docker + Playwright (12 smoke tests)
│  npm run     │
│  test:e2e    │
└──────┬──────┘
       │ ✅ All E2E tests pass
       ▼
┌─────────────┐
│  Build Job   │  ← Production bundle (Node 20)
│  npm run     │
│  build       │
└──────┬──────┘
       │
       ▼
  Upload dist/
  artifact (7 days)
```

- **Triggers:** Every push and pull request to `main` / `master`
- **Matrix:** Unit tests run on Node.js 18.x and 20.x
- **Gate:** Each job only runs if the previous one passes
- **Artifacts:** Production bundle uploaded for 7 days; Playwright report uploaded on failure

### GitHub Secrets Setup

The E2E job builds the Docker container, which requires your Riot API key. You **must** add it as a GitHub Secret:

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `RIOT_API_KEY`
4. Value: Your Riot API key from [developer.riotgames.com](https://developer.riotgames.com/)
5. Click **Add secret**

> ⚠️ **Note:** Development API keys expire every 24 hours. Apply for a [Production API Key](https://developer.riotgames.com/) to avoid CI failures.

---

## 🔑 API Keys & Security

- **Never commit `.env` files** — they are gitignored by default
- The backend server proxies all Riot API requests so your key is never exposed to the browser
- Riot development keys expire every 24 hours; get a production key for persistent use
- For CI/CD, add your key as a `RIOT_API_KEY` GitHub Secret (see [setup above](#github-secrets-setup))

---

## 📡 Data Sources

| Source | Used For |
|--------|----------|
| [Riot Games API](https://developer.riotgames.com/) | Summoner data, match history, leaderboards |
| [Community Dragon](https://communitydragon.org/) | TFT champion/item/augment data & icons |
| [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) | LoL champion data, LoR card sets |
| [valorant-api.com](https://valorant-api.com/) | Valorant agents, maps, weapons, cosmetics |

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

*Riot Stats Hub isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.*
