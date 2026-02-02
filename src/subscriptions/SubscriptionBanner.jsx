import React, { useMemo } from "react";
import { AlertTriangle, Clock, CreditCard, XCircle } from "lucide-react";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysUntil = (dateLike) => {
  if (!dateLike) return null;
  const end = new Date(dateLike);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / MS_PER_DAY);
};

const formatDate = (dateLike) => {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

/**
 * Props:
 * - center: coaching center doc (from /coaching/me)
 * - onUpgradeClick: optional () => void
 * - onDismiss: optional () => void (if you want local dismiss)
 */
const SubscriptionBanner = ({ center, onUpgradeClick, onDismiss }) => {
  const state = useMemo(() => {
    if (!center) return { type: "none" };

    const subStatus = center?.subscription?.status; // "active"
    const plan = center?.subscription?.plan; // "yearly"
    const subEnd = center?.subscription?.endAt;

    const trialEnd = center?.trialExpiryDate;
    const isPaid =
      center?.subscriptionStatus === "paid" || subStatus === "active";

    // Paid subscription days remaining
    if (isPaid && subEnd) {
      const d = daysUntil(subEnd);
      if (d === null) return { type: "none" };

      if (d <= 0) {
        return {
          type: "expired",
          title: "Subscription expired",
          body: `Your yearly plan ended on ${formatDate(subEnd)}. Renew to continue full access.`,
          meta: { days: d, endAt: subEnd, plan },
        };
      }

      if (d <= 7) {
        return {
          type: "critical",
          title: "Subscription expiring soon",
          body: `Your plan expires in ${d} day${d === 1 ? "" : "s"} (ends ${formatDate(subEnd)}). Renew now to avoid interruption.`,
          meta: { days: d, endAt: subEnd, plan },
        };
      }

      if (d <= 15) {
        return {
          type: "warning",
          title: "Upcoming subscription renewal",
          body: `Your plan will expire in ${d} days (ends ${formatDate(subEnd)}). Consider renewing early.`,
          meta: { days: d, endAt: subEnd, plan },
        };
      }

      return { type: "none" };
    }

    // Trial days remaining
    if (!isPaid && trialEnd) {
      const d = daysUntil(trialEnd);

      if (d <= 0) {
        return {
          type: "trial_expired",
          title: "Trial ended",
          body: "Your 14-day trial has ended. Subscribe to unlock all features.",
          meta: { days: d, endAt: trialEnd },
        };
      }

      if (d <= 3) {
        return {
          type: "critical",
          title: "Trial expiring soon",
          body: `Your trial ends in ${d} day${d === 1 ? "" : "s"} (ends ${formatDate(trialEnd)}). Subscribe to avoid lockout.`,
          meta: { days: d, endAt: trialEnd },
        };
      }

      if (d <= 7) {
        return {
          type: "warning",
          title: "Trial ending soon",
          body: `You have ${d} days left in your trial (ends ${formatDate(trialEnd)}).`,
          meta: { days: d, endAt: trialEnd },
        };
      }
    }

    return { type: "none" };
  }, [center]);

  if (state.type === "none") return null;

  const styles = {
    critical: {
      wrap: "border-rose-200 bg-rose-50 text-rose-900",
      icon: "text-rose-600",
      badge: "bg-rose-600 text-white",
      btn: "bg-rose-600 hover:bg-rose-500 text-white",
    },
    warning: {
      wrap: "border-amber-200 bg-amber-50 text-amber-900",
      icon: "text-amber-600",
      badge: "bg-amber-600 text-white",
      btn: "bg-amber-600 hover:bg-amber-500 text-white",
    },
    expired: {
      wrap: "border-slate-200 bg-slate-900 text-white",
      icon: "text-white",
      badge: "bg-white/15 text-white",
      btn: "bg-white text-slate-900 hover:bg-white/90",
    },
    trial_expired: {
      wrap: "border-slate-200 bg-slate-900 text-white",
      icon: "text-white",
      badge: "bg-white/15 text-white",
      btn: "bg-white text-slate-900 hover:bg-white/90",
    },
  };

  const theme =
    state.type === "critical"
      ? styles.critical
      : state.type === "warning"
        ? styles.warning
        : styles.expired;

  const Icon =
    state.type === "expired" || state.type === "trial_expired"
      ? XCircle
      : AlertTriangle;

  return (
    <div
      className={`w-full rounded-3xl border p-5 md:p-6 shadow-sm ${theme.wrap}`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Icon className={`${theme.icon}`} size={22} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.badge}`}
              >
                <Clock size={12} className="inline -mt-0.5 mr-1" />
                {state.type.replaceAll("_", " ")}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-black tracking-tight">
              {state.title}
            </h3>

            <p className="text-sm font-semibold opacity-90">{state.body}</p>

            {(center?.subscription?.startAt || center?.subscription?.endAt) && (
              <p className="text-[11px] font-bold opacity-80 mt-1">
                {center?.subscription?.startAt
                  ? `Start: ${formatDate(center.subscription.startAt)}`
                  : ""}
                {center?.subscription?.startAt && center?.subscription?.endAt
                  ? " • "
                  : ""}
                {center?.subscription?.endAt
                  ? `End: ${formatDate(center.subscription.endAt)}`
                  : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          {typeof onUpgradeClick === "function" && (
            <button
              onClick={onUpgradeClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${theme.btn}`}
            >
              <CreditCard size={16} />
              Subscribe / Renew
            </button>
          )}

          {typeof onDismiss === "function" && (
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-2xl text-xs font-black bg-black/5 hover:bg-black/10 transition-all"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
