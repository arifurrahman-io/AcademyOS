import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, School, CreditCard, Activity, LayoutDashboard, 
  Menu, X, LogOut, RefreshCw, ShieldAlert, TrendingUp 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Loader from '../components/Loader';
import { useAuthStore } from '../store/authStore';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Centralized data fetcher shared with child components via Outlet Context
  const fetchStats = async (showToast = false) => {
    if (showToast) setIsRefreshing(true);
    try {
      const res = await api.get('/subscriptions/monitor-all');
      setStats(res.data.data);
      if (showToast) toast.success('System metrics synchronized');
    } catch (err) {
      const message = err.response?.data?.message || "Connection to API failed";
      toast.error(message);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Root session terminated');
    navigate('/login');
  };

  if (loading) return <Loader fullPage />;

  // Logic to determine if we are on the main overview or a sub-page
  const isOverview = location.pathname === '/super-admin' || location.pathname === '/super-admin/dashboard';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-blue-400 tracking-tighter italic">AcademyOS</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Controller</span>
              </div>
            </div>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <SidebarLink 
              to="/super-admin/dashboard" 
              icon={<LayoutDashboard size={20} />} 
              label="Overview" 
              active={isOverview}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink 
              to="/super-admin/centers" 
              icon={<School size={20} />} 
              label="Institutes" 
              active={location.pathname === '/super-admin/centers'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarLink 
              to="/super-admin/payments" 
              icon={<CreditCard size={20} />} 
              label="Billing & Subs" 
              active={location.pathname === '/super-admin/payments'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>

          <div className="p-6 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 text-slate-400 hover:text-white hover:bg-rose-500/10 hover:text-rose-400 rounded-2xl transition-all font-bold text-sm group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Glassmorphism style */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="p-2.5 text-slate-600 lg:hidden hover:bg-slate-100 rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
               <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {isOverview ? 'Command Center' : 'Institute Management'}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Real-time Synchronization</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchStats(true)}
              disabled={isRefreshing}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 font-bold text-xs border border-slate-200"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Syncing...' : 'Sync Data'}
            </button>

            <div className="w-[1px] h-8 bg-slate-200 mx-2" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none">System Root</p>
                <p className="text-[10px] text-blue-600 font-black uppercase mt-1">Super-Admin Access</p>
              </div>
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-blue-200 transform group-hover:rotate-6 transition-transform cursor-pointer">
                  SA
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          {/* Sub-routes render here using Outlet Context to share stats and refresh logic */}
          <Outlet context={{ stats, refresh: fetchStats }} />

          {/* Root Level Dashboard Content */}
          {isOverview && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
              
              <div className="flex items-end justify-between">
                <div>
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">Network Health</h3>
                   <p className="text-slate-500 text-sm font-medium">Aggregated metrics across all coaching centers.</p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black flex items-center gap-2 border border-blue-100">
                   <TrendingUp size={14} /> +12% Growth this month
                </div>
              </div>

              {/* High-Impact Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  icon={<School />} 
                  label="Registered Centers" 
                  value={stats?.length || 0} 
                  color="blue"
                  trend="+2 new"
                />
                <StatCard 
                  icon={<Activity />} 
                  label="Live Trial Nodes" 
                  value={stats?.filter(s => !s.isExpired).length || 0} 
                  color="emerald"
                  trend="Stable"
                />
                <StatCard 
                  icon={<CreditCard />} 
                  label="Active Premium" 
                  value={stats?.filter(s => s.status === 'active').length || 0} 
                  color="purple"
                  trend="40% conversion"
                />
                <StatCard 
                  icon={<ShieldAlert />} 
                  label="System Integrity" 
                  value="100%" 
                  color="rose"
                  trend="Secured"
                />
              </div>

              {/* Bottom Info Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                    <div className="relative z-10">
                      <h4 className="text-3xl font-black mb-4">Strategic Overview</h4>
                      <p className="text-slate-400 max-w-md mb-8 font-medium">
                        All institute nodes are currently reporting healthy statuses. Multi-tenant database isolation is operating at peak efficiency.
                      </p>
                      <button className="px-8 py-4 bg-blue-600 rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30">
                        Generate System Audit
                      </button>
                    </div>
                    {/* Decorative abstract shape */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl" />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col justify-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <LayoutDashboard size={32} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">Center Logs</h4>
                  <p className="text-sm text-slate-500 font-medium mb-6">
                    Audit trials, center registrations, and payment events in the detailed management views.
                  </p>
                  <Link to="/super-admin/centers" className="text-blue-600 font-black text-sm hover:underline flex items-center gap-2">
                    Go to Registry Management &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Sidebar Navigation Link Component
const SidebarLink = ({ to, icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`
      flex items-center gap-4 p-4 rounded-2xl transition-all group relative
      ${active 
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-600/10' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
      {icon}
    </span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && (
      <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_15px_white]" />
    )}
  </Link>
);

// High-Performance Stat Card
const StatCard = ({ icon, label, value, color, trend }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 ring-blue-200/50",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-200/50",
    purple: "bg-purple-50 text-purple-600 ring-purple-200/50",
    rose: "bg-rose-50 text-rose-600 ring-rose-200/50"
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
      <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-6 ring-4 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        <span className="text-[10px] font-bold text-slate-400">{trend}</span>
      </div>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default SuperAdminDashboard;