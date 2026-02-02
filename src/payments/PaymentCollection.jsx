import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Wallet,
  Calendar,
  Search,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  X,
  BadgeCheck,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import Loader from "../components/Loader";

/**
 * @desc    Modern Compact Revenue Terminal
 * Optimized for high-speed fee collection and duplicate prevention.
 */
const PaymentCollection = () => {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchTerm] = useState("");

  const currentYear = new Date().getFullYear();
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

  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    month: "",
    payment_type: "monthly_tuition",
    method: "Cash",
  });

  useEffect(() => {
    loadRegistry();
  }, [location.state]);

  const loadRegistry = async () => {
    try {
      const res = await studentService.getAll();
      const list = res.data || [];
      setStudents(list);

      const incomingId = location.state?.studentId;
      if (incomingId) {
        const target = list.find((s) => s._id === incomingId);
        if (target) handleStudentSelect(target);
      }
    } catch (err) {
      toast.error("Cloud registry sync failed");
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    setFormData((prev) => ({
      ...prev,
      student_id: student._id,
      amount: student.monthly_fee || 0,
    }));

    try {
      const historyRes = await paymentService.getHistoryByStudent(student._id);
      setPaymentHistory(historyRes.data || []);
    } catch (err) {
      console.error("History node offline");
    }
  };

  const isAlreadyPaid = (month) => {
    const period = `${month}-${currentYear}`;
    return paymentHistory.some((p) => p.month === period);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentService.collectFee(formData);
      toast.success("Transaction authorized");
      handleStudentSelect(selectedStudent);
      setFormData((prev) => ({ ...prev, month: "" }));
    } catch (err) {
      toast.error("Authorization failed");
    } finally {
      setLoading(false);
    }
  };

  if (students.length === 0 && !selectedStudent) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* 1. COMPACT SEARCH & DISCOVERY (Visible when no student selected) */}
      {!selectedStudent ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                <Receipt size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Revenue <span className="text-blue-600">Terminal</span>
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Secure Fee Authorization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                Trial Node Active
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
            <div className="relative group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />
              <input
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                placeholder="Search node registry by name..."
                value={searchQuery}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              {students
                .filter((s) =>
                  s.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .slice(0, 4)
                .map((s) => (
                  <button
                    key={s._id}
                    onClick={() => handleStudentSelect(s)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {s.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-[900] text-slate-800 uppercase tracking-tight">
                          {s.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                          ID: {s.roll_number}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-6 animate-in slide-in-from-top-4 duration-500">
          {/* 2. SELECTED IDENTITY CARD (Side Column) */}
          <div className="md:col-span-2 space-y-6">
            <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400"
              >
                <X size={16} />
              </button>

              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black text-blue-400 border border-white/10">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    Authorized Node
                  </p>
                  <h3 className="text-xl font-black tracking-tighter uppercase leading-none">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                    ID: {selectedStudent.roll_number}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      Std. Monthly Fee
                    </span>
                    <span className="text-lg font-black text-blue-400">
                      ৳{selectedStudent.monthly_fee}
                    </span>
                  </div>
                  <BadgeCheck size={24} className="text-emerald-500" />
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>

          {/* 3. TRANSACTION TERMINAL (Main Column) */}
          <div className="md:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Calendar size={12} /> Period ({currentYear})
                  </label>
                  <select
                    required
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none"
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                  >
                    <option value="">Select Month</option>
                    {months.map((m) => {
                      const paid = isAlreadyPaid(m);
                      return (
                        <option
                          key={m}
                          value={`${m}-${currentYear}`}
                          disabled={paid}
                        >
                          {m} {paid ? "— PAID ✓" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Wallet size={12} /> Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-500 text-xs">
                      ৳
                    </span>
                    <input
                      required
                      className="w-full pl-8 pr-4 py-4 bg-blue-50/30 border-none rounded-2xl text-xl font-black text-blue-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Fee Category
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none"
                    value={formData.payment_type}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_type: e.target.value })
                    }
                  >
                    <option value="monthly_tuition">Monthly Tuition</option>
                    <option value="admission_fee">Admission Fee</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Gateway Method
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none"
                    value={formData.method}
                    onChange={(e) =>
                      setFormData({ ...formData, method: e.target.value })
                    }
                  >
                    <option value="Cash">Physical Cash</option>
                    <option value="bKash">bKash Digital</option>
                  </select>
                </div>
              </div>

              {formData.month && isAlreadyPaid(formData.month.split("-")[0]) ? (
                <div className="w-full py-6 bg-slate-50 text-slate-400 rounded-2xl border-2 border-dashed border-slate-100 font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                  <Lock size={14} /> Node Restricted: Period Already Cleared
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    "Syncing..."
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Authorize Ledger Entry{" "}
                      <ArrowUpRight
                        size={14}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCollection;
