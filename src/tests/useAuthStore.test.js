import { describe, it, expect, beforeEach } from 'vitest';
import useAuthStore from '../store/useAuthStore';

// Reset store state before each test
beforeEach(() => {
  const store = useAuthStore.getState();
  useAuthStore.setState({
    isLoggedIn: false,
    user: null,
    favorites: [],
    preferences: {
      defaultPlatform: 'na1',
      defaultRegion: 'americas',
      matchViewMode: 'card',
    },
  });
});

// ══════════════════════════════════════════════════════════════════
// Authentication
// ══════════════════════════════════════════════════════════════════
describe('useAuthStore – Authentication', () => {
  it('starts logged out', () => {
    const { isLoggedIn, user } = useAuthStore.getState();
    expect(isLoggedIn).toBe(false);
    expect(user).toBeNull();
  });

  it('logs in a user', () => {
    useAuthStore.getState().login('Faker', 'faker@t1.gg');
    const { isLoggedIn, user } = useAuthStore.getState();
    expect(isLoggedIn).toBe(true);
    expect(user.username).toBe('Faker');
    expect(user.email).toBe('faker@t1.gg');
  });

  it('logs out a user', () => {
    useAuthStore.getState().login('Faker', 'faker@t1.gg');
    useAuthStore.getState().logout();
    const { isLoggedIn, user } = useAuthStore.getState();
    expect(isLoggedIn).toBe(false);
    expect(user).toBeNull();
  });
});

// ══════════════════════════════════════════════════════════════════
// Favorites
// ══════════════════════════════════════════════════════════════════
describe('useAuthStore – Favorites', () => {
  const player1 = { gameName: 'Faker', tagLine: 'KR1', platform: 'kr', region: 'asia' };
  const player2 = { gameName: 'Doublelift', tagLine: 'NA1', platform: 'na1', region: 'americas' };

  it('starts with empty favorites', () => {
    expect(useAuthStore.getState().favorites).toHaveLength(0);
  });

  it('adds a favorite player', () => {
    useAuthStore.getState().addFavorite(player1);
    const { favorites } = useAuthStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].gameName).toBe('Faker');
  });

  it('prevents duplicate favorites', () => {
    useAuthStore.getState().addFavorite(player1);
    useAuthStore.getState().addFavorite(player1); // duplicate
    expect(useAuthStore.getState().favorites).toHaveLength(1);
  });

  it('adds multiple different players', () => {
    useAuthStore.getState().addFavorite(player1);
    useAuthStore.getState().addFavorite(player2);
    expect(useAuthStore.getState().favorites).toHaveLength(2);
  });

  it('removes a favorite player', () => {
    useAuthStore.getState().addFavorite(player1);
    useAuthStore.getState().addFavorite(player2);
    useAuthStore.getState().removeFavorite('Faker', 'KR1');
    const { favorites } = useAuthStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].gameName).toBe('Doublelift');
  });
});

// ══════════════════════════════════════════════════════════════════
// Preferences
// ══════════════════════════════════════════════════════════════════
describe('useAuthStore – Preferences', () => {
  it('has default preferences', () => {
    const { preferences } = useAuthStore.getState();
    expect(preferences.defaultPlatform).toBe('na1');
    expect(preferences.defaultRegion).toBe('americas');
    expect(preferences.matchViewMode).toBe('card');
  });

  it('updates a preference', () => {
    useAuthStore.getState().setPreference('matchViewMode', 'table');
    expect(useAuthStore.getState().preferences.matchViewMode).toBe('table');
  });

  it('preserves other preferences when updating one', () => {
    useAuthStore.getState().setPreference('defaultPlatform', 'euw1');
    const { preferences } = useAuthStore.getState();
    expect(preferences.defaultPlatform).toBe('euw1');
    expect(preferences.defaultRegion).toBe('americas'); // unchanged
    expect(preferences.matchViewMode).toBe('card'); // unchanged
  });
});
