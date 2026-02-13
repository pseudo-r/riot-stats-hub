import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/Landing';

// Mock useAuthStore
vi.mock('../store/useAuthStore', () => ({
  default: () => ({
    favorites: [
      { gameName: 'Faker', tagLine: 'KR1', platform: 'kr', region: 'asia' },
    ],
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Landing Page', () => {
  it('renders the title', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('RIOT STATS')).toBeInTheDocument();
    expect(screen.getByText('HUB')).toBeInTheDocument();
  });

  it('renders the subtitle description', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText(/Elite competitive analytics/i)).toBeInTheDocument();
  });

  it('renders the search input with placeholder', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    const input = screen.getByPlaceholderText('Enter Riot ID (Name#Tag)');
    expect(input).toBeInTheDocument();
  });

  it('renders all platform chips', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('NA')).toBeInTheDocument();
    expect(screen.getByText('EUW')).toBeInTheDocument();
    expect(screen.getByText('KR')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument();
    expect(screen.getByText('BR')).toBeInTheDocument();
    expect(screen.getByText('OCE')).toBeInTheDocument();
  });

  it('renders feature badges', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('Real-time Data')).toBeInTheDocument();
    expect(screen.getByText('Deep Analytics')).toBeInTheDocument();
    expect(screen.getByText('Live Games')).toBeInTheDocument();
    expect(screen.getByText('Leaderboards')).toBeInTheDocument();
  });

  it('renders "System Online" badge', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('System Online')).toBeInTheDocument();
  });

  it('renders favorites section when favorites exist', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('Faker#KR1')).toBeInTheDocument();
  });

  it('updates search input on user typing', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    const input = screen.getByPlaceholderText('Enter Riot ID (Name#Tag)');
    fireEvent.change(input, { target: { value: 'Doublelift#NA1' } });
    expect(input.value).toBe('Doublelift#NA1');
  });

  it('does NOT navigate when search lacks # separator', () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    const input = screen.getByPlaceholderText('Enter Riot ID (Name#Tag)');
    fireEvent.change(input, { target: { value: 'NoHashHere' } });
    fireEvent.submit(input.closest('form'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
