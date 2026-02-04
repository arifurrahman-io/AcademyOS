import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Make sure to: npm install framer-motion
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Activity,
  Terminal,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";
import Button from "../components/Button";
import logo from "../assets/academyos-logo.png"; // Importing the logo

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
      navigate(
        userData.role === "super-admin"
          ? "/super-admin/dashboard"
          : "/dashboard",
      );
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Background Node Animation Config
  const floatingBlocks = Array.from({ length: 8 });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF] px-4 py-12 selection:bg-blue-100 overflow-hidden relative font-bangla">
      {/* Modern Animated Background Blocks */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {floatingBlocks.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              x: [
                Math.random() * 100,
                Math.random() * -100,
                Math.random() * 100,
              ],
              y: [
                Math.random() * 100,
                Math.random() * -100,
                Math.random() * 100,
              ],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bg-blue-600/10 border border-blue-500/20 rounded-3xl"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-100/40 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-100/40 blur-[140px]" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo & Navigation back to Home */}
        <Link
          to="/"
          className="flex flex-col items-center gap-4 group transition-transform active:scale-95"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
            <img
              src={logo}
              alt="AcademyOS"
              className="w-16 h-16 object-contain relative z-10 animate-in zoom-in duration-700"
            />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-[950] text-slate-900 tracking-tighter uppercase">
              Academy<span className="text-blue-600">OS</span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-4 bg-slate-200"></span>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                Node Access
              </p>
              <span className="h-px w-4 bg-slate-200"></span>
            </div>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          <div className="mb-8">
            <h3 className="text-xl font-[900] text-slate-900 tracking-tight flex items-center gap-2">
              <Terminal size={20} className="text-blue-600" /> Welcome Back
            </h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Gateway Synchronization Required
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-2xl text-[11px] font-black uppercase flex items-center gap-3"
            >
              <Activity size={16} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5 group">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Access Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@node.os"
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Encryption Secret
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-[9px] font-black text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest"
                >
                  Reset?
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
                  className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all"
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
                className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-[900] uppercase tracking-[0.25em] text-[11px] shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Authenticate Node
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
              New Instance?{" "}
              <Link
                to="/register"
                className="font-black text-blue-600 hover:text-slate-900 transition-colors"
              >
                Initialize Provisioning
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] bg-white/50 px-4 py-1.5 rounded-full border border-white shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Node Status: Active
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
            &copy; 2026 AcademyOS Core Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
