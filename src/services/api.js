import axios from "axios";
import { useAuthStore } from "../store/authStore";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

/**
 * Helpers
 */
const safeRedirect = (path) => {
  if (typeof window === "undefined") return;
  if (window.location.pathname === path) return;
  window.location.href = path;
};

const buildUpgradeUrl = () => {
  const from = window.location.pathname + window.location.search;
  const params = new URLSearchParams({ from });
  return `/upgrade?${params.toString()}`;
};

/**
 * Decide whether we should redirect for a given failing request.
 * We should NOT redirect for background calls (settings save, list fetch),
 * only redirect for "page entry" calls if you want.
 */
const shouldRedirectOn403 = (error) => {
  const url = error?.config?.url || "";
  const method = (error?.config?.method || "").toLowerCase();

  // Do NOT redirect for write operations (PUT/POST/PATCH/DELETE).
  if (["post", "put", "patch", "delete"].includes(method)) return false;

  // Do NOT redirect for tenant settings endpoints (they are in-page actions).
  if (url.includes("/coaching/settings")) return false;

  // Otherwise OK to redirect for forbidden view pages (optional)
  return true;
};

/**
 * REQUEST Interceptor
 * Attach Bearer token from Zustand store.
 */
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    config.headers = config.headers || {};
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * RESPONSE Interceptor
 * Handles auth, subscription locks, and prevents redirect loops.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const code = data?.code;

    // ✅ Network / server down
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: "Network error. Please check your internet or server.",
      });
    }

    /**
     * ✅ SUBSCRIPTION LOCK
     * Backend returns:
     *  - status: 402
     *  - data: { success:false, code:"SUBSCRIPTION_REQUIRED" }
     */
    if (status === 402 && code === "SUBSCRIPTION_REQUIRED") {
      const upgradeUrl = buildUpgradeUrl();
      if (!window.location.pathname.startsWith("/upgrade")) {
        safeRedirect(upgradeUrl);
      }
      return Promise.reject(error);
    }

    /**
     * ✅ UNAUTHORIZED (token invalid/expired)
     */
    if (status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      if (window.location.pathname !== "/login") safeRedirect("/login");
      return Promise.reject(error);
    }

    /**
     * ✅ FORBIDDEN (role mismatch / access denied)
     * IMPORTANT: Do NOT always redirect.
     * For in-page operations (PUT/POST etc), just return the error to UI.
     */
    if (status === 403) {
      // Only redirect when appropriate
      if (shouldRedirectOn403(error)) {
        if (window.location.pathname !== "/unauthorized") {
          safeRedirect("/unauthorized");
        }
      }
      return Promise.reject(error);
    }

    /**
     * ✅ Legacy special case
     */
    if (status === 404 && data?.message === "Node Not Found") {
      const { logout } = useAuthStore.getState();
      logout();
      safeRedirect("/login");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
