import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Pulls the latest token directly from the Zustand store.
 * This is more reliable than localStorage because Zustand handles the persistence.
 */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 * Handles the "404 Node Not Found" / "Unauthorized" loop.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 (Unauthorized) or 403 (Forbidden)
    // it means the token is invalid/expired due to a server restart or timeout.
    if (error.response?.status === 401 || error.response?.status === 403) {
      const { logout } = useAuthStore.getState();

      // 1. Clear the store and localStorage via our logout function
      logout();

      // 2. Redirect to login to break the 404 loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Check for specific backend error messages if necessary
    if (
      error.response?.status === 404 &&
      error.response?.data?.message === "Node Not Found"
    ) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
