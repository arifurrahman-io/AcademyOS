import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  CreditCard,
  FileBarChart,
  Database,
  Fingerprint,
  Server,
  Lock,
  Zap,
  PhoneCall,
  Menu,
  CheckCircle2,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Activity,
  MessageSquare,
  ExternalLink,
  Plus,
  Minus,
  ShieldCheck,
  Globe,
} from "lucide-react";
import logo from "../assets/academyos-logo.png";
import hero from "../assets/hero-new.png";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const YEARLY_PRICE = 1200;

  const coreFeatures = useMemo(
    () => [
      {
        icon: <Users size={24} />,
        title: "Student Lifecycle",
        desc: "Orchestrate registry with high-density profiles, batch transitions, and historical logs. Keep every detail of the student journey synchronized.",
        tag: "REGISTRY",
        color: "from-blue-600/20 via-indigo-500/10 to-transparent",
        status: "Operational",
        metrics: "Live Data Node",
        featureId: "01",
      },
      {
        icon: <CreditCard size={24} />,
        title: "Revenue Terminal",
        desc: "Automated ledger tracking and due monitoring with secure TrxID verification for bKash and Nagad payment gateways.",
        tag: "FINANCE",
        color: "from-emerald-600/20 via-teal-500/10 to-transparent",
        status: "Synced",
        metrics: "Ledger Active",
        featureId: "02",
      },
      {
        icon: <FileBarChart size={24} />,
        title: "Audit Exports",
        desc: "Generate professional, audit-grade PDF reports for revenue statements and rosters instantly. Ready for digital or print distribution.",
        tag: "REPORTING",
        color: "from-rose-600/20 via-orange-500/10 to-transparent",
        status: "Ready",
        metrics: "PDF Engine v2",
        featureId: "03",
      },
    ],
    [],
  );

  const proFeatures = useMemo(
    () => [
      { icon: <Database size={18} />, text: "Isolated Data Node" },
      { icon: <Fingerprint size={18} />, text: "RBAC Security" },
      { icon: <Server size={18} />, text: "Cloud Architecture" },
      { icon: <Lock size={18} />, text: "Token Auth" },
      { icon: <Zap size={18} />, text: "Instant Sync" },
      { icon: <PhoneCall size={18} />, text: "Priority Support" },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        q: "Is AcademyOS architecture multi-tenant ready?",
        a: "Absolutely. AcademyOS is engineered as a multi-tenant infrastructure. Each coaching center operates on an isolated data node, ensuring complete privacy, security, and independent database logic for every instance.",
      },
      {
        q: "How is the subscription verification handled?",
        a: "The process is streamlined: Center Admins submit digital payment proofs (Method, Sender Number, and TrxID). Our Super Admin node verifies the transaction protocol, activating full yearly access within minutes.",
      },
      {
        q: "Does the system support mobile orchestration?",
        a: "Yes. All administrative dashboards are built with a 'mobile-first' responsive architecture. Furthermore, the underlying API is designed to integrate seamlessly with future React Native mobile deployments.",
      },
      {
        q: "What kind of audit reporting is available?",
        a: "The system features a professional PDF engine. You can instantly generate and export student rosters, detailed revenue ledgers, and monthly defaulter statements—all formatted for professional audits or printing.",
      },
      {
        q: "Is my center's data backed up and secure?",
        a: "Data integrity is our priority. Every node benefits from secure token-based authentication (JWT) and role-based access control (RBAC), ensuring only authorized personnel can sync with your center's data.",
      },
    ],
    [],
  );

  function FAQItem({ question, answer, index }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div
        className={`group rounded-[2rem] border transition-all duration-500 ${
          isOpen
            ? "bg-white border-indigo-200 shadow-2xl shadow-indigo-100"
            : "bg-slate-50 border-slate-100 hover:border-indigo-100 hover:bg-white"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
        >
          <div className="flex items-center gap-5 md:gap-8">
            <span
              className={`text-xs font-black transition-colors duration-500 ${isOpen ? "text-indigo-600" : "text-slate-300"}`}
            >
              0{index}
            </span>
            <h3
              className={`text-lg md:text-xl font-[900] tracking-tight leading-tight transition-colors duration-500 ${isOpen ? "text-slate-900" : "text-slate-700"}`}
            >
              {question}
            </h3>
          </div>

          <div
            className={`shrink-0 h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
              isOpen
                ? "bg-indigo-600 border-indigo-600 text-white rotate-180"
                : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
          </div>
        </button>

        {/* Expandable Content Section */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 md:px-8 pb-8 ml-10 md:ml-16">
            <div className="h-px w-full bg-slate-100 mb-6" />
            <p className="text-base md:text-lg text-slate-500 font-medium italic leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scrollTo = (href) => {
    const id = href.replace("#", "");
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFF] text-slate-900 selection:bg-indigo-100 overflow-x-hidden font-sans">
      {/* 1. TECHNICAL BACKGROUND */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-200/20 blur-[120px] rounded-full animate-pulse" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="sticky top-0 z-50 px-4 py-4 backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => scrollTo("#top")}
            className="flex items-center gap-3"
          >
            <img src={logo} alt="Logo" className="h-15 w-15 object-contain" />
            <div className="text-left hidden sm:block">
              <div className="text-xl font-[1000] tracking-tighter uppercase leading-none">
                Academy<span className="text-indigo-600">OS</span>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Infrastructure Unit
              </div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-10">
            {["Features", "Pricing", "FAQ", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(`#${link.toLowerCase()}`)}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {link}
              </button>
            ))}
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all text-[11px] font-black uppercase tracking-widest shadow-xl"
            >
              Portal Access
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-900"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* 3. HERO: VIBRANT 3D PORTAL DESIGN */}
      <header className="relative px-6 pt-24 pb-32 md:pt-40 md:pb-56 overflow-hidden">
        {/* --- 3D AMBIENT BACKGROUND --- */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Soft Mesh Gradients inspired by the image */}
          <div className="absolute top-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-indigo-100/40 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[0%] left-[10%] w-[30rem] h-[30rem] bg-rose-100/30 blur-[100px] rounded-full opacity-60" />

          {/* Animated Floating Assets - Use your 3D assets or Lucide icons with glass backgrounds */}
          <div className="hidden lg:block absolute top-[25%] left-[8%] animate-[float_6s_infinite_ease-in-out]">
            <div className="p-6 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl rotate-[-12deg]">
              <Users size={48} className="text-indigo-600" />
            </div>
          </div>

          <div className="hidden lg:block absolute bottom-[20%] left-[25%] animate-[float_8s_infinite_ease-in-out_reverse]">
            <div className="p-5 bg-white/30 backdrop-blur-xl rounded-full border border-white/50 shadow-xl">
              <CreditCard size={32} className="text-blue-500" />
            </div>
          </div>

          {/* Stylized Path Arrow like the Brainskuy image */}
          <svg
            className="absolute top-[40%] right-[15%] w-64 opacity-20 hidden xl:block"
            viewBox="0 0 200 100"
            fill="none"
          >
            <path
              d="M0 80C50 80 70 20 120 20C170 20 190 50 200 50"
              stroke="url(#grad)"
              strokeWidth="3"
              strokeDasharray="8 8"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="200" y2="0">
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT SIDE: Content */}
          <div className="text-left space-y-8 md:space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-5 py-2 text-xs font-bold text-indigo-600 shadow-lg border border-indigo-50">
              <Sparkles size={16} /> New Node Infrastructure Active
            </div>

            <h1 className="text-3xl md:text-5xl font-[1000] tracking-tight leading-[1.1] text-slate-900">
              Coaching management <br />
              <span className="text-indigo-600">easy & fast</span> with <br />
              <span className="relative inline-block">
                AcademyOS.
                <div className="absolute bottom-2 left-0 w-full h-3 bg-indigo-100 -z-10 rounded-full" />
              </span>
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              A multi-tenant platform used to manage student lifecycles, from
              simple batch tracking to complex revenue terminals. Designed for
              elite institutes.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                to="/register"
                className="px-10 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-slate-900 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 flex items-center gap-2"
              >
                Start Now <ArrowRight size={20} />
              </Link>

              <button className="flex items-center gap-3 text-slate-900 font-bold text-base hover:text-indigo-600 transition-colors group">
                <div className="h-12 w-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-600 transition-colors">
                  <Zap size={20} className="fill-current" />
                </div>
                Watch the demo
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: 3D Visualization Placeholder */}
          <div className="relative hidden lg:block">
            {/* If you have a 3D character/object like the Brainskuy image, place it here */}
            <div className="relative z-10 animate-[float_5s_infinite_ease-in-out]">
              <div className="w-full aspect-square  flex items-center justify-center overflow-hidden">
                <img
                  src={hero}
                  alt="hero-image"
                  className="h-full w-full object-contain "
                />
              </div>
            </div>
            {/* Floating Light Bulbs/Dots like in the reference image */}
            <div className="absolute top-10 right-10 w-12 h-12 bg-yellow-300 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 left-0 w-8 h-8 bg-indigo-400 rounded-full blur-lg animate-pulse delay-700" />
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                  }
                `,
          }}
        />
      </header>

      {/* 4. CORE MODULES */}
      <section
        id="features"
        className="px-6 py-28 bg-white border-y border-slate-100 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tighter leading-none">
              Core <span className="text-indigo-600 italic">Modules</span>
            </h2>
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              System Online
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((f) => (
              <div
                key={f.title}
                className="group relative p-10 rounded-[3.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-2xl flex flex-col justify-between overflow-hidden min-h-[480px]"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${f.color} transition-all duration-700`}
                />
                <div className="relative z-10">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100 mb-8 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    {f.tag} PROTOCOL
                  </span>
                  <h3 className="text-2xl font-[1000] uppercase mt-2 mb-4 tracking-tighter">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 text-base leading-relaxed font-medium italic mb-8">
                    {f.desc}
                  </p>
                </div>
                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-200/50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {f.metrics}
                  </span>
                  <ChevronRight
                    size={20}
                    className="text-indigo-600 group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section id="pricing" className="px-6 py-28 relative">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl">
            <div className="p-12 sm:p-20 text-white space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <Sparkles size={12} /> Enterprise Node
              </div>
              <h2 className="text-4xl font-[1000] uppercase tracking-tighter leading-none">
                Yearly <span className="text-blue-400">Pro</span>
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-[1000] tracking-tighter text-blue-400">
                  ৳{YEARLY_PRICE}
                </span>
                <span className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">
                  / Node / Yr
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {[
                  "Unlimited Students",
                  "PDF Reports",
                  "RBAC Control",
                  "Instant Sync",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-3 text-sm font-bold text-slate-300"
                  >
                    <CheckCircle2 size={18} className="text-emerald-400" /> {t}
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="block w-full py-5 rounded-2xl bg-white text-slate-900 font-[1000] uppercase text-center text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-xl"
              >
                Provision Instance
              </Link>
            </div>
            <div className="p-12 sm:p-20 bg-white/5 backdrop-blur-3xl border-l border-white/5 flex flex-col justify-center space-y-10">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">
                Technical Specs
              </h4>
              <div className="grid grid-cols-2 gap-8">
                {proFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-blue-400 shrink-0">{feat.icon}</div>
                    <span className="text-[11px] font-[900] text-slate-200 uppercase tracking-widest leading-tight">
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-white/5">
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest italic">
                  Data isolation protocol active: Registry cluster v2.4
                  protection enabled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section
        id="faq"
        className="px-4 sm:px-6 py-20 md:py-32 bg-white border-y border-slate-100 relative overflow-hidden"
      >
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* LEFT SIDE: Section Branding */}
            <div className="lg:col-span-4 space-y-6 md:sticky md:top-32 h-fit">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                <MessageSquare size={14} /> Support Node
              </div>
              <h2 className="text-4xl md:text-6xl font-[1000] uppercase tracking-tighter leading-[0.9] text-slate-900">
                General <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 italic">
                  Protocols
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium italic leading-relaxed max-w-sm">
                Technical insights into the AcademyOS multi-tenant architecture,
                deployment cycles, and security.
              </p>

              {/* Technical Status Indicator (Desktop Only) */}
              <div className="pt-8 hidden lg:block">
                <div className="p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Knowledge Base v2.4
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-tight">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    All Systems Synced
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive FAQ List */}
            <div className="lg:col-span-8 space-y-4">
              {faqs.map((f, idx) => (
                <FAQItem
                  key={idx}
                  question={f.q}
                  answer={f.a}
                  index={idx + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT */}
      {/* 7. CONTACT SECTION: RESPONSIVE INFRASTRUCTURE HUB */}
      <section
        id="contact"
        className="px-4 sm:px-6 py-20 md:py-32 bg-[#F8FAFF]"
      >
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.5rem] md:rounded-[4rem] bg-white border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Contact Details */}
            <div className="p-8 sm:p-12 md:p-20 space-y-8 md:space-y-10">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
                  <MessageSquare size={14} /> Get in Touch
                </div>
                <h3 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase leading-[0.9] text-slate-900">
                  Need a <br className="hidden sm:block" /> Setup Demo?
                </h3>
                <p className="text-base md:text-lg text-slate-500 font-medium italic leading-relaxed">
                  Our infrastructure unit is available to help you provision and
                  configure your coaching node.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: <Phone size={20} />,
                    label: "Phone Support",
                    val: "01684516151",
                    href: "tel:01684516151",
                  },
                  {
                    icon: <Mail size={20} />,
                    label: "System Email",
                    val: "arifurrahman.now@gmail.com",
                    href: "mailto:arifurrahman.now@gmail.com",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group"
                  >
                    <div className="p-3 bg-slate-900 text-white rounded-xl group-hover:bg-indigo-600 transition-colors">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      {" "}
                      {/* Prevents text overflow on small screens */}
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        {item.label}
                      </p>
                      <p className="text-base md:text-lg font-black text-slate-900 truncate">
                        {item.val}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column: CTA Block */}
            <div className="p-10 sm:p-12 md:p-20 bg-slate-900 text-white flex flex-col justify-center text-center space-y-8 relative overflow-hidden">
              {/* Subtle Background Pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative z-10 space-y-6">
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-[1000] uppercase tracking-tighter leading-tight italic">
                  Start Provisioning <br /> Today.
                </h4>
                <p className="text-slate-400 text-sm md:text-base font-medium italic max-w-md mx-auto">
                  Configure your coaching node, enroll students, and collect
                  fees with professional reporting in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link
                  to="/register"
                  className="px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 rounded-xl font-[1000] uppercase text-xs tracking-widest hover:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  Register Now <ExternalLink size={16} />
                </Link>
                <Link
                  to="/login"
                  className="px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white border border-white/20 rounded-xl font-[1000] uppercase text-xs tracking-widest hover:bg-white/20 transition-all active:scale-95"
                >
                  Portal Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 opacity-60">
            <LayoutDashboard size={24} className="text-slate-900" />
            <span className="text-lg font-[1000] tracking-tighter uppercase">
              AcademyOS
            </span>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <button
              onClick={() => scrollTo("#top")}
              className="hover:text-indigo-600 transition-colors"
            >
              Top
            </button>
            <Link
              to="/login"
              className="hover:text-indigo-600 transition-colors"
            >
              Portal
            </Link>
            <Link
              to="/register"
              className="hover:text-indigo-600 transition-colors"
            >
              Node
            </Link>
            <span>© 2026 INFRASTRUCTURE UNIT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
