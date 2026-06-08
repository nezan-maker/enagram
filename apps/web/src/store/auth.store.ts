import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tier } from '../policies/feature.policy';

interface AuthState {
  user: Record<string, unknown> | null;
  accessToken: string | null;
  restaurantId: string | null;
  restaurantTier: Tier | null;
  isAuthenticated: boolean;
  isFirstLogin: boolean;

  login: (payload: { user: Record<string, unknown>; accessToken: string; restaurantId?: string }) => void;
  logout: () => void;
  /** Update the in-memory access token after silent refresh. Refresh token lives in httpOnly cookie. */
  setTokens: (accessToken: string) => void;
  updateTier: (newTier: Tier) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      restaurantId: null,
      restaurantTier: Tier.TIER_1,
      isAuthenticated: false,
      isFirstLogin: false,

      login: (payload) =>
        set({
          user: payload.user,
          accessToken: payload.accessToken,
          restaurantId: payload.restaurantId || null,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
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
        restaurantId: state.restaurantId,
        restaurantTier: state.restaurantTier,
        isAuthenticated: state.isAuthenticated,
        isFirstLogin: state.isFirstLogin,
      }),
    }
  )
);
