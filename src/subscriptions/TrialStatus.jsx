import React from "react";
import { useAuthStore } from "../store/authStore";
import { ShieldCheck, AlertTriangle, Crown, Clock } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * @desc Subscription Banner for Coaching Admins
 * Uses backend-calculated trialExpiryDate to avoid drift.
 */
const TrialStatus = () => {
  const { user, isTrialExpired } = useAuthStore();

  // ✅ Hide banner for Super Admin
  const isSuperAdmin = user?.role === "super-admin";

  /**
   * ✅ IMPORTANT:
   * After verification, DB shows:
   * - subscriptionStatus: "paid"
   * - subscription.status: "active"
   * So we must check BOTH.
   */
  const isPaidOrActive =
    user?.subscriptionStatus === "paid" ||
    user?.subscriptionStatus === "active" || // backward compatibility
    user?.subscription?.status === "active";

  if (isSuperAdmin || isPaidOrActive) return null;

  const calculateDaysRemaining = () => {
    // Your DB has trialExpiryDate (good)
    const raw =
      user?.trialExpiryDate ||
      user?.trialExpiry ||
      user?.trialEnd ||
      user?.trialExpiryAt;

    if (!raw) return 0;

    const expiry = new Date(raw);
    const today = new Date();

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining();

  /**
   * ✅ Effective expiration:
   * Store flag OR real-time date check.
   */
  const effectiveExpired = Boolean(isTrialExpired) || daysRemaining <= 0;

  return (
    <div
      className={`
        relative p-5 rounded-[2.5rem] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-top-4
        ${
          effectiveExpired
            ? "bg-gradient-to-r from-rose-600 to-red-700 shadow-rose-200/40"
            : "bg-gradient-to-r from-blue-600 to-indigo-700 shadow-blue-200/40"
        }
      `}
    >
      <div className="flex items-center gap-5 ml-2 md:ml-4">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/10 shrink-0">
          {effectiveExpired ? (
            <AlertTriangle size={24} />
          ) : (
            <ShieldCheck size={24} />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 flex items-center gap-1.5">
            <Clock size={10} /> Node Access Level
          </p>
          <h4 className="text-lg font-black tracking-tight leading-none">
            {effectiveExpired
              ? "Instance Restricted: Trial Expired"
              : `Provisional Access: ${daysRemaining} Days Remaining`}
          </h4>
          <p className="text-[11px] font-medium opacity-80 max-w-md leading-tight">
            {effectiveExpired
              ? "Your trial period has concluded. Please settle your invoice to restore node operations."
              : "Your coaching node is currently in trial mode with full access to all premium modules."}
          </p>
        </div>
      </div>

      <Link
        to="/upgrade"
        className={`
          w-full sm:w-auto bg-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all text-center mr-2 shadow-lg shadow-black/10 flex items-center justify-center gap-2 active:scale-95
          ${effectiveExpired ? "text-rose-600" : "text-blue-700"}
        `}
      >
        <Crown size={14} />
        {effectiveExpired ? "Activate License" : "Upgrade Plan"}
      </Link>

      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default TrialStatus;
