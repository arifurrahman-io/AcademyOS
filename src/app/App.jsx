import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';

const App = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* 1. Modern Minimalist Toast Provider */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '1.5rem', // Match AcademyOS bento corners
            border: '1px solid #f1f5f9',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
            padding: '16px 24px',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          },
          success: {
            iconTheme: { primary: '#2563eb', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#e11d48', secondary: '#ffffff' },
          },
        }}
      />
      
      {/* 2. Application Router
          The TrialStatus is now moved INSIDE CoachingDashboard.jsx 
          to avoid the "basename null" error and fulfill the 
          dashboard-only requirement.
      */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;