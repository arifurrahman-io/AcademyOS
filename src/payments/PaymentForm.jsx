import React, { useState } from "react";
import { paymentService } from "../services/payment.service";
import Button from "../components/Button";
import { formatCurrency } from "../utils/format";
import {
  Wallet,
  Calendar,
  CheckCircle2,
  CreditCard,
  Landmark,
  ArrowUpRight,
} from "lucide-react";

/**
 * @desc    Modern Compact Payment Processing Form
 * Optimized for high-speed ledger entry within modals.
 */
const PaymentForm = ({ student, onSuccess }) => {
  const [formData, setFormData] = useState({
    student_id: student._id,
    amount: student.monthly_fee || "",
    month: "",
    method: "Cash",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const months = [
    "January-2026",
    "February-2026",
    "March-2026",
    "April-2026",
    "May-2026",
    "June-2026",
    "July-2026",
    "August-2026",
    "September-2026",
    "October-2026",
    "November-2026",
    "December-2026",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await paymentService.collectFee(formData);
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || "Transaction authorization failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
    >
      {/* 1. COMPACT IDENTITY HEADER */}
      <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-[1.5rem] text-white shadow-lg">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-blue-400 border border-white/10">
          {student.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Target Node
          </p>
          <p className="text-sm font-black truncate tracking-tight uppercase">
            {student.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            Base Rate
          </p>
          <p className="text-xs font-black text-blue-400">
            ৳{student.monthly_fee}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[11px] font-bold flex items-center gap-2 uppercase tracking-tight">
          <div className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
          {error}
        </div>
      )}

      {/* 2. TRANSACTION PARAMETERS */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Calendar size={12} /> Billing Period
          </label>
          <div className="relative group">
            <select
              required
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none cursor-pointer"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
            >
              <option value="">Select Cycle</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-blue-500 transition-colors">
              <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Wallet size={12} /> Amount (BDT)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-500 text-xs">
                ৳
              </span>
              <input
                type="number"
                required
                className="w-full pl-8 pr-4 py-4 bg-blue-50/30 border-none rounded-2xl text-lg font-black text-blue-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Landmark size={12} /> Gateway
            </label>
            <select
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none cursor-pointer"
              value={formData.method}
              onChange={(e) =>
                setFormData({ ...formData, method: e.target.value })
              }
            >
              <option value="Cash">Physical Cash</option>
              <option value="bKash">bKash Digital</option>
              <option value="Card">Card Terminal</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. AUTHORIZATION ACTION */}
      <Button
        type="submit"
        isLoading={loading}
        className="w-full py-5 rounded-[1.5rem] bg-slate-900 hover:bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 group"
      >
        Authorize Entry{" "}
        <CheckCircle2
          size={16}
          className="group-hover:scale-110 transition-transform"
        />
      </Button>

      <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        Registry Entry will be permanent on node confirmation.
      </p>
    </form>
  );
};

export default PaymentForm;
