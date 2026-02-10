import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── Auth state ────────────────────────────────
      isLoggedIn: false,
      user: null,  // { username, email }

      // ── Favorites ─────────────────────────────────
      favorites: [],  // [{ gameName, tagLine, platform, region }]

      // ── Preferences ───────────────────────────────
      preferences: {
        defaultPlatform: 'na1',
        defaultRegion: 'americas',
        matchViewMode: 'card', // 'card' | 'table'
      },

      // ── Actions ───────────────────────────────────

      login: (username, email) =>
        set({ isLoggedIn: true, user: { username, email } }),

      logout: () =>
        set({ isLoggedIn: false, user: null }),

      addFavorite: (player) => {
        const { favorites } = get();
        const exists = favorites.some(
          f => f.gameName === player.gameName && f.tagLine === player.tagLine && f.platform === player.platform
        );
        if (!exists) {
          set({ favorites: [...favorites, player] });
        }
      },

      removeFavorite: (gameName, tagLine) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter(
            f => !(f.gameName === gameName && f.tagLine === tagLine)
          ),
        });
      },

      setPreference: (key, value) => {
        const { preferences } = get();
        set({ preferences: { ...preferences, [key]: value } });
      },
    }),
    {
      name: 'riot-stats-auth',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        favorites: state.favorites,
        preferences: state.preferences,
      }),
    }
  )
);

export default useAuthStore;
