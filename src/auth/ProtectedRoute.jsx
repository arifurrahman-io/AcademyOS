import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../services/api";
import Loader from "../components/Loader";

const LOCKED_STATUSES = [
  "trial_expired",
  "expired",
  "deactivated",
  "suspended",
];
const TTL_MS = 60 * 1000; // 60 seconds

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // subscription cache in store
  const subscriptionStatus = useAuthStore((s) => s.subscriptionStatus);
  const subscriptionCheckedAt = useAuthStore((s) => s.subscriptionCheckedAt);
  const setSubscriptionCache = useAuthStore((s) => s.setSubscriptionCache);

  // UI flags in store
  const setTrialStatus = useAuthStore((s) => s.setTrialStatus);
  const syncUser = useAuthStore((s) => s.syncUser);

  const [checking, setChecking] = useState(true);

  const path = location.pathname;

  // Public pages
  const isPublicPath = path === "/login" || path === "/register";
  const isUnauthorizedPath = path === "/unauthorized";

  // ✅ Support both /upgrade and /dashboard/upgrade
  const isUpgradePath =
    path === "/upgrade" ||
    path.startsWith("/upgrade/") ||
    path === "/dashboard/upgrade" ||
    path.startsWith("/dashboard/upgrade");

  // ✅ must check subscription for coaching users
  const mustCheckSubscription = useMemo(() => {
    const role = user?.role;
    return role === "admin" || role === "teacher";
  }, [user?.role]);

  // ----------------------------
  // 1) AUTH GATE
  // ----------------------------
  if (!isAuthenticated || !token) {
    // allow public pages without login
    if (isPublicPath) return children;
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user) {
    // token exists but user not loaded -> go login (or you can show loader)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ----------------------------
  // 2) ROLE GATE
  // ----------------------------
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (isUnauthorizedPath) return children;
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  // super-admin never blocked by subscription checks
  if (user.role === "super-admin") {
    return children;
  }

  // ----------------------------
  // 3) SUBSCRIPTION SYNC (CACHED)
  // ----------------------------
  useEffect(() => {
    let alive = true;

    const run = async () => {
      // only coaching roles require subscription check
      if (!mustCheckSubscription) {
        if (alive) setChecking(false);
        return;
      }

      // ✅ cache hit
      const fresh = Date.now() - (subscriptionCheckedAt || 0) < TTL_MS;
      if (subscriptionStatus && fresh) {
        if (alive) setChecking(false);
        return;
      }

      try {
        const res = await api.get("/subscriptions/my-status", {
          headers: { "Cache-Control": "no-cache" },
        });

        const data = res.data?.data || {};
        const status = String(data.status || "unknown").toLowerCase();

        // update cache
        setSubscriptionCache(status);

        // lock flag for UI/banner
        const locked = LOCKED_STATUSES.includes(status);
        setTrialStatus(locked);

        // ✅ sync user only if something actually changed
        // (avoid unnecessary store updates)
        const incomingSubscription = {
          status,
          plan: data.plan || "yearly",
          startAt: data.startAt || null,
          endAt: data.endAt || null,
          trialEnd: data.trialEnd || null,
        };

        const current = user?.subscription || {};
        const changed =
          current.status !== incomingSubscription.status ||
          String(current.startAt || "") !==
            String(incomingSubscription.startAt || "") ||
          String(current.endAt || "") !==
            String(incomingSubscription.endAt || "") ||
          String(current.trialEnd || "") !==
            String(incomingSubscription.trialEnd || "") ||
          String(current.plan || "") !==
            String(incomingSubscription.plan || "");

        if (changed) {
          syncUser({
            subscription: {
              ...current,
              ...incomingSubscription,
            },
          });
        }
      } catch (err) {
        // don't block app forever if api fails
        setSubscriptionCache("unknown");
      } finally {
        if (alive) setChecking(false);
      }
    };

    run();

    return () => {
      alive = false;
    };
    // IMPORTANT: keep deps minimal to avoid loops
  }, [
    mustCheckSubscription,
    subscriptionStatus,
    subscriptionCheckedAt,
    setSubscriptionCache,
    setTrialStatus,
    syncUser,
    user, // ok because we only compare + update conditionally
  ]);

  if (mustCheckSubscription && checking) {
    return <Loader fullPage />;
  }

  // ----------------------------
  // 4) LOCK GATE (EXCEPT UPGRADE)
  // ----------------------------
  const lockedNow =
    mustCheckSubscription &&
    subscriptionStatus &&
    LOCKED_STATUSES.includes(subscriptionStatus);

  if (lockedNow && !isUpgradePath) {
    const from = encodeURIComponent(location.pathname + location.search);
    // ✅ Prefer dashboard upgrade if you keep upgrade inside dashboard
    return <Navigate to={`/dashboard/upgrade?from=${from}`} replace />;
  }

  return children;
}
