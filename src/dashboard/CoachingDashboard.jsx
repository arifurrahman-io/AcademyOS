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
  ChevronRight,
  Activity,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import Loader from "../components/Loader";
import { formatCurrency } from "../utils/format";
import { authService } from "../services/auth.service";
import api from "../services/api";

/* -----------------------------
   Subscription helpers (Preserved)
------------------------------ */
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const daysUntil = (dateLike) => {
  if (!dateLike) return null;
  const end = new Date(dateLike);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY);
};
const formatDateStr = (dateLike) => {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const SubscriptionBanner = ({ center, onUpgradeClick }) => {
  const banner = useMemo(() => {
    if (!center) return null;
    const sub = center?.subscription || {};
    const isPaid =
      center?.subscriptionStatus === "paid" || sub?.status === "active";

    if (isPaid && sub?.endAt) {
      const remaining = daysUntil(sub.endAt);
      if (remaining !== null && remaining <= 0) {
        return {
          tone: "expired",
          title: "Subscription expired",
          body: `Your plan ended on ${formatDateStr(sub.endAt)}. Renew to restore full access.`,
          cta: "Renew Subscription",
          icon: <XCircle size={20} className="text-white" />,
        };
      }
      if (remaining !== null && remaining <= 7) {
        return {
          tone: "critical",
          title: "Subscription expiring soon",
          body: `Your plan expires in ${remaining} days. Renew now to avoid interruption.`,
          cta: "Renew Now",
          icon: <AlertTriangle size={20} className="text-rose-600" />,
        };
      }
      if (remaining !== null && remaining <= 15) {
        return {
          tone: "warning",
          title: "Upcoming renewal",
          body: `Your plan will expire in ${remaining} days. Consider renewing early.`,
          cta: "Renew",
          icon: <Clock size={20} className="text-amber-600" />,
        };
      }
      return null;
    }

    const trialEnd = center?.trialExpiryDate;
    if (trialEnd) {
      const remaining = daysUntil(trialEnd);
      if (remaining !== null && remaining <= 0) {
        return {
          tone: "expired",
          title: "Trial ended",
          body: "Your 14-day trial has ended. Subscribe to unlock all features.",
          cta: "Buy Subscription",
          icon: <XCircle size={20} className="text-white" />,
        };
      }
      if (remaining !== null && remaining <= 3) {
        return {
          tone: "critical",
          title: "Trial expiring soon",
          body: `Your trial ends in ${remaining} days. Subscribe to avoid lockout.`,
          cta: "Buy Subscription",
          icon: <AlertTriangle size={20} className="text-rose-600" />,
        };
      }
      if (remaining !== null && remaining <= 7) {
        return {
          tone: "warning",
          title: "Trial ending soon",
          body: `You have ${remaining} days left in your trial.`,
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
      wrap: "border-rose-200 bg-rose-50/80 backdrop-blur-md",
      title: "text-rose-900",
      body: "text-rose-800",
      btn: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-200",
      badge: "bg-rose-600 text-white",
    },
    warning: {
      wrap: "border-amber-200 bg-amber-50/80 backdrop-blur-md",
      title: "text-amber-900",
      body: "text-amber-800",
      btn: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-200",
      badge: "bg-amber-600 text-white",
    },
    expired: {
      wrap: "border-slate-700 bg-slate-900/90 backdrop-blur-md",
      title: "text-white",
      body: "text-slate-200",
      btn: "bg-white text-slate-900 hover:bg-slate-100",
      badge: "bg-blue-500 text-white",
    },
  };
  const theme = tones[banner.tone];

  return (
    <div
      className={`w-full rounded-[2.5rem] border p-6 mb-10 shadow-xl ${theme.wrap}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
            {banner.icon}
          </div>
          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${theme.badge}`}
            >
              Attention Required
            </span>
            <h3 className={`text-lg font-black tracking-tight ${theme.title}`}>
              {banner.title}
            </h3>
            <p className={`text-sm font-semibold opacity-80 ${theme.body}`}>
              {banner.body}
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 ${theme.btn}`}
        >
          <CreditCard size={18} /> {banner.cta}
        </button>
      </div>
    </div>
  );
};

const CoachingDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  const [chartData, setChartData] = useState([]);

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
      const res = await api.get("/coaching/me");
      setCenter(res.data?.data || null);
    } catch (err) {
      console.error("SYNC FAILED");
    }
  }, []);

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

      const monthsLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mIdx = d.getMonth();
        const year = d.getFullYear();
        const total = payments
          .filter((p) => {
            const pd = new Date(p.createdAt);
            return pd.getMonth() === mIdx && pd.getFullYear() === year;
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        last6Months.push({ name: monthsLabels[mIdx], amount: total });
      }
      setChartData(last6Months);

      const now = new Date();
      const totalPaidThisMonth = payments
        .filter((p) => {
          const d = new Date(p.createdAt);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
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
      toast.error("Sync Error");
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.allSettled([fetchCenter(), fetchDashboardData()]);
    toast.success("Identity Matrix Synchronized", {
      icon: <Zap className="text-amber-500" />,
    });
  }, [fetchCenter, fetchDashboardData]);

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      try {
        await fetchCenter();
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

  if (loading) return <Loader fullPage />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-bangla selection:bg-indigo-100 selection:text-indigo-700">
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modern High-Contrast Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transform transition-all duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <span className="text-2xl font-[1000] tracking-tighter uppercase italic">
              Academy<span className="text-blue-400">OS</span>
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Overview"
              active={isOverview}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/students"
              icon={<Users size={20} />}
              label="Registry"
              active={location.pathname.includes("/dashboard/students")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/payments/history"
              icon={<History size={20} />}
              label="Ledger"
              active={location.pathname.includes("/payments/history")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/payments/defaulters"
              icon={<AlertCircle size={20} />}
              label="Audit"
              active={location.pathname.includes("/payments/defaulters")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="h-px bg-white/5 my-8 mx-2" />
            <SidebarLink
              to="/dashboard/setup"
              icon={<Settings size={20} />}
              label="Setup"
              active={location.pathname.includes("/dashboard/setup")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink
              to="/dashboard/upgrade"
              icon={<CreditCard size={20} />}
              label="Billing"
              active={location.pathname.includes("/dashboard/upgrade")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>

          <div className="pt-8 border-t border-white/5">
            <button
              onClick={() => authService.logout()}
              className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white hover:bg-rose-600/10 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest group"
            >
              <LogOut
                size={20}
                className="group-hover:text-rose-500 transition-colors"
              />{" "}
              Logout Node
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 shadow-2xl overflow-hidden">
        <main className="flex-1 overflow-y-auto p-10 lg:p-14 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-12">
            <SubscriptionBanner
              center={center}
              onUpgradeClick={() => navigate("/dashboard/upgrade")}
            />
            <Outlet context={{ stats, refresh }} />

            {isOverview && (
              <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCard
                    label="Student Registry"
                    value={stats.totalStudents}
                    sub="Database Total"
                    icon={<Users />}
                    trend="+12%"
                    color="indigo"
                  />
                  <StatCard
                    label="Active Nodes"
                    value={stats.activeStudents}
                    sub="Authorized"
                    icon={<ShieldCheck />}
                    trend="Live"
                    color="emerald"
                  />
                  <StatCard
                    label="Monthly Revenue"
                    value={formatCurrency(stats.monthlyCollections)}
                    sub="Current Liquidity"
                    icon={<TrendingUp />}
                    trend="Rolling"
                    color="blue"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                  <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_22px_70px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700 text-indigo-600">
                      <TrendingUp size={200} />
                    </div>
                    <div className="flex items-center justify-between mb-12 relative z-10">
                      <div>
                        <h3 className="text-2xl font-[1000] text-slate-900 tracking-tighter uppercase italic leading-none">
                          Operational Forecast
                        </h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-3">
                          Monthly Collection Curve
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl shadow-inner">
                        <Activity size={24} />
                      </div>
                    </div>
                    <div className="h-[340px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="colorAmt"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#4f46e5"
                                stopOpacity={0.4}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4f46e5"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fontSize: 11,
                              fontWeight: 900,
                              fill: "#6366f1",
                            }}
                            dy={15}
                          />
                          <YAxis hide domain={["auto", "auto"]} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "24px",
                              border: "none",
                              boxShadow: "0 20px 50px rgba(79, 70, 229, 0.15)",
                              fontSize: "13px",
                              fontWeight: "900",
                              padding: "18px",
                            }}
                            cursor={{
                              stroke: "#4f46e5",
                              strokeWidth: 3,
                              strokeDasharray: "5 5",
                            }}
                            formatter={(v) => [
                              `৳${v.toLocaleString()}`,
                              "Revenue",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#4f46e5"
                            strokeWidth={6}
                            fillOpacity={1}
                            fill="url(#colorAmt)"
                            dot={{
                              r: 7,
                              fill: "#4f46e5",
                              strokeWidth: 4,
                              stroke: "#fff",
                            }}
                            activeDot={{
                              r: 10,
                              strokeWidth: 0,
                              fill: "#4f46e5",
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[11px] font-[1000] text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <Plus size={16} className="text-indigo-500" /> Latest
                          Admissions
                        </h3>
                        <Link
                          to="/dashboard/students"
                          className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                      <div className="space-y-6">
                        {stats.recentStudents.map((s) => (
                          <div
                            key={s._id}
                            className="flex items-center justify-between group cursor-default"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-slate-950 text-indigo-400 rounded-2xl flex items-center justify-center text-xs font-black shadow-lg group-hover:scale-110 transition-all">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-[13px] font-[950] text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">
                                  {s.name}
                                </p>
                                <p className="text-[9px] font-black text-slate-400 uppercase mt-2">
                                  {s.batch}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-200 group-hover:text-indigo-300 transition-colors">
                              #{s.roll_number}
                            </span>
                          </div>
                        ))}
                      </div>
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

const SidebarLink = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-5 rounded-3xl transition-all ${active ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40 translate-x-2" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}
  >
    <span
      className={`${active ? "text-white" : "text-slate-500"} transition-colors`}
    >
      {icon}
    </span>
    <span className="text-[14px] font-black tracking-tight">{label}</span>
  </Link>
);

const StatCard = ({ label, value, sub, icon, trend, color }) => {
  const styles = {
    indigo: "border-indigo-100 bg-indigo-50/20 text-indigo-600",
    emerald: "border-emerald-100 bg-emerald-50/20 text-emerald-600",
    blue: "border-blue-100 bg-blue-50/20 text-blue-600",
  }[color];

  return (
    <div
      className={`p-10 bg-white border-2 rounded-[3.5rem] shadow-xl shadow-slate-100/50 transition-all hover:scale-[1.02] group ${styles.split(" ")[0]}`}
    >
      <div className="flex items-start justify-between mb-10">
        <div
          className={`p-5 rounded-3xl shadow-inner transition-all duration-500 ${styles}`}
        >
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <div
          className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles}`}
        >
          {trend}
        </div>
      </div>
      <p className="text-[11px] font-[1000] text-slate-400 uppercase tracking-[0.25em] mb-3">
        {label}
      </p>
      <p className="text-4xl font-[1000] text-slate-900 tracking-tighter mb-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
        {sub}
      </p>
    </div>
  );
};

export default CoachingDashboard;
