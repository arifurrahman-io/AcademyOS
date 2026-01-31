import api from "./api";
import { useAuthStore } from "../store/authStore";

/**
 * Service for managing user authentication and session persistence.
 * Interfaces with the /auth endpoints and handles local storage.
 */
export const authService = {
  /**
   * Authenticates user credentials and initializes the session.
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    // Backend returns success, JWT token, user object, and trial status.
    const { token, data, trialExpired } = response.data;

    if (token) {
      // 1. Persist to LocalStorage for API interceptors and refresh resilience.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      // 2. Immediate Store Sync: Updates Zustand state to reflect the new user.
      useAuthStore.getState().setAuth(data, token);
    }

    return response.data;
  },

  /**
   * Terminates the current session and purges all local/state data.
   */
  logout: () => {
    // 1. Clear LocalStorage and persisted store keys.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("academy-os-auth");

    // 2. Reset Zustand store to initial null state.
    useAuthStore.getState().logout();

    // 3. Redirect to login to prevent stale state usage.
    window.location.href = "/login";
  },

  /**
   * Validates if the current session belongs to a specific role.
   * @param {string} role - 'admin', 'super-admin', or 'teacher'.
   */
  hasRole: (role) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === role;
  },

  /**
   * Retrieval helper to pull the user node from storage.
   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
