import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Users,
  CreditCard,
  Sparkles,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  LayoutDashboard,
  Database,
  FileBarChart,
  Server,
  Fingerprint,
  PhoneCall,
} from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function HomePage() {
  const coreFeatures = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Student Lifecycle",
      desc: "Comprehensive registry management from enrollment to alumni status with isolated data nodes.",
      tag: "Registry",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Revenue Terminal",
      desc: "Automated fee collection with TrxID verification for bKash, Nagad, and physical cash.",
      tag: "Finance",
    },
    {
      icon: <FileBarChart className="h-6 w-6" />,
      title: "Audit Exports",
      desc: "Generate professional PDF reports for payments, student lists, and monthly defaulters.",
      tag: "Reporting",
    },
  ];

  const proFeatures = [
    { icon: <Database size={18} />, text: "Isolated Tenant Database" },
    { icon: <Fingerprint size={18} />, text: "Role-Based Access (RBAC)" },
    { icon: <Server size={18} />, text: "99.9% Uptime SLA" },
    { icon: <Lock size={18} />, text: "256-bit AES Encryption" },
    { icon: <Zap size={18} />, text: "Instant Cloud Sync" },
    { icon: <PhoneCall size={18} />, text: "Priority Support Node" },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFBFF] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden font-sans">
      {/* 1. ANIMATED BACKGROUND INFRASTRUCTURE */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/50 shadow-2xl animate-float-slow rotate-12" />
        <div className="absolute top-[60%] right-[-5%] w-80 h-80 bg-indigo-500/5 backdrop-blur-2xl rounded-[4rem] border border-indigo-200/20 shadow-2xl animate-float-slower" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Zap className="h-5 w-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-[1000] tracking-tighter uppercase">
              Academy<span className="text-indigo-600">OS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a
              href="#features"
              className="hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-indigo-600 transition-colors"
            >
              Pricing
            </a>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all shadow-lg"
            >
              Portal Access
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <header className="px-6 pt-20 pb-24 md:pt-32 md:pb-40 text-center relative z-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-[10px] font-black text-indigo-600 shadow-xl uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            System Status: 2026 Node Cluster Active
          </div>
          <h1 className="text-6xl md:text-8xl font-[950] tracking-tighter leading-[0.9] uppercase">
            The Operating System for{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent italic">
              Academies.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed italic">
            "Eliminate administrative friction. Secure your revenue. Orchestrate
            your entire coaching institute through a single cloud-native node."
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link
              to="/register"
              className="px-10 py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
            >
              Provision Node
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:border-slate-400 transition-all active:scale-95"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* 4. FEATURES BENTO GRID */}
      <section id="features" className="px-6 py-24 bg-white relative z-10">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-[950] uppercase tracking-tighter">
              Engineered for <span className="text-indigo-600">Growth</span>
            </h2>
            <p className="text-slate-400 font-medium">
              Modular components designed to scale with your student volume.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl mb-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
                  {f.tag} Module
                </span>
                <h3 className="text-xl font-black uppercase mt-2 mb-4 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING & PRO FEATURES */}
      <section id="pricing" className="px-6 py-24 relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl">
            {/* Left: Price Card */}
            <div className="p-12 md:p-20 text-white space-y-8">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">
                  Yearly <span className="text-blue-400">Pro</span>
                </h2>
                <p className="text-slate-400 mt-2 font-medium">
                  Full infrastructure access for 365 days.
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-[1000] tracking-tighter text-blue-400">
                  {formatCurrency(1200)}
                </span>
                <span className="text-slate-500 font-black uppercase text-xs tracking-widest">
                  / Per Node
                </span>
              </div>
              <Link
                to="/register"
                className="block w-full text-center py-5 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-blue-400 transition-all shadow-xl"
              >
                Claim Instance
              </Link>
              <p className="text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest">
                Includes 7-Day unrestricted trial
              </p>
            </div>

            {/* Right: Pro Features List */}
            <div className="p-12 md:p-20 bg-white/5 backdrop-blur-3xl border-l border-white/5 space-y-8">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                System Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {proFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-blue-400">{feat.icon}</div>
                    <span className="text-xs font-black text-slate-200 uppercase tracking-tight">
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Trusted by 500+ Local Institutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA & FOOTER */}
      <footer className="px-6 py-20 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl font-[1000] tracking-tighter uppercase">
              AcademyOS
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Distributed Node Orchestration Unit
            </p>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link to="/login" className="hover:text-indigo-600">
              Login
            </Link>
            <Link to="/register" className="hover:text-indigo-600">
              Register
            </Link>
            <span className="text-slate-300">© 2026 AcademyOS Global</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
