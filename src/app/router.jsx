import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ProtectedRoute from '../auth/ProtectedRoute';

// Dashboards
import SuperAdminDashboard from '../dashboard/SuperAdminDashboard';
import CoachingDashboard from '../dashboard/CoachingDashboard';

// Modules
import StudentList from '../students/StudentList';
import StudentForm from '../students/StudentForm';
import StudentProfile from '../students/StudentProfile'; // NEW: Detail View
import PaymentCollection from '../payments/PaymentCollection'; // NEW: Revenue Terminal
import DefaulterList from '../payments/DefaulterList';
import PaymentHistory from '../payments/PaymentHistory';
import SetupCenter from '../dashboard/SetupCenter';
import UpgradePlan from '../subscriptions/UpgradePlan';
import CentersManagement from '../dashboard/CentersManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/upgrade',
    element: (
      <ProtectedRoute>
        <UpgradePlan />
      </ProtectedRoute>
    ),
  },
  
  // Super Admin Network Routes
  {
    path: '/super-admin',
    element: (
      <ProtectedRoute allowedRoles={['super-admin']}>
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: null, // Renders via SuperAdminDashboard context
      },
      {
        path: 'centers',
        element: <CentersManagement />,
      },
    ],
  },

  // Coaching Admin/Staff Node Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
        <CoachingDashboard />
      </ProtectedRoute>
    ),
    children: [
      // --- Student Management ---
      {
        path: 'students',
        element: <StudentList />,
      },
      {
        path: 'students/new',
        element: <StudentForm />,
      },
      {
        path: 'students/profile/:id', // NEW: Deep link to profile
        element: <StudentProfile />,
      },
      {
        path: 'students/edit/:id', // NEW: CRUD Edit entry
        element: <StudentForm isEdit={true} />,
      },

      // --- Financial Management ---
      {
        path: 'payments/collect', // NEW: Collection terminal
        element: <PaymentCollection />,
      },
      {
        path: 'payments/history',
        element: <PaymentHistory />,
      },
      {
        path: 'payments/defaulters',
        element: <DefaulterList />,
      },

      // --- System Configuration ---
      {
        path: 'setup', 
        element: <SetupCenter />,
      },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-9xl font-black text-slate-200">404</h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500">Node Not Found</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-xl"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    ),
  },
]);