import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isTrialExpired: false,

      /**
       * Set credentials after login.
       * Merges userData to ensure we capture email, phone, joinedAt, etc.
       */
      setAuth: (userData, token) => {
        const isExpired = userData?.trialExpiry
          ? new Date(userData.trialExpiry) < new Date()
          : false;

        set({
          user: {
            ...userData,
            settings: userData?.settings || { classes: [], batches: [] },
          },
          token,
          isAuthenticated: !!token,
          isTrialExpired: isExpired,
        });
      },

      /**
       * Sync User Data
       * Call this after updating coaching profile to ensure fields like
       * phone, email, and joinedAt are updated in the persistent state.
       */
      syncUser: (updatedUserData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUserData } : null,
        })),

      /**
       * Updates settings specifically (Classes/Batches)
       */
      updateSettings: (newSettings) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: newSettings || { classes: [], batches: [] },
              }
            : null,
        })),

      /**
       * Update trial status dynamically
       */
      setTrialStatus: (status) => set({ isTrialExpired: status }),

      /**
       * Logout and clear EVERYTHING
       * This prevents the "404 Node Not Found" loop by clearing stale
       * tokens that the restarted server won't recognize.
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isTrialExpired: false,
        });
        // Explicitly clear storage
        localStorage.removeItem("academy-os-auth");
      },
    }),
    {
      name: "academy-os-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
