import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  const { isAuthenticated, user, isTrialExpired, isHydrated } = useAuthStore();

  // Only block if isHydrated exists and is false
  if (typeof isHydrated === "boolean" && isHydrated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">
        Loading session...
      </div>
    );
  }

  const path = location.pathname;
  const isPublicPath = path === "/login" || path === "/register";
  const isUpgradePath = path === "/upgrade";
  const isUnauthorizedPath = path === "/unauthorized";

  if (!isAuthenticated) {
    if (isPublicPath) return children;
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (isUnauthorizedPath) return children;
    return <Navigate to="/unauthorized" replace state={{ from: location }} />;
  }

  if (isTrialExpired && user.role !== "super-admin") {
    if (!isUpgradePath) {
      return <Navigate to="/upgrade" replace state={{ from: location }} />;
    }
  }

  return children;
};

export default ProtectedRoute;
