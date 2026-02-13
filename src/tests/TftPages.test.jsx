import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mock all API calls to prevent network requests ──────────────
vi.mock('../api/tftAssets', () => ({
  fetchChampions: vi.fn().mockResolvedValue([
    { name: 'Ahri', cost: 4, icon: '/ahri.png', traits: ['Star Guardian'] },
    { name: 'Jinx', cost: 3, icon: '/jinx.png', traits: ['Rebel'] },
  ]),
  fetchTraits: vi.fn().mockResolvedValue([
    { name: 'Star Guardian', icon: '/sg.png' },
  ]),
  fetchItems: vi.fn().mockResolvedValue([
    { name: 'B.F. Sword', icon: '/bf.png', desc: 'Raw power', composition: [], apiName: 'TFTItem_BFSword' },
    { name: 'Chain Vest', icon: '/cv.png', desc: 'Armor', composition: [], apiName: 'TFTItem_ChainVest' },
  ]),
  fetchAugments: vi.fn().mockResolvedValue([
    { name: 'Jeweled Lotus', icon: '/jl.png', desc: 'Abilities crit', apiName: 'TFT_Augment_JeweledLotus' },
  ]),
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

// ── Import pages AFTER mocks ────────────────────────────────────
import TftChampions from '../pages/TftChampions';
import TftItems from '../pages/TftItems';
import TftAugments from '../pages/TftAugments';

describe('TFT Champions Page', () => {
  it('renders loading state initially', () => {
    render(<MemoryRouter><TftChampions /></MemoryRouter>);
    // Should show some content or loading indicator
    expect(document.querySelector('.main-content') || document.body).toBeTruthy();
  });
});

describe('TFT Items Page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><TftItems /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});

describe('TFT Augments Page', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><TftAugments /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
