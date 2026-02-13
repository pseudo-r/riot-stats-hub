
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

// Mock stores to isolate component
vi.mock('../store/usePlayerStore', () => ({
  default: () => ({
    platform: 'na1',
    setPlatform: () => {},
  }),
}));

vi.mock('../store/useAuthStore', () => ({
  default: () => ({
    isLoggedIn: false,
    user: null,
    logout: () => {},
  }),
}));

describe('Header', () => {
  it('renders logo text', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText(/RIOT STATS HUB/i)).toBeInTheDocument();
  });
});
