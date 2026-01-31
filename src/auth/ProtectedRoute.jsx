import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isTrialExpired } = useAuthStore();
  const location = useLocation();

  // 1. Check if logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Role Permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Check Trial Expiration (Block access to operational tools if expired)
  // Super-admins are exempt from trial checks
  if (isTrialExpired && user?.role !== 'super-admin' && location.pathname !== '/upgrade') {
    return <Navigate to="/upgrade" replace />;
  }

  return children;
};

export default ProtectedRoute;