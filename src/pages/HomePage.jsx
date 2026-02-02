import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Users,
  CreditCard,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Students & Admissions",
      desc: "Add, search, and manage students with a clean workflow and fast access to profiles.",
      color: "blue",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Fees & Payments",
      desc: "Collect fees, track dues, generate defaulter lists, and keep a complete payment history.",
      color: "emerald",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Multi-Center Ready",
      desc: "Manage multiple coaching centers from one platform with structured roles and access control.",
      color: "indigo",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Secure Role-Based Access",
      desc: "Separate Super Admin and Coaching Admin/Teacher access with protected routes.",
      color: "rose",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Operational Overview",
      desc: "See key information quickly with dashboards designed for daily admin operations.",
      color: "amber",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Modern Experience",
      desc: "Responsive UI, clean components, and scalable structure built for long-term growth.",
      color: "sky",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 selection:text-indigo-900">
      {/* ADVANCED BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-gradient-to-br from-indigo-100/50 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-gradient-to-br from-blue-100/50 to-transparent blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-1.5 text-xs font-bold text-indigo-600 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-1000">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AcademyOS 2.0 — The Future of Coaching Management
            </div>

            <h1 className="max-w-4xl text-4xl font-[900] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Manage your institute with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Superpowers.
                </span>
                <span className="absolute bottom-2 left-0 h-3 w-full bg-indigo-100 -z-10 rounded-full opacity-50"></span>
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
              Eliminate paperwork. Automate fees. Scale your coaching business
              with a multi-tenant platform designed for maximum operational
              efficiency.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:ring-4 ring-slate-900/10 active:scale-95"
              >
                Launch Your Center
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
              >
                Sign In
              </Link>
            </div>

            {/* Platform Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 grayscale opacity-60">
              <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                <Zap size={14} /> Fast Response
              </div>
              <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                <Lock size={14} /> End-to-End Secure
              </div>
              <div className="flex items-center gap-2 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                <Globe size={14} /> Multi-Tenant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className="group relative rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 transition-colors group-hover:bg-indigo-600 group-hover:text-white`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 font-medium">
                  {f.desc}
                </p>

                {/* Visual indicator of complexity */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 w-12 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-2/3 bg-indigo-500 rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Enterprise Logic
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - NEW GLASS DESIGN */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 sm:p-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
              <div className="grid grid-cols-12 h-full w-full">
                {[...Array(144)].map((_, i) => (
                  <div
                    key={i}
                    className="border-[0.5px] border-white h-full w-full"
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-black text-white sm:text-5xl">
                Ready to digitize your campus?
              </h2>
              <p className="max-w-xl text-slate-400 font-medium">
                Join hundreds of educators using AcademyOS to simplify their
                daily operations. No complex setups, just pure management.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row pt-4">
                <Link
                  to="/register"
                  className="rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-900 uppercase tracking-widest transition-transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/start"
                  className="rounded-2xl bg-white/10 px-8 py-4 text-sm font-black text-white backdrop-blur-md uppercase tracking-widest transition-transform hover:bg-white/20"
                >
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFINED FOOTER */}
      <footer className="border-t border-slate-100 bg-white/50 py-12 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                Academy<span className="text-indigo-600">OS</span>
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Modern Node Orchestration
              </p>
            </div>

            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Link className="transition-colors hover:text-indigo-600" to="/">
                Home
              </Link>
              <Link
                className="transition-colors hover:text-indigo-600"
                to="/login"
              >
                Portal
              </Link>
              <Link
                className="transition-colors hover:text-indigo-600"
                to="/register"
              >
                Provision
              </Link>
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              © {new Date().getFullYear()} Enterprise v2.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
