import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";
import Button from "../components/Button";

/**
 * @desc    Modern Compact Login Portal
 * High-density UI for multi-tenant node access.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });

      const userData = response.data;
      const token = response.token;
      const trialExpired = response.trialExpired || false;

      if (!userData || !userData.role) {
        throw new Error("User node identity missing");
      }

      setAuth(userData, token, trialExpired);

      if (userData.role === "super-admin") {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF] px-4 py-12 selection:bg-blue-100">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-10">
        {/* Logo & Technical Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3.5 bg-slate-900 rounded-2xl text-white shadow-2xl shadow-slate-200 animate-in zoom-in duration-500">
            <ShieldCheck size={28} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-[950] text-slate-900 tracking-tighter uppercase">
              Academy<span className="text-blue-600">OS</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              Gateway Authorization
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-100 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8">
            <h3 className="text-xl font-[900] text-slate-900 tracking-tight">
              Welcome Back
            </h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Identity Sync Required
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-2xl text-[11px] font-black uppercase tracking-tight flex items-center gap-3 animate-in shake duration-500">
              <Activity size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-1.5 group">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Access Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@institute.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Security Secret
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-[9px] font-black text-blue-600 hover:text-slate-900 uppercase tracking-widest transition-colors"
                >
                  Recovery?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border-none rounded-xl text-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-5 rounded-[1.5rem] bg-slate-900 hover:bg-blue-600 text-white font-[900] uppercase tracking-[0.2em] text-[11px] shadow-xl active:scale-[0.97] transition-all flex items-center justify-center gap-2 group"
              >
                Sync with Dashboard{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
              No registered node?{" "}
              <Link
                to="/register"
                className="font-black text-blue-600 hover:text-slate-900 transition-colors underline decoration-blue-100 underline-offset-4"
              >
                Provision Now
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
            <Activity size={12} /> System Status: Online
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            &copy; 2026 AcademyOS Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
