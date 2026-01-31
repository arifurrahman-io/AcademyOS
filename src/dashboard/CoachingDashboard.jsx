import React, { useEffect, useState, useCallback } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  AlertCircle,
  LayoutDashboard,
  Menu,
  LogOut,
  Plus,
  CreditCard,
  History,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Search,
  Settings,
  Activity,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import TrialStatus from "../subscriptions/TrialStatus";
import Loader from "../components/Loader";
import { formatCurrency } from "../utils/format";

const CoachingDashboard = () => {
  const { user, logout: authLogout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    monthlyCollections: 0,
    recentStudents: [],
  });

  const isOverview = location.pathname === "/dashboard";

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
      toast.error("Registry synchronization failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOverview) fetchDashboardData();
    else setLoading(false);
  }, [isOverview, fetchDashboardData]);

  const handleLogout = () => {
    authLogout();
    toast.success("Session terminated");
    navigate("/login");
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden selection:bg-blue-100 selection:text-blue-700">
      {/* Ultra-Minimal Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">
                AcademyOS
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active={isOverview}
            />
            <SidebarLink
              to="/dashboard/students"
              icon={<Users size={18} />}
              label="Registry"
              active={location.pathname.includes("students")}
            />
            <SidebarLink
              to="/dashboard/payments/history"
              icon={<History size={18} />}
              label="Ledger"
              active={location.pathname === "/dashboard/payments/history"}
            />
            <SidebarLink
              to="/dashboard/payments/defaulters"
              icon={<AlertCircle size={18} />}
              label="Audit"
              active={location.pathname === "/dashboard/payments/defaulters"}
            />

            <div className="h-px bg-slate-100 my-6 mx-4" />

            <SidebarLink
              to="/dashboard/setup"
              icon={<Settings size={18} />}
              label="Setup"
              active={location.pathname.includes("setup")}
            />
            <SidebarLink
              to="/upgrade"
              icon={<CreditCard size={18} />}
              label="Billing"
              active={location.pathname === "/upgrade"}
            />
          </nav>

          {/* Profile Switcher */}
          <div className="p-4 border-t border-slate-50">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-slate-900 truncate tracking-tight">
                  {user?.name}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Dynamic Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 flex items-center justify-between px-8 bg-white/50 backdrop-blur-xl shrink-0 z-30 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Global search..."
                className="bg-transparent border-none text-[12px] focus:ring-0 w-48 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/students/new"
              className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest"
            >
              <Plus size={14} /> Enroll
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-12">
            <TrialStatus />
            <Outlet context={{ stats, refresh: fetchDashboardData }} />

            {isOverview && (
              <div className="space-y-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                {/* Header Section */}
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
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                    Live Node
                  </div>
                </div>

                {/* Minimalist Metrics Bento */}
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
                  {/* Recent Feed */}
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
                      {stats.recentStudents.map((s) => (
                        <div
                          key={s._id}
                          className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-none">
                                {s.name}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                                {s.batch}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-200">
                            #{s.roll_number}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Control */}
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
                        onClick={fetchDashboardData}
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

/* --- Minimalist Components --- */

const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
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
