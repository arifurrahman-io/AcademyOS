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
import SuperAdminPaymentsManagement from "../dashboard/SuperAdminPaymentsManagement";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  // 🌐 Public
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/unauthorized", element: <Unauthorized /> },

  // 🛡 SUPER ADMIN
  {
    path: "/super-admin",
    element: (
      <ProtectedRoute allowedRoles={["super-admin"]}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <div /> },
      { path: "centers", element: <CentersManagement /> },
      { path: "payments", element: <SuperAdminPaymentsManagement /> },
    ],
  },

  // 🏫 COACHING DASHBOARD
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <CoachingDashboard />
      </ProtectedRoute>
    ),
    children: [
      // ✅ DO NOT redirect from index
      { index: true, element: <div /> },

      // Students
      { path: "students", element: <StudentList /> },
      { path: "students/new", element: <StudentForm /> },
      { path: "students/profile/:id", element: <StudentProfile /> },
      { path: "students/edit/:id", element: <StudentForm isEdit /> },

      // Payments
      { path: "payments/collect", element: <PaymentCollection /> },
      { path: "payments/history", element: <PaymentHistory /> },
      { path: "payments/defaulters", element: <DefaulterList /> },

      // Setup
      {
        path: "setup",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SetupCenter />
          </ProtectedRoute>
        ),
      },

      // 💳 UPGRADE — dashboard এর ভেতরেই
      {
        path: "upgrade",
        element: <UpgradePlan />,
      },
    ],
  },

  // ❌ 404
  { path: "*", element: <NotFound /> },
]);
