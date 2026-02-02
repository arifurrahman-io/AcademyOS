import api from "./api";
import { useAuthStore } from "../store/authStore";

/**
 * Central keys we want to clean from browser storage.
 * Keep this list in one place to avoid "logout but token still exists" issues.
 */
const STORAGE_KEYS = {
  token: ["token", "accessToken", "jwt"],
  user: ["user", "currentUser", "authUser"],
  role: ["role", "userRole"],
  persisted: [
    "academy-os-auth", // your current key
    "auth-storage", // common
    "persist:auth", // common
    "persist:root", // common
  ],
};

const safeJSONParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const removeKeys = (keys = []) => {
  keys.forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  });
};

const clearApiAuthHeader = () => {
  try {
    // If you set api.defaults.headers.common.Authorization somewhere
    delete api.defaults.headers.common.Authorization;
  } catch {
    // ignore
  }
};

/**
 * Service for managing user authentication and session persistence.
 * Interfaces with the /auth endpoints and handles local storage + Zustand sync.
 */
export const authService = {
  /**
   * Authenticates user credentials and initializes the session.
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    // Backend returns: { success, token, data, trialExpired }
    const { token, data, trialExpired } = response.data || {};

    if (token && data) {
      // ✅ Standardize to ONE token + ONE user key
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      // ✅ If you store role separately, do it here (optional)
      if (data?.role) localStorage.setItem("role", data.role);

      // ✅ Ensure axios uses it immediately (optional)
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // ✅ Sync Zustand store (support both possible signatures)
      const store = useAuthStore.getState();

      if (typeof store.setAuth === "function") {
        // Prefer object signature
        try {
          store.setAuth({ user: data, token, role: data?.role });
        } catch {
          // fallback to (user, token)
          store.setAuth(data, token);
        }
      }
    }

    return response.data;
  },

  /**
   * Terminates the current session and purges all local/state data.
   * @param {Object} options
   * @param {boolean} options.redirect - redirect after logout
   * @param {string} options.to - redirect path
   */
  logout: (options = {}) => {
    const { redirect = true, to = "/login" } = options;

    // 1) Clear localStorage keys (all variants)
    removeKeys(STORAGE_KEYS.token);
    removeKeys(STORAGE_KEYS.user);
    removeKeys(STORAGE_KEYS.role);
    removeKeys(STORAGE_KEYS.persisted);

    // 2) If zustand persist stored under a custom key, try to remove it dynamically too
    // (Example: if you used persist({ name: "academy-os-auth" }))
    // already handled above, but keep safe.
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("persist:")) localStorage.removeItem(k);
      });
    } catch {
      // ignore
    }

    // 3) Clear axios auth header
    clearApiAuthHeader();

    // 4) Reset Zustand state
    const store = useAuthStore.getState();
    if (store?.logout) store.logout();

    // 5) Redirect (optional)
    if (redirect) {
      // Prefer hard redirect to ensure all in-memory data is reset.
      window.location.replace(to);
    }
  },

  /**
   * Returns true if a user exists and role matches.
   * @param {string} role - 'admin', 'super-admin', 'teacher'
   */
  hasRole: (role) => {
    const user = safeJSONParse(localStorage.getItem("user"));
    return user?.role === role;
  },

  /**
   * Get current user from storage.
   */
  getCurrentUser: () => {
    const raw = localStorage.getItem("user");
    return raw ? safeJSONParse(raw) : null;
  },

  /**
   * Get token from storage.
   */
  getToken: () => {
    return localStorage.getItem("token") || null;
  },

  /**
   * Session check helper.
   */
  isLoggedIn: () => {
    return Boolean(localStorage.getItem("token"));
  },
};
