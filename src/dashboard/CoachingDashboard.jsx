import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  AlertCircle,
  LayoutDashboard,
  Menu,
  Plus,
  CreditCard,
  History,
  TrendingUp,
  ShieldCheck,
  Search,
  Settings,
  X,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import Loader from "../components/Loader";
import { formatCurrency } from "../utils/format";
import { authService } from "../services/auth.service";
import api from "../services/api";

/* -----------------------------
   Subscription helpers
------------------------------ */
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysUntil = (dateLike) => {
  if (!dateLike) return null;
  const end = new Date(dateLike);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY);
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
 * SubscriptionBanner
 * - Paid: show expiring soon / expired
 * - Trial: show trial ending / trial ended
 */
const SubscriptionBanner = ({ center, onUpgradeClick }) => {
  const banner = useMemo(() => {
    if (!center) return null;

    const sub = center?.subscription || {};
    const isPaid =
      center?.subscriptionStatus === "paid" || sub?.status === "active";

    // ---- PAID PATH ----
    if (isPaid && sub?.endAt) {
      const remaining = daysUntil(sub.endAt);
      const startAt = sub?.startAt;

      if (remaining !== null && remaining <= 0) {
        return {
          tone: "expired",
          title: "Subscription expired",
          body: `Your plan ended on ${formatDate(sub.endAt)}. Renew to restore full access.`,
          meta: `Start: ${formatDate(startAt)} • End: ${formatDate(sub.endAt)}`,
          cta: "Renew Subscription",
          icon: <XCircle size={20} className="text-white" />,
        };
      }

      if (remaining !== null && remaining <= 7) {
        return {
          tone: "critical",
          title: "Subscription expiring soon",
          body: `Your plan expires in ${remaining} day${
            remaining === 1 ? "" : "s"
          } (ends ${formatDate(sub.endAt)}). Renew now to avoid interruption.`,
          meta: `Start: ${formatDate(startAt)} • End: ${formatDate(sub.endAt)}`,
          cta: "Renew Now",
          icon: <AlertTriangle size={20} className="text-rose-600" />,
        };
      }

      if (remaining !== null && remaining <= 15) {
        return {
          tone: "warning",
          title: "Upcoming renewal",
          body: `Your plan will expire in ${remaining} days (ends ${formatDate(
            sub.endAt,
          )}). Consider renewing early.`,
          meta: `Start: ${formatDate(startAt)} • End: ${formatDate(sub.endAt)}`,
          cta: "Renew",
          icon: <Clock size={20} className="text-amber-600" />,
        };
      }

      return null;
    }

    // ---- TRIAL PATH ----
    const trialEnd = center?.trialExpiryDate;
    if (trialEnd) {
      const remaining = daysUntil(trialEnd);

      if (remaining !== null && remaining <= 0) {
        return {
          tone: "expired",
          title: "Trial ended",
          body: "Your 14-day trial has ended. Subscribe to unlock all features.",
          meta: `Trial ended: ${formatDate(trialEnd)}`,
          cta: "Buy Subscription",
          icon: <XCircle size={20} className="text-white" />,
        };
      }

      if (remaining !== null && remaining <= 3) {
        return {
          tone: "critical",
          title: "Trial expiring soon",
          body: `Your trial ends in ${remaining} day${
            remaining === 1 ? "" : "s"
          } (ends ${formatDate(trialEnd)}). Subscribe to avoid lockout.`,
          meta: `Trial ends: ${formatDate(trialEnd)}`,
          cta: "Buy Subscription",
          icon: <AlertTriangle size={20} className="text-rose-600" />,
        };
      }

      if (remaining !== null && remaining <= 7) {
        return {
          tone: "warning",
          title: "Trial ending soon",
          body: `You have ${remaining} days left in your trial (ends ${formatDate(
            trialEnd,
          )}).`,
          meta: `Trial ends: ${formatDate(trialEnd)}`,
          cta: "Buy Subscription",
          icon: <Clock size={20} className="text-amber-600" />,
        };
      }
    }

    return null;
  }, [center]);

  if (!banner) return null;

  const tones = {
    critical: {
      wrap: "border-rose-200 bg-rose-50",
      title: "text-rose-900",
      body: "text-rose-800",
      meta: "text-rose-700/80",
      btn: "bg-rose-600 hover:bg-rose-500 text-white",
      badge: "bg-rose-600 text-white",
    },
    warning: {
      wrap: "border-amber-200 bg-amber-50",
      title: "text-amber-900",
      body: "text-amber-800",
      meta: "text-amber-700/80",
      btn: "bg-amber-600 hover:bg-amber-500 text-white",
      badge: "bg-amber-600 text-white",
    },
    expired: {
      wrap: "border-slate-200 bg-slate-900",
      title: "text-white",
      body: "text-slate-200",
      meta: "text-slate-300/80",
      btn: "bg-white text-slate-900 hover:bg-white/90",
      badge: "bg-white/15 text-white",
    },
  };

  const theme = tones[banner.tone];

  return (
    <div
      className={`w-full rounded-3xl border p-5 sm:p-6 shadow-sm ${theme.wrap}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{banner.icon}</div>

          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.badge}`}
            >
              <Clock size={12} />
              subscription alert
            </span>

            <h3
              className={`text-base sm:text-lg font-black tracking-tight ${theme.title}`}
            >
              {banner.title}
            </h3>

            <p className={`text-sm font-semibold ${theme.body}`}>
              {banner.body}
            </p>

            {banner.meta && (
              <p className={`text-[11px] font-bold ${theme.meta}`}>
                {banner.meta}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onUpgradeClick}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${theme.btn}`}
        >
          <CreditCard size={16} />
          {banner.cta}
        </button>
      </div>
    </div>
  );
};

/* -----------------------------
   CoachingDashboard
------------------------------ */
const CoachingDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // center info includes subscription dates
  const [center, setCenter] = useState(null);

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    monthlyCollections: 0,
    recentStudents: [],
  });

  const isOverview =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  const fetchCenter = useCallback(async () => {
    try {
      const res = await api.get("/coaching/me"); // ✅ must exist in backend
      setCenter(res.data?.data || null);
    } catch (err) {
      // don't hard-fail dashboard for center fetch
      console.error("CENTER FETCH FAILED:", err);
    }
  }, []);

  /**
   * Dashboard data only (students + payments)
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      const [studentRes, paymentRes] = await Promise.allSettled([
        studentService.getAll(),
        paymentService.getHistory(),
      ]);

      const students =
        studentRes.status === "fulfilled" ? studentRes.value?.data || [] : [];
      const payments =
        paymentRes.status === "fulfilled" ? paymentRes.value?.data || [] : [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const totalPaidThisMonth = payments
        .filter((p) => {
          const d = new Date(p.createdAt);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalStudents: students.length,
        activeStudents: students.filter((s) => s.status === "active").length,
        recentStudents: students.slice(0, 5),
        monthlyCollections: totalPaidThisMonth,
      });
    } catch (err) {
      console.error(err);
      toast.error("Registry synchronization failed.");
    }
  }, []);

  // Single refresh for child pages
  const refresh = useCallback(async () => {
    await Promise.allSettled([fetchCenter(), fetchDashboardData()]);
  }, [fetchCenter, fetchDashboardData]);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        // Load subscription always (banner)
        await fetchCenter();

        // Load dashboard stats only for overview
        if (isOverview) await fetchDashboardData();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    boot();
    return () => {
      mounted = false;
    };
  }, [isOverview, fetchCenter, fetchDashboardData]);

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden selection:bg-blue-100 selection:text-blue-700">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-all duration-300
          lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="h-20 flex items-center justify-between px-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">
                AcademyOS
              </span>
            </Link>

            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active={isOverview}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/students"
              icon={<Users size={18} />}
              label="Registry"
              active={location.pathname.includes("/dashboard/students")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/payments/history"
              icon={<History size={18} />}
              label="Ledger"
              active={location.pathname === "/dashboard/payments/history"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/payments/defaulters"
              icon={<AlertCircle size={18} />}
              label="Audit"
              active={location.pathname === "/dashboard/payments/defaulters"}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="h-px bg-slate-100 my-6 mx-4" />

            <SidebarLink
              to="/dashboard/setup"
              icon={<Settings size={18} />}
              label="Setup"
              active={location.pathname.includes("/dashboard/setup")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/upgrade"
              icon={<CreditCard size={18} />}
              label="Billing"
              active={location.pathname.startsWith("/dashboard/upgrade")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-slate-100/50">
            <div className="group relative flex items-center gap-3 p-3 bg-white border border-slate-200/60 rounded-[1.5rem] shadow-sm transition-all hover:shadow-md hover:border-slate-300/80">
              {/* Avatar with Gradient Depth */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-inner">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              {/* Identity Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-[900] text-slate-900 truncate tracking-tight uppercase">
                  {user?.name || "System Admin"}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                  {user?.role?.replace("-", " ") || "Provisioned Node"}
                </p>
              </div>

              {/* Compact Modern Logout Action */}
              <button
                onClick={handleLogout}
                title="Decommission Session"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>

              {/* Subtle Inner Glow on Hover */}
              <div className="absolute inset-0 rounded-[1.5rem] bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 flex items-center justify-between px-6 sm:px-8 bg-white/50 backdrop-blur-xl shrink-0 z-30 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Global search..."
                className="bg-transparent border-none text-[12px] focus:ring-0 w-48 font-medium placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/students/new"
              className="h-10 px-5 sm:px-6 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest"
            >
              <Plus size={14} /> Enroll
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* ✅ Subscription/Trial Banner */}
            <SubscriptionBanner
              center={center}
              onUpgradeClick={() => navigate("/upgrade")}
            />

            {/* Child routes */}
            <Outlet context={{ stats, refresh }} />

            {/* Overview */}
            {isOverview && (
              <div className="space-y-16 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-8">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                      Intelligence Hub
                    </h2>
                    <p className="text-slate-400 font-bold text-sm mt-3 tracking-tight">
                      Center node status updated at{" "}
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Node
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    label="Total Registry"
                    value={stats.totalStudents}
                    sub="Students"
                    icon={<Users />}
                  />
                  <StatCard
                    label="Active Nodes"
                    value={stats.activeStudents}
                    sub="Authorized"
                    icon={<ShieldCheck />}
                  />
                  <StatCard
                    label="Monthly Rev"
                    value={formatCurrency(stats.monthlyCollections)}
                    sub="Cleared"
                    icon={<TrendingUp />}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent admissions */}
                  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                        Recent Admissions
                      </h3>
                      <Link
                        to="/dashboard/students"
                        className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {stats.recentStudents.length === 0 ? (
                        <p className="text-sm text-slate-400 font-semibold">
                          No recent admissions.
                        </p>
                      ) : (
                        stats.recentStudents.map((s) => (
                          <div
                            key={s._id}
                            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">
                                {(s.name || "S").charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900 leading-none">
                                  {s.name}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                                  {s.batch || "—"}
                                </p>
                              </div>
                            </div>

                            <span className="text-[10px] font-black text-slate-200">
                              #{s.roll_number ?? "—"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Control card */}
                  <div className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col justify-between group">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">
                        Operational Forecast
                      </h3>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm">
                        Revenue distribution and batch health metrics are
                        synchronized across your cloud node.
                      </p>
                    </div>

                    <div className="mt-10 flex gap-4">
                      <button
                        onClick={refresh}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        Refresh Node
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/* Sidebar Link */
const SidebarLink = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
      ${
        active
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
          : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
      }
    `}
  >
    <span
      className={`${active ? "text-blue-400" : "text-slate-400"} transition-colors`}
    >
      {icon}
    </span>
    <span className="text-[12px] font-black tracking-tight">{label}</span>
  </Link>
);

const StatCard = ({ label, value, sub, icon }) => (
  <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:border-blue-200 transition-all">
    <div className="flex items-start justify-between mb-6">
      <div className="p-3 bg-slate-50 rounded-xl text-slate-900 border border-slate-100">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
        {sub}
      </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
      {value}
    </p>
  </div>
);

export default CoachingDashboard;
