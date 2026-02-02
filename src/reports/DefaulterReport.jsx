import React, { useState } from "react";
import { reportService } from "../services/report.service";
import Button from "../components/Button";
import {
  Download,
  Calendar,
  ShieldAlert,
  BadgeInfo,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * @desc    Modern Compact Defaulter Registry Node
 * Optimized for high-speed financial audits and secure PDF exports.
 */
const DefaulterReport = () => {
  const currentYear = new Date().getFullYear(); // 2026
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [month, setMonth] = useState(
    `${months[new Date().getMonth()]}-${currentYear}`,
  );
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await reportService.downloadDefaulterReport(month);
      toast.success(`Defaulter audit for ${month} generated`);
    } catch (error) {
      toast.error("Cloud registry failure during export.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* 1. COMPACT AUDIT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
            <ShieldAlert size={20} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
              Defaulter <span className="text-rose-600">Registry</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Operational Compliance Node
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
          <FileCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Audit Terminal Ready
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* 2. OBJECTIVE CARD (Side Column) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-rose-400 border border-white/10">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                  Audit Protocol
                </p>
                <h3 className="text-lg font-black tracking-tight uppercase leading-snug">
                  Registry Scrub
                </h3>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed mt-2">
                  Systematically scans all student nodes for uncleared billing
                  entries during the specified synchronization period.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-blue-400">
                  <BadgeInfo size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Verified Multi-Tenant Logic
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose text-center">
              Report node encryption:{" "}
              <span className="text-slate-600 font-black">256-AES Ready</span>
            </p>
          </div>
        </div>

        {/* 3. CONTROL TERMINAL (Main Column) */}
        <div className="md:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="space-y-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} /> Target Billing Period ({currentYear})
              </label>
              <div className="relative group">
                <select
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-3xl text-sm font-black uppercase text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m} value={`${m}-${currentYear}`}>
                      {m} {currentYear}
                    </option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                  <FileCheck size={18} />
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>

            <Button
              variant="danger"
              onClick={handleDownload}
              isLoading={loading}
              className="w-full py-6 bg-slate-900 hover:bg-rose-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              <Download
                size={18}
                className="group-hover:translate-y-0.5 transition-transform"
              />
              {loading ? "Authorizing Sync..." : "Initialize Node Export"}
            </Button>

            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Authorized personnel only. Data traces are logged per tenant
              access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaulterReport;
