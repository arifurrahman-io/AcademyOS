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
  MessageSquare,
  ExternalLink,
  Plus,
  Minus,
} from "lucide-react";
import logo from "../assets/academyos-logo.png";
import hero from "../assets/hero-new.png";

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Default Bangla
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const isBN = lang === "bn";

  const YEARLY_PRICE = 1200;

  // ✅ set html class for font switching (your CSS uses html.lang-en)
  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;

    if (isBN) root.classList.remove("lang-en");
    else root.classList.add("lang-en");

    // optional: proper lang attribute for accessibility
    root.setAttribute("lang", isBN ? "bn" : "en");
  }, [isBN]);

  const t = useMemo(
    () => ({
      nav: {
        features: isBN ? "ফিচার" : "Features",
        pricing: isBN ? "মূল্য" : "Pricing",
        faq: isBN ? "প্রশ্নোত্তর" : "FAQ",
        contact: isBN ? "যোগাযোগ" : "Contact",
        portalAccess: isBN ? "পোর্টাল" : "Portal",
      },

      hero: {
        badge: isBN
          ? "নতুন নোড ইনফ্রাস্ট্রাকচার সক্রিয়"
          : "New Node Infrastructure Active",
        title1: isBN ? "কোচিং ম্যানেজমেন্ট" : "Coaching management",
        title2: isBN ? "সহজ ও দ্রুত" : "easy & fast",
        title3: isBN ? "AcademyOS দিয়ে।" : "with AcademyOS.",
        desc: isBN
          ? "একটি মাল্টি-টেন্যান্ট প্ল্যাটফর্ম—স্টুডেন্ট লাইফসাইকেল, ব্যাচ ট্র্যাকিং এবং রেভিনিউ টার্মিনাল একসাথে। এলিট ইনস্টিটিউটের জন্য ডিজাইন করা।"
          : "A multi-tenant platform used to manage student lifecycles, from simple batch tracking to complex revenue terminals. Designed for elite institutes.",
        ctaPrimary: isBN ? "শুরু করুন" : "Start Now",
        ctaSecondary: isBN ? "ডেমো দেখুন" : "Watch the demo",
      },

      sections: {
        coreTitleA: isBN ? "উল্লেখযোগ্য" : "Main",
        coreTitleB: isBN ? "ফিচারসমূহ" : "Features",
        systemOnline: isBN ? "সিস্টেম অনলাইন" : "System Online",

        pricingBadge: isBN ? "এন্টারপ্রাইজ নোড" : "Enterprise Node",
        pricingTitleA: isBN ? "ইয়ারলি" : "Yearly",
        pricingTitleB: isBN ? "প্রো" : "Pro",
        pricingSub: isBN ? "/ নোড / বছর" : "/ Node / Yr",
        pricingBtn: isBN ? "ইনস্ট্যান্স চালু করুন" : "Provision Instance",

        faqBadge: isBN ? "সাপোর্ট" : "Support",
        faqTitleA: isBN ? "সাধারণ" : "General",
        faqTitleB: isBN ? "জিজ্ঞাসা" : "Queries",
        faqDesc: isBN
          ? "AcademyOS মাল্টি-টেন্যান্ট আর্কিটেকচার, ডিপ্লয়মেন্ট এবং সিকিউরিটি সম্পর্কে গুরুত্বপূর্ণ তথ্য।"
          : "Technical insights into the AcademyOS multi-tenant architecture, deployment cycles, and security.",
        kbTitle: isBN ? "নলেজ বেস v2.4" : "Knowledge Base v2.4",
        kbStatus: isBN ? "সব সিস্টেম সিঙ্কড" : "All Systems Synced",

        contactBadge: isBN ? "যোগাযোগ করুন" : "Get in Touch",
        contactTitle: isBN ? "লাগবে?" : "Need a",
        contactTitle2: isBN ? "সেটআপ ডেমো" : "Setup Demo",
        contactDesc: isBN
          ? "আপনার কোচিং সেন্টার কনফিগার করতে আমাদের ইউনিট সাহায্য করবে।"
          : "Our infrastructure unit is available to help you to configure your coaching node.",
        phoneLabel: isBN ? "ফোন সাপোর্ট" : "Phone Support",
        emailLabel: isBN ? "সিস্টেম ইমেইল" : "System Email",

        ctaRightTitle: isBN ? "আজই শুরু করুন।" : "Start Today.",
        ctaRightDesc: isBN
          ? "কোচিং সেন্টার কনফিগার করুন, স্টুডেন্ট এড করুন, ফি কালেক্ট করুন—প্রফেশনাল রিপোর্টিং সহ।"
          : "Configure your coaching center, enroll students, and collect fees with professional reporting in minutes.",
        registerNow: isBN ? "রেজিস্টার করুন" : "Register Now",
        portal: isBN ? "পোর্টাল" : "Portal Access",

        footerTop: isBN ? "উপরে" : "Top",
        footerPortal: isBN ? "পোর্টাল" : "Portal",
        footerNode: isBN ? "নোড" : "Node",
        footerCopy: isBN
          ? "© ২০২৬ ইনফ্রাস্ট্রাকচার ইউনিট"
          : "© 2026 INFRASTRUCTURE UNIT",
      },

      pricing: {
        bullets: isBN
          ? [
              "আনলিমিটেড স্টুডেন্ট",
              "PDF রিপোর্ট",
              "RBAC কন্ট্রোল",
              "ইনস্ট্যান্ট সিঙ্ক",
            ]
          : [
              "Unlimited Students",
              "PDF Reports",
              "RBAC Control",
              "Instant Sync",
            ],
        techTitle: isBN ? "টেকনিক্যাল স্পেকস" : "Technical Specs",
        techFooter: isBN
          ? "ডাটা আইসোলেশন প্রটোকল সক্রিয়: রেজিস্ট্রি ক্লাস্টার v2.4 সুরক্ষা চালু।"
          : "Data isolation protocol active: Registry cluster v2.4 protection enabled.",
      },
    }),
    [isBN],
  );

  const coreFeatures = useMemo(
    () => [
      {
        icon: <Users size={24} />,
        title: "Student Lifecycle",
        titleBn: "স্টুডেন্ট লাইফসাইকেল",
        desc: "Orchestrate registry with high-density profiles, batch transitions, and historical logs. Keep every detail of the student journey synchronized.",
        descBn:
          "হাই-ডেনসিটি প্রোফাইল, ব্যাচ ট্রানজিশন এবং হিস্টোরিক্যাল লগসহ রেজিস্ট্রি ম্যানেজ করুন। স্টুডেন্ট জার্নির প্রতিটি ডিটেইল সিঙ্ক থাকবে।",
        tag: "REGISTRY",
        tagBn: "রেজিস্ট্রি",
        color: "from-blue-600/20 via-indigo-500/10 to-transparent",
        status: "Operational",
        statusBn: "চলমান",
        metrics: "Live Data Node",
        metricsBn: "লাইভ ডাটা নোড",
        featureId: "01",
      },
      {
        icon: <CreditCard size={24} />,
        title: "Revenue Terminal",
        titleBn: "রেভিনিউ টার্মিনাল",
        desc: "Automated ledger tracking and due monitoring with secure TrxID verification for bKash and Nagad payment gateways.",
        descBn:
          "অটোমেটেড লেজার ট্র্যাকিং এবং ডিউ মনিটরিং—bKash/Nagad ট্রানজ্যাকশনের জন্য সিকিউর TrxID ভেরিফিকেশন সহ।",
        tag: "FINANCE",
        tagBn: "ফাইন্যান্স",
        color: "from-emerald-600/20 via-teal-500/10 to-transparent",
        status: "Synced",
        statusBn: "সিঙ্কড",
        metrics: "Ledger Active",
        metricsBn: "লেজার অ্যাক্টিভ",
        featureId: "02",
      },
      {
        icon: <FileBarChart size={24} />,
        title: "Audit Exports",
        titleBn: "অডিট এক্সপোর্ট",
        desc: "Generate professional, audit-grade PDF reports for revenue statements and rosters instantly. Ready for digital or print distribution.",
        descBn:
          "রেভিনিউ স্টেটমেন্ট ও রোস্টারের জন্য প্রফেশনাল, অডিট-গ্রেড PDF রিপোর্ট এক ক্লিকে। ডিজিটাল বা প্রিন্টের জন্য প্রস্তুত।",
        tag: "REPORTING",
        tagBn: "রিপোর্টিং",
        color: "from-rose-600/20 via-orange-500/10 to-transparent",
        status: "Ready",
        statusBn: "প্রস্তুত",
        metrics: "PDF Engine v2",
        metricsBn: "PDF ইঞ্জিন v2",
        featureId: "03",
      },
    ],
    [],
  );

  const proFeatures = useMemo(
    () => [
      {
        icon: <Database size={18} />,
        text: "Isolated Data Node",
        textBn: "আইসোলেটেড ডাটা নোড",
      },
      {
        icon: <Fingerprint size={18} />,
        text: "RBAC Security",
        textBn: "RBAC সিকিউরিটি",
      },
      {
        icon: <Server size={18} />,
        text: "Cloud Architecture",
        textBn: "ক্লাউড আর্কিটেকচার",
      },
      { icon: <Lock size={18} />, text: "Token Auth", textBn: "টোকেন অথ" },
      {
        icon: <Zap size={18} />,
        text: "Instant Sync",
        textBn: "ইনস্ট্যান্ট সিঙ্ক",
      },
      {
        icon: <PhoneCall size={18} />,
        text: "Priority Support",
        textBn: "প্রায়োরিটি সাপোর্ট",
      },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        q: "Is AcademyOS architecture multi-tenant ready?",
        qBn: "AcademyOS কি মাল্টি-টেন্যান্ট আর্কিটেকচারের জন্য প্রস্তুত?",
        a: "Absolutely. AcademyOS is engineered as a multi-tenant infrastructure. Each coaching center operates on an isolated data node, ensuring complete privacy, security, and independent database logic for every instance.",
        aBn: "অবশ্যই। AcademyOS মাল্টি-টেন্যান্ট ইনফ্রাস্ট্রাকচার হিসেবে তৈরি। প্রতিটি কোচিং সেন্টার আলাদা ডাটা নোডে চলে—পূর্ণ প্রাইভেসি, সিকিউরিটি এবং ইনডিপেনডেন্ট ডাটাবেস লজিক নিশ্চিত।",
      },
      {
        q: "How is the subscription verification handled?",
        qBn: "সাবস্ক্রিপশন ভেরিফিকেশন কীভাবে হয়?",
        a: "The process is streamlined: Center Admins submit digital payment proofs (Method, Sender Number, and TrxID). Our Super Admin node verifies the transaction protocol, activating full yearly access within minutes.",
        aBn: "প্রসেসটি সহজ: সেন্টার অ্যাডমিন পেমেন্ট প্রুফ সাবমিট করে (Method, Sender Number, TrxID)। সুপার অ্যাডমিন নোড ভেরিফাই করে কয়েক মিনিটের মধ্যেই ইয়ারলি অ্যাক্সেস অ্যাক্টিভ করে।",
      },
      {
        q: "Does the system support mobile orchestration?",
        qBn: "মোবাইলে কি সিস্টেমটি সহজে ব্যবহার করা যাবে?",
        a: "Yes. All administrative dashboards are built with a 'mobile-first' responsive architecture. Furthermore, the underlying API is designed to integrate seamlessly with future React Native mobile deployments.",
        aBn: "হ্যাঁ। সব ড্যাশবোর্ড ‘মোবাইল-ফার্স্ট’ রেস্পন্সিভ। পাশাপাশি API এমনভাবে ডিজাইন করা—ভবিষ্যতে React Native অ্যাপের সাথে সহজে ইন্টিগ্রেট হবে।",
      },
      {
        q: "What kind of audit reporting is available?",
        qBn: "কোন ধরনের রিপোর্ট/অডিট এক্সপোর্ট পাবো?",
        a: "The system features a professional PDF engine. You can instantly generate and export student rosters, detailed revenue ledgers, and monthly defaulter statements—all formatted for professional audits or printing.",
        aBn: "সিস্টেমে প্রফেশনাল PDF ইঞ্জিন আছে। স্টুডেন্ট রোস্টার, ডিটেইলড লেজার, মাসিক ডিফল্টার স্টেটমেন্ট—সবকিছু অডিট/প্রিন্টের জন্য রেডি ফরম্যাটে এক্সপোর্ট করা যায়।",
      },
      {
        q: "Is my center's data backed up and secure?",
        qBn: "আমার সেন্টারের ডাটা কি সিকিউর এবং ব্যাকআপ থাকে?",
        a: "Data integrity is our priority. Every node benefits from secure token-based authentication (JWT) and role-based access control (RBAC), ensuring only authorized personnel can sync with your center's data.",
        aBn: "ডাটা ইন্টিগ্রিটি আমাদের প্রাইওরিটি। JWT টোকেন অথ এবং RBAC ব্যবস্থায় কেবল অথরাইজড ইউজাররাই আপনার সেন্টারের ডাটায় অ্যাক্সেস/সিঙ্ক করতে পারে।",
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
              className={`text-xs font-black transition-colors duration-500 ${
                isOpen ? "text-indigo-600" : "text-slate-300"
              }`}
            >
              0{index}
            </span>
            <h3
              className={`text-[13px] md:text-[15px] font-[900] tracking-tight leading-tight transition-colors duration-500 ${
                isOpen ? "text-slate-900" : "text-slate-700"
              }`}
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

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 md:px-8 pb-8 ml-10 md:ml-16">
            <div className="h-px w-full bg-slate-100 mb-6" />
            <p className="text-[13px] md:text-[15px] text-slate-500 font-medium leading-relaxed">
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

  // Optional: close mobile menu when language changes
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div
      id="top"
      className="relative min-h-screen bg-[#F8FAFF] text-slate-900 selection:bg-indigo-100 overflow-x-hidden font-sans"
    >
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
      <nav className="sticky top-0 z-50 px-4 py-4 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 font-bangla">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => scrollTo("#top")}
            className="flex items-center gap-3"
            aria-label="Go to top"
          >
            <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
            <div className="text-left hidden sm:block">
              <div className="text-xl font-[1000] tracking-tighter uppercase leading-none">
                Academy<span className="text-indigo-600">OS</span>
              </div>
              <div className="text-[13px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {isBN ? "ইনফ্রাস্ট্রাকচার ইউনিট" : "Infrastructure Unit"}
              </div>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { key: "features", label: t.nav.features },
              { key: "pricing", label: t.nav.pricing },
              { key: "faq", label: t.nav.faq },
              { key: "contact", label: t.nav.contact },
            ].map((link) => (
              <button
                key={link.key}
                onClick={() => scrollTo(`#${link.key}`)}
                className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </button>
            ))}

            {/* ✅ Language Switch */}
            <button
              onClick={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
              aria-label="Toggle language"
            >
              {isBN ? "BN ✓" : "EN ✓"} <span className="text-slate-300">|</span>{" "}
              {isBN ? "EN" : "BN"}
            </button>

            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all text-[13px] font-black uppercase tracking-widest shadow-xl"
            >
              {t.nav.portalAccess}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-black uppercase tracking-widest"
              aria-label="Toggle language"
            >
              {isBN ? "BN" : "EN"}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-900"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen ? (
          <div className="md:hidden mt-4 px-2 pb-3">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-3 grid grid-cols-2 gap-2">
                {[
                  { key: "features", label: t.nav.features },
                  { key: "pricing", label: t.nav.pricing },
                  { key: "faq", label: t.nav.faq },
                  { key: "contact", label: t.nav.contact },
                ].map((link) => (
                  <button
                    key={link.key}
                    onClick={() => {
                      scrollTo(`#${link.key}`);
                      setMobileOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-50 text-slate-700 text-[13px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-700 transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-slate-100">
                <Link
                  to="/login"
                  className="block w-full text-center px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all text-[13px] font-black uppercase tracking-widest shadow-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.nav.portalAccess}
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </nav>

      {/* 3. HERO */}
      <header className="relative px-6 pt-24 pb-32 md:pt-40 md:pb-56 overflow-hidden font-bangla">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-indigo-100/40 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[0%] left-[10%] w-[30rem] h-[30rem] bg-rose-100/30 blur-[100px] rounded-full opacity-60" />

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
          <div className="text-left space-y-8 md:space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-5 py-2 text-xs font-bold text-indigo-600 shadow-lg border border-indigo-50">
              <Sparkles size={16} /> {t.hero.badge}
            </div>

            <h1 className="text-3xl md:text-5xl font-[1000] tracking-tight leading-[1.1] text-slate-900">
              {t.hero.title1} <br />
              <span className="text-indigo-600">{t.hero.title2}</span> <br />
              <span className="relative inline-block">
                {t.hero.title3}
                <div className="absolute bottom-2 left-0 w-full h-3 bg-indigo-100 -z-10 rounded-full" />
              </span>
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
              {t.hero.desc}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                to="/register"
                className="px-10 py-5 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-slate-900 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 flex items-center gap-2"
              >
                {t.hero.ctaPrimary} <ArrowRight size={20} />
              </Link>

              {/* <button className="flex items-center gap-3 text-slate-900 font-bold text-base hover:text-indigo-600 transition-colors group">
                <div className="h-12 w-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-indigo-600 transition-colors">
                  <Zap size={20} className="fill-current" />
                </div>
                {t.hero.ctaSecondary}
              </button> */}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-[float_5s_infinite_ease-in-out]">
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={hero}
                  alt="hero-image"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
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
        className="px-6 py-28 bg-white border-y border-slate-100 overflow-hidden font-bangla"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl md:text-5xl font-[1000] tracking-tighter leading-none">
              {t.sections.coreTitleA}{" "}
              <span className="text-indigo-600 italic">
                {t.sections.coreTitleB}
              </span>
            </h2>
            <div className="hidden sm:flex items-center gap-3 text-[13px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              {t.sections.systemOnline}
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

                  <span className="text-[13px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    {isBN ? f.tagBn : f.tag} {isBN ? "প্রটোকল" : "PROTOCOL"}
                  </span>

                  <h3 className="text-2xl font-[1000] uppercase mt-2 mb-4 tracking-tighter">
                    {isBN ? f.titleBn : f.title}
                  </h3>

                  <p className="text-slate-600 text-base leading-relaxed font-medium italic mb-8">
                    {isBN ? f.descBn : f.desc}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-200/50">
                  <span className="text-[13px] font-black text-slate-400 uppercase tracking-widest">
                    {isBN ? f.metricsBn : f.metrics}
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
      <section id="pricing" className="px-6 py-28 relative font-bangla">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl">
            <div className="p-12 sm:p-20 text-white space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[13px] font-black text-blue-400 uppercase tracking-widest">
                <Sparkles size={12} /> {t.sections.pricingBadge}
              </div>

              <h2 className="text-4xl font-[1000] uppercase tracking-tighter leading-none">
                {t.sections.pricingTitleA}{" "}
                <span className="text-blue-400">
                  {t.sections.pricingTitleB}
                </span>
              </h2>

              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-[1000] tracking-tighter text-blue-400">
                  ৳{YEARLY_PRICE}
                </span>
                <span className="text-slate-500 font-black uppercase text-[13px] tracking-[0.2em]">
                  {t.sections.pricingSub}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {t.pricing.bullets.map((tItem) => (
                  <div
                    key={tItem}
                    className="flex items-center gap-3 text-sm font-bold text-slate-300"
                  >
                    <CheckCircle2 size={18} className="text-emerald-400" />{" "}
                    {tItem}
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="block w-full py-5 rounded-2xl bg-white text-slate-900 font-[1000] uppercase text-center text-xs tracking-[0.2em] hover:bg-blue-400 transition-all shadow-xl"
              >
                {t.sections.pricingBtn}
              </Link>
            </div>

            <div className="p-12 sm:p-20 bg-white/5 backdrop-blur-3xl border-l border-white/5 flex flex-col justify-center space-y-10">
              <h4 className="text-[13px] font-black text-blue-400 uppercase tracking-[0.4em]">
                {t.pricing.techTitle}
              </h4>

              <div className="grid grid-cols-2 gap-8">
                {proFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-blue-400 shrink-0">{feat.icon}</div>
                    <span className="text-[14px] font-[900] text-slate-200 uppercase tracking-widest leading-tight">
                      {isBN ? feat.textBn : feat.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest italic">
                  {t.pricing.techFooter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section
        id="faq"
        className="px-4 sm:px-6 py-20 md:py-32 bg-white border-y border-slate-100 relative overflow-hidden font-bangla"
      >
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-50/50 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4 space-y-6 md:sticky md:top-32 h-fit">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[13px] font-black uppercase tracking-widest">
                <MessageSquare size={14} /> {t.sections.faqBadge}
              </div>

              <h2 className="text-3xl md:text-5xl font-[1000] uppercase tracking-tighter leading-[0.9] text-slate-900">
                {t.sections.faqTitleA} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  {t.sections.faqTitleB}
                </span>
              </h2>

              <p className="text-lg md:text-xl text-slate-500 font-medium italic leading-relaxed max-w-sm">
                {t.sections.faqDesc}
              </p>

              <div className="pt-8 hidden lg:block">
                <div className="p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                  <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    {t.sections.kbTitle}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-tight">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    {t.sections.kbStatus}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {faqs.map((f, idx) => (
                <FAQItem
                  key={idx}
                  question={isBN ? f.qBn : f.q}
                  answer={isBN ? f.aBn : f.a}
                  index={idx + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT */}
      <section
        id="contact"
        className="px-4 sm:px-6 py-20 md:py-32 bg-[#F8FAFF] font-bangla"
      >
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.5rem] md:rounded-[4rem] bg-white border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 md:p-20 space-y-8 md:space-y-10">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[13px] font-black uppercase tracking-widest">
                  <MessageSquare size={14} /> {t.sections.contactBadge}
                </div>

                <h3 className="text-3xl md:text-5xl font-[1000] tracking-tighter uppercase leading-[0.9] text-slate-900">
                  {t.sections.contactTitle2} <br className="hidden sm:block" />{" "}
                  {t.sections.contactTitle}
                </h3>

                <p className="text-base md:text-lg text-slate-500 font-medium italic leading-relaxed">
                  {t.sections.contactDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: <Phone size={20} />,
                    label: t.sections.phoneLabel,
                    val: "01684516151",
                    href: "tel:01684516151",
                  },
                  {
                    icon: <Mail size={20} />,
                    label: t.sections.emailLabel,
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
                      <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
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

            <div className="p-10 sm:p-12 md:p-20 bg-slate-900 text-white flex flex-col justify-center text-center space-y-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative z-10 space-y-6">
                <h4 className="text-3xl md:text-4xl lg:text-5xl font-[1000] uppercase tracking-tighter leading-tight italic">
                  {t.sections.ctaRightTitle}
                </h4>
                <p className="text-slate-400 text-sm md:text-base font-medium italic max-w-md mx-auto">
                  {t.sections.ctaRightDesc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link
                  to="/register"
                  className="px-8 md:px-10 py-4 md:py-5 bg-white text-slate-900 rounded-xl font-[1000] uppercase text-xs tracking-widest hover:bg-blue-400 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  {t.sections.registerNow} <ExternalLink size={16} />
                </Link>
                <Link
                  to="/login"
                  className="px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white border border-white/20 rounded-xl font-[1000] uppercase text-xs tracking-widest hover:bg-white/20 transition-all active:scale-95"
                >
                  {t.sections.portal}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-16 bg-white border-t border-slate-100 font-bangla">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 opacity-60">
            <LayoutDashboard size={24} className="text-slate-900" />
            <span className="text-lg font-[1000] tracking-tighter uppercase">
              AcademyOS
            </span>
          </div>

          <div className="flex gap-5 text-[13px] font-black uppercase tracking-[0.3em] text-slate-400">
            {/* <button
              onClick={() => scrollTo("#top")}
              className="hover:text-indigo-600 transition-colors"
            >
              {t.sections.footerTop}
            </button> */}
            <Link
              to="/login"
              className="hover:text-indigo-600 transition-colors"
            >
              {t.sections.footerPortal}
            </Link>
            <Link
              to="/register"
              className="hover:text-indigo-600 transition-colors"
            >
              {t.sections.footerNode}
            </Link>
            <span>{t.sections.footerCopy}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
