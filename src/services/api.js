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
  if (window.location.pathname + window.location.search === path) return;
  window.location.href = path;
};

const buildUpgradeUrl = () => {
  if (typeof window === "undefined") return "/upgrade";
  const from = window.location.pathname + window.location.search;
  const params = new URLSearchParams({ from });
  return `/upgrade?${params.toString()}`;
};

const getReqMeta = (error) => {
  const url = error?.config?.url || "";
  const method = String(error?.config?.method || "get").toLowerCase();
  return { url, method };
};

/**
 * Endpoints that must NOT cause redirect loops.
 * We allow these to fail and let UI/ProtectedRoute handle.
 */
const isNoRedirectEndpoint = (url = "") => {
  return (
    url.includes("/subscriptions/my-status") ||
    url.includes("/subscriptions/upgrade-center") ||
    url.includes("/auth/login") ||
    url.includes("/auth/register")
  );
};

/**
 * We should NOT redirect for background calls (settings save, list fetch),
 * only redirect for safe "view" calls if needed.
 */
const shouldRedirectOn403 = (error) => {
  const { url, method } = getReqMeta(error);

  // Do NOT redirect for write operations (PUT/POST/PATCH/DELETE).
  if (["post", "put", "patch", "delete"].includes(method)) return false;

  // Do NOT redirect for tenant settings endpoints (they are in-page actions).
  if (url.includes("/coaching/settings")) return false;

  return true;
};

/**
 * SUBSCRIPTION redirect policy:
 * - Only redirect on GET requests (page/view loads)
 * - Do NOT redirect for my-status/auth/upgrade submit endpoints
 * - Do NOT redirect if already on /upgrade
 */
const shouldRedirectOn402 = (error) => {
  const { url, method } = getReqMeta(error);

  if (isNoRedirectEndpoint(url)) return false;
  if (["post", "put", "patch", "delete"].includes(method)) return false;

  // already on upgrade -> never redirect again
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/upgrade")
  ) {
    return false;
  }

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
    // ✅ Network / server down
    if (!error?.response) {
      return Promise.reject({
        ...error,
        message: "Network error. Please check your internet or server.",
      });
    }

    const status = error.response.status;
    const data = error.response.data;
    const code = data?.code;

    /**
     * ✅ SUBSCRIPTION LOCK
     * Backend returns:
     *  - status: 402
     *  - data: { success:false, code:"SUBSCRIPTION_REQUIRED" }
     */
    if (status === 402 && code === "SUBSCRIPTION_REQUIRED") {
      // IMPORTANT: do not redirect for background calls
      if (shouldRedirectOn402(error)) {
        safeRedirect(buildUpgradeUrl());
      }
      return Promise.reject(error);
    }

    /**
     * ✅ UNAUTHORIZED (token invalid/expired)
     */
    if (status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        safeRedirect("/login");
      }
      return Promise.reject(error);
    }

    /**
     * ✅ FORBIDDEN (role mismatch / access denied)
     */
    if (status === 403) {
      if (shouldRedirectOn403(error)) {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/unauthorized"
        ) {
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
