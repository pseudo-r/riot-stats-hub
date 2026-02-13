import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mock Valorant API calls ─────────────────────────────────────
vi.mock('../api/valorantApi', () => ({
  fetchAgents: vi.fn().mockResolvedValue([
    { uuid: '1', displayName: 'Jett', displayIcon: '/jett.png', role: { displayName: 'Duelist' }, abilities: [] },
    { uuid: '2', displayName: 'Sage', displayIcon: '/sage.png', role: { displayName: 'Sentinel' }, abilities: [] },
  ]),
  fetchMaps: vi.fn().mockResolvedValue([
    { uuid: '1', displayName: 'Bind', splash: '/bind.png', coordinates: '34°,36°' },
    { uuid: '2', displayName: 'Ascent', splash: '/ascent.png', coordinates: '45°,12°' },
  ]),
  fetchWeapons: vi.fn().mockResolvedValue([
    { uuid: '1', displayName: 'Vandal', displayIcon: '/vandal.png', shopData: { cost: 2900 } },
    { uuid: '2', displayName: 'Phantom', displayIcon: '/phantom.png', shopData: { cost: 2900 } },
  ]),
  fetchRanks: vi.fn().mockResolvedValue([]),
  fetchGameModes: vi.fn().mockResolvedValue([]),
  fetchSprays: vi.fn().mockResolvedValue([]),
  fetchPlayerCards: vi.fn().mockResolvedValue([]),
  fetchBuddies: vi.fn().mockResolvedValue([]),
}));

vi.mock('../store/useAuthStore', () => ({
  default: () => ({ favorites: [] }),
}));

vi.mock('../store/usePlayerStore', () => ({
  default: () => ({
    platform: 'na1',
    setPlatform: () => {},
  }),
}));

import ValorantAgents from '../pages/ValorantAgents';
import ValorantMaps from '../pages/ValorantMaps';
import ValorantWeapons from '../pages/ValorantWeapons';

describe('Valorant Agents Page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ValorantAgents /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});

describe('Valorant Maps Page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ValorantMaps /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});

describe('Valorant Weapons Page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><ValorantWeapons /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
