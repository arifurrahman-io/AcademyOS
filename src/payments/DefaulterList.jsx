import React, { useState } from "react";
import { paymentService } from "../services/payment.service";
import { reportService } from "../services/report.service";
import Button from "../components/Button";
import {
  Search,
  Download,
  UserX,
  Calendar,
  Phone,
  Hash,
  ShieldAlert,
  FileCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * @desc    Modern Compact Defaulter Registry
 * Optimized for high-speed financial audits and risk mitigation.
 */
const DefaulterList = () => {
  const currentYear = 2026;
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
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getDefaulters(month);
      setDefaulters(res.data || []);
      if (res.data?.length === 0)
        toast.error("No uncleared nodes found for this period");
      else toast.success(`${res.data.length} unpaid nodes identified`);
    } catch (err) {
      toast.error("Cloud registry sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await reportService.downloadDefaulterReport(month);
      toast.success("Audit ledger generated");
    } catch (err) {
      toast.error("Export operation failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* 1. COMPACT AUDIT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
            <ShieldAlert size={20} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
              Uncleared <span className="text-rose-600">Ledger</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Financial Compliance Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
            <FileCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Audit Terminal Ready
            </span>
          </div>
        </div>
      </div>

      {/* 2. CONTROL BENTO */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Calendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={16}
          />
          <select
            className="w-full pl-11 pr-8 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase appearance-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none cursor-pointer"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={`${m}-${currentYear}`}>
                {m} {currentYear}
              </option>
            ))}
          </select>
          <ArrowUpRight
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={14} />
            )}
            Audit Registry
          </button>
          <button
            onClick={handleExport}
            disabled={defaulters.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-20"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* 3. DEFAULTER REGISTRY FLOW */}
      <div className="space-y-2">
        {defaulters.length > 0 ? (
          defaulters.map((d) => (
            <div
              key={d._id}
              className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-rose-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl flex items-center justify-center text-xs font-black group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                  <UserX size={18} />
                </div>
                <div>
                  <p className="text-xs font-[900] text-slate-900 uppercase tracking-tight leading-none mb-1">
                    {d.name}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Hash size={10} /> {d.roll_number}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{d.batch}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${d.phone || d.guardian_phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg transition-all border border-transparent hover:border-slate-800"
                >
                  <Phone size={12} /> Contact
                </a>
                <div className="p-2 text-rose-200 group-hover:text-rose-500 transition-colors">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 opacity-30 grayscale">
            <ShieldAlert size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              No defaulter nodes discovered
            </p>
          </div>
        )}
      </div>

      {/* 4. COMPACT BENTO SUMMARY */}
      {defaulters.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              Uncleared Nodes
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-rose-400">
                {defaulters.length}
              </span>
              <span className="text-[10px] font-bold text-rose-500/50 animate-pulse">
                Critical
              </span>
            </div>
          </div>

          <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              Audit Period
            </p>
            <p className="text-lg font-black text-blue-400 uppercase tracking-tighter">
              {month}
            </p>
          </div>

          <div className="hidden md:block space-y-1 border-l border-white/10 pl-6">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              Sync Health
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">100%</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
          </div>

          <div className="hidden md:block space-y-1 border-l border-white/10 pl-6 text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
              System Node
            </p>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              AcademyOS-2026
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaulterList;
