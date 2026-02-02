import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";

const PERSIST_KEY = "academy-os-auth";
const LEGACY_KEYS = [
  "token",
  "accessToken",
  "jwt",
  "user",
  "currentUser",
  "authUser",
  "role",
  "userRole",
  "persist:auth",
  "persist:root",
];

const safeRemove = (k) => {
  try {
    localStorage.removeItem(k);
  } catch {
    // ignore
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      // ✅ trial lock flag used by TrialStatus + ProtectedRoute
      isTrialExpired: false,

      // ✅ subscription cache (prevents infinite calls)
      subscriptionStatus: null, // "active" | "trial_active" | "trial_expired" | "expired" | "unknown"
      subscriptionCheckedAt: 0,

      // ✅ optional hydration flag (if you want to block until rehydrated)
      isHydrated: false,

      setAuth: (userData, token) => {
        const trialExpiry =
          userData?.trialExpiry || userData?.trialExpiryDate || null;

        const isExpired = trialExpiry
          ? new Date(trialExpiry) < new Date()
          : false;

        const role = userData?.role || null;

        set({
          user: {
            ...userData,
            settings: userData?.settings || { classes: [], batches: [] },
          },
          token,
          role,
          isAuthenticated: !!token,
          isTrialExpired: isExpired,
        });

        // optional (backward compatibility)
        if (token) localStorage.setItem("token", token);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));
        if (role) localStorage.setItem("role", role);

        if (token)
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
      },

      syncUser: (updatedUserData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUserData } : null,
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: newSettings || { classes: [], batches: [] },
              }
            : null,
        })),

      setTrialStatus: (status) => set({ isTrialExpired: !!status }),

      // ✅ subscription cache setter
      setSubscriptionCache: (status) =>
        set({
          subscriptionStatus: status || "unknown",
          subscriptionCheckedAt: Date.now(),
        }),

      // ✅ force re-check (call this if you want to refresh manually)
      invalidateSubscriptionCache: () =>
        set({ subscriptionStatus: null, subscriptionCheckedAt: 0 }),

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          isTrialExpired: false,
          subscriptionStatus: null,
          subscriptionCheckedAt: 0,
        });

        safeRemove(PERSIST_KEY);
        LEGACY_KEYS.forEach(safeRemove);

        try {
          delete api.defaults.headers.common.Authorization;
        } catch {
          // ignore
        }
      },
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        role: s.role,
        isAuthenticated: s.isAuthenticated,
        isTrialExpired: s.isTrialExpired,
        subscriptionStatus: s.subscriptionStatus,
        subscriptionCheckedAt: s.subscriptionCheckedAt,
      }),

      // ✅ set isHydrated true after rehydrate
      onRehydrateStorage: () => (state) => {
        try {
          const token = state?.token;
          if (token)
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
        } finally {
          state?.setState?.({ isHydrated: true });
        }
      },
    },
  ),
);
