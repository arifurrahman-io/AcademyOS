import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isTrialExpired: false,

      /**
       * Set credentials after login.
       * Ensures the settings object is initialized to prevent 'undefined' crashes.
       */
      setAuth: (userData, token, isTrialExpired = false) => set({ 
        user: {
          ...userData,
          // Fallback initialization to prevent "Cannot read properties of undefined"
          settings: userData?.settings || { classes: [], batches: [] } 
        }, 
        token, 
        isAuthenticated: true,
        isTrialExpired 
      }),

      /**
       * Updates the level/batch settings in the store instantly.
       * Called after coachingService.updateSettings() succeeds.
       */
      updateSettings: (newSettings) => set((state) => ({
        user: state.user ? {
          ...state.user,
          settings: newSettings || { classes: [], batches: [] }
        } : null
      })),

      /**
       * Update trial status dynamically based on backend checks.
       */
      setTrialStatus: (status) => set({ isTrialExpired: status }),

      /**
       * Clear state on logout.
       */
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isTrialExpired: false 
        });
        localStorage.removeItem('academy-os-auth');
      },
    }),
    {
      name: 'academy-os-auth', // Storage key for persistence
    }
  )
);