import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  Download,
  Filter,
  CreditCard,
  Calendar,
  User,
  ArrowUpRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import api from "../services/api";
import { formatDate, formatCurrency } from "../utils/format";
import Loader from "../components/Loader";

/**
 * @desc    Modern Compact Transaction Ledger
 * High-density UI for professional financial orchestration.
 */
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments/history");
        setPayments(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Ledger sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.student_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.student_id?.roll_number?.includes(searchTerm),
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* 1. COMPACT DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Center <span className="text-blue-600">Ledger</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Transaction Node History
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Verified Nodes
            </span>
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* 2. GLASS SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search registry by name or roll..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* 3. HIGH-DENSITY LEDGER FLOW */}
      <div className="space-y-2">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((p) => (
            <div
              key={p._id}
              className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Visual Avatar */}
                <div className="w-10 h-10 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl flex items-center justify-center text-xs font-black group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                  {p.student_id?.name?.charAt(0) || <User size={16} />}
                </div>

                {/* Identity Info */}
                <div className="flex flex-col">
                  <p className="text-xs font-[900] text-slate-900 uppercase tracking-tight leading-none mb-1">
                    {p.student_id?.name || "External Entry"}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>ID: {p.student_id?.roll_number || "N/A"}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{formatDate(p.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Meta */}
              <div className="flex items-center gap-6 md:gap-12">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                    Billing Period
                  </span>
                  <p className="text-[10px] font-black text-slate-600 flex items-center gap-1.5 uppercase">
                    <Calendar size={10} className="text-blue-400" /> {p.month}
                  </p>
                </div>

                <div className="flex flex-col items-end min-w-[100px]">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">
                    Authorized Volume
                  </span>
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <p className="text-sm font-[900] tracking-tighter tabular-nums">
                      {formatCurrency(p.amount)}
                    </p>
                    <ArrowUpRight
                      size={10}
                      className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                <div className="p-2 bg-slate-50 text-slate-300 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all border border-transparent group-hover:border-emerald-100">
                  <CreditCard size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 opacity-30 grayscale">
            <Activity size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">
              No node activity discovered
            </p>
          </div>
        )}
      </div>

      {/* 4. COMPACT BENTO ANALYTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900 rounded-[2.5rem] text-white shadow-xl">
        <div className="space-y-1">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Authorized Logs
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">
              {filteredPayments.length}
            </span>
            <span className="text-[10px] font-bold text-blue-400">
              Verified
            </span>
          </div>
        </div>

        <div className="space-y-1 border-l border-white/10 pl-4 md:pl-6">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Gross Volume
          </p>
          <p className="text-2xl font-black text-blue-400 tabular-nums">
            ৳
            {filteredPayments
              .reduce((sum, p) => sum + (p.amount || 0), 0)
              .toLocaleString()}
          </p>
        </div>

        <div className="hidden md:block space-y-1 border-l border-white/10 pl-6">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Network Status
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">2026</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
        </div>

        <div className="hidden md:block space-y-1 border-l border-white/10 pl-6">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Node Health
          </p>
          <p className="text-2xl font-black text-slate-400">Stable</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
