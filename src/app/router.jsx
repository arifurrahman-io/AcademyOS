import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";
import ProtectedRoute from "../auth/ProtectedRoute";

import SuperAdminDashboard from "../dashboard/SuperAdminDashboard";
import CoachingDashboard from "../dashboard/CoachingDashboard";

import StudentList from "../students/StudentList";
import StudentForm from "../students/StudentForm";
import StudentProfile from "../students/StudentProfile";

import PaymentCollection from "../payments/PaymentCollection";
import DefaulterList from "../payments/DefaulterList";
import PaymentHistory from "../payments/PaymentHistory";

import SetupCenter from "../dashboard/SetupCenter";
import UpgradePlan from "../subscriptions/UpgradePlan";
import CentersManagement from "../dashboard/CentersManagement";

import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

/**
 * Smart default redirect:
 * - If logged in, send to their proper dashboard
 * - If not logged in, send to login
 *
 * (This is optional; if you don’t want this, keep simple Navigate.)
 */
const RootRedirect = () => {
  // You can optionally use store here, but keep it simple for now:
  return <Navigate to="/dashboard" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },

  // Public
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  // Upgrade (any logged-in user)
  {
    path: "/upgrade",
    element: (
      <ProtectedRoute>
        <UpgradePlan />
      </ProtectedRoute>
    ),
  },

  // Super Admin
  {
    path: "/super-admin",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      // ✅ Render overview on /super-admin
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      // ✅ Must render something; SuperAdminDashboard already shows overview based on pathname
      // but we still provide a valid element to avoid "blank route" issues.
      {
        path: "dashboard",
        element: <div />, // lightweight placeholder
      },
      {
        path: "centers",
        element: <CentersManagement />,
      },
      // add future routes here:
      // { path: "payments", element: <PaymentsPage /> },
    ],
  },

  // Coaching Admin/Staff
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <CoachingDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="students" replace />,
      },

      // Students
      { path: "students", element: <StudentList /> },
      { path: "students/new", element: <StudentForm /> },
      { path: "students/profile/:id", element: <StudentProfile /> },
      { path: "students/edit/:id", element: <StudentForm isEdit={true} /> },

      // Payments
      { path: "payments/collect", element: <PaymentCollection /> },
      { path: "payments/history", element: <PaymentHistory /> },
      { path: "payments/defaulters", element: <DefaulterList /> },

      // Setup
      { path: "setup", element: <SetupCenter /> },
    ],
  },

  // Fallback
  {
    path: "*",
    element: <NotFound />,
  },
]);
