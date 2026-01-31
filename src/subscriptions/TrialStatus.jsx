import React from 'react';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, AlertTriangle, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../utils/constants';

const TrialStatus = () => {
  const { user, isTrialExpired } = useAuthStore();

  // Hide banner for Super Admins or active subscribers
  if (user?.role === 'super-admin' || user?.subscriptionStatus === 'active') {
    return null;
  }

  // Dynamic date logic for the 2026 enterprise node
  const start = user?.trialStartDate ? new Date(user.trialStartDate) : new Date();
  const today = new Date();
  const diffTime = Math.abs(today - start);
  const daysUsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, (APP_CONFIG.TRIAL_DAYS || 7) - daysUsed);

  return (
    <div className={`
      relative p-5 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-top-4
      ${isTrialExpired 
        ? 'bg-gradient-to-r from-rose-600 to-red-700 shadow-rose-200/40' 
        : 'bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-200/40'}
    `}>
      <div className="flex items-center gap-5 ml-2 md:ml-4">
        {/* Glassmorphism Icon Container */}
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/10 shrink-0">
          {isTrialExpired ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
            Subscription Status
          </p>
          <h4 className="text-lg font-black tracking-tight leading-none">
            {isTrialExpired 
              ? 'Access Restricted: Trial Expired' 
              : `Free Trial: ${daysRemaining} Days Remaining`}
          </h4>
          <p className="text-[11px] font-medium opacity-80 max-w-md leading-tight">
            {isTrialExpired 
              ? 'Synchronize your billing plan to resume institute management.' 
              : 'You have full access to all features during your trial period.'}
          </p>
        </div>
      </div>

      {/* Modern Upgrade Trigger - Ensure this is wrapped in BrowserRouter in main.jsx */}
      <Link 
        to="/upgrade" 
        className="w-full sm:w-auto bg-white text-blue-700 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all text-center mr-2 shadow-lg shadow-black/10 flex items-center justify-center gap-2 active:scale-95"
      >
        <Crown size={14} className={isTrialExpired ? 'text-rose-600' : 'text-blue-600'} />
        {isTrialExpired ? 'Renew Now' : 'Upgrade Center'}
      </Link>

      {/* Subtle Background Glow for depth */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default TrialStatus;