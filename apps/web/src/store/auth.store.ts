import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tier } from '../policies/feature.policy';

interface AuthState {
  user: Record<string, unknown> | null;
  accessToken: string | null;
  refreshToken: string | null;
  restaurantId: string | null;
  restaurantTier: Tier | null;
  isAuthenticated: boolean;
  isFirstLogin: boolean;

  login: (payload: { user: Record<string, unknown>; accessToken: string; refreshToken: string; restaurantId?: string }) => void;
  logout: () => void;
  setTokens: (accessToken: string) => void;
  updateTier: (newTier: Tier) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      restaurantId: null,
      restaurantTier: Tier.TIER_1,
      isAuthenticated: false,
      isFirstLogin: false,

      login: (payload) =>
        set({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          restaurantId: payload.restaurantId || null,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          restaurantId: null,
          isAuthenticated: false,
        }),

      setTokens: (accessToken: string) =>
        set({ accessToken }),

      updateTier: (newTier: Tier) =>
        set({ restaurantTier: newTier }),
    }),
    {
      name: 'enagram-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        restaurantId: state.restaurantId,
        restaurantTier: state.restaurantTier,
        isAuthenticated: state.isAuthenticated,
        isFirstLogin: state.isFirstLogin,
      }),
    }
  )
);
