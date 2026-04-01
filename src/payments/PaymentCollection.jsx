import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  User,
  CreditCard,
  Activity,
  History,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import Loader from "../components/Loader";

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
      toast.error("Registry synchronization failed");
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
      console.error("Local ledger node inaccessible");
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
      toast.success("Transaction Ledger Authorized");
      handleStudentSelect(selectedStudent);
      setFormData((prev) => ({ ...prev, month: "" }));
    } catch (err) {
      toast.error("Authorization Node Error");
    } finally {
      setLoading(false);
    }
  };

  if (students.length === 0 && !selectedStudent) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 font-bangla">
      {/* 1. VIEW CONTROLLER: SEARCH MODE */}
      <AnimatePresence mode="wait">
        {!selectedStudent ? (
          <motion.div
            key="search-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-slate-900 text-blue-400 rounded-3xl shadow-xl shadow-slate-200">
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-[950] text-slate-900 tracking-tighter uppercase leading-none">
                    Revenue <span className="text-blue-600">Terminal</span>
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
                    Secured Financial Entry Node
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/50 rounded-2xl border border-blue-100">
                <ShieldCheck size={18} className="text-blue-600" />
                <span className="text-[10px] font-[900] uppercase tracking-widest text-blue-700">
                  Ready for Input
                </span>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-[3.5rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-8">
              <div className="relative group">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all"
                  size={20}
                />
                <input
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-blue-200 transition-all outline-none"
                  placeholder="Query student identity by name or roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {students
                  .filter(
                    (s) =>
                      s.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      s.roll_number.toString().includes(searchQuery),
                  )
                  .slice(0, 6)
                  .map((s) => (
                    <motion.button
                      whileHover={{ x: 5 }}
                      key={s._id}
                      onClick={() => handleStudentSelect(s)}
                      className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-sm font-black text-blue-400 shadow-lg group-hover:scale-110 transition-transform">
                          {s.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Roll: {s.roll_number}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </motion.button>
                  ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="transaction-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            {/* 2. IDENTITY NODE (Sidebar) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl shadow-slate-200 group">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all text-slate-400 z-20"
                >
                  <X size={18} />
                </button>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-blue-900/20">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">
                        Session Active
                      </p>
                      <h3 className="text-xl font-[950] tracking-tighter uppercase leading-none truncate max-w-[150px]">
                        {selectedStudent.name}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Class
                      </p>
                      <p className="text-xs font-black text-slate-200">
                        {selectedStudent.class_level}
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                        Roll ID
                      </p>
                      <p className="text-xs font-black text-slate-200">
                        #{selectedStudent.roll_number}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                          <Activity size={10} /> Monthly Fee
                        </span>
                        <span className="text-2xl font-[950] text-blue-400 tracking-tighter">
                          ৳{selectedStudent.monthly_fee}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                        <User size={20} className="text-slate-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* RECENT LOGS SUMMARY */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                  <History size={14} /> Node History
                </h4>
                <div className="space-y-3">
                  {paymentHistory.slice(0, 3).map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span className="text-[10px] font-black text-slate-600">
                        {p.month}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        ৳{p.amount}
                      </span>
                    </div>
                  ))}
                  {paymentHistory.length === 0 && (
                    <p className="text-center text-[10px] font-bold text-slate-300 py-4 uppercase">
                      Zero history detected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. TRANSACTION TERMINAL (Main Column) */}
            <div className="lg:col-span-8 bg-white p-8 sm:p-12 rounded-[3.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-100">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-[950] text-slate-900 tracking-tight">
                    Ledger Authorization
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Execute Financial Token Transfer
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" /> Billing
                      Period ({currentYear})
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-black uppercase text-slate-700 focus:bg-white focus:border-blue-200 transition-all outline-none appearance-none cursor-pointer"
                        value={formData.month}
                        onChange={(e) =>
                          setFormData({ ...formData, month: e.target.value })
                        }
                      >
                        <option value="">Select Target Month</option>
                        {months.map((m) => {
                          const paid = isAlreadyPaid(m);
                          return (
                            <option
                              key={m}
                              value={`${m}-${currentYear}`}
                              disabled={paid}
                            >
                              {m} {paid ? "— [ PAID ]" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Wallet size={14} className="text-emerald-500" />{" "}
                      Authorized Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-blue-500 text-xl">
                        ৳
                      </span>
                      <input
                        required
                        type="number"
                        className="w-full pl-12 pr-6 py-5 bg-blue-50/30 border-2 border-transparent rounded-2xl text-2xl font-[950] text-blue-700 focus:bg-white focus:border-blue-200 transition-all outline-none"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Fee Classification
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-[11px] font-black uppercase text-slate-700 focus:bg-white focus:border-blue-200 transition-all outline-none appearance-none"
                      value={formData.payment_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_type: e.target.value,
                        })
                      }
                    >
                      <option value="monthly_tuition">Monthly Fee</option>
                      <option value="admission_fee">One-Time Admission</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Payment Protocol
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-[11px] font-black uppercase text-slate-700 focus:bg-white focus:border-blue-200 transition-all outline-none appearance-none"
                      value={formData.method}
                      onChange={(e) =>
                        setFormData({ ...formData, method: e.target.value })
                      }
                    >
                      <option value="Cash">Physical Cash Settlement</option>
                      <option value="bKash">bKash Digital Node</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  {formData.month &&
                  isAlreadyPaid(formData.month.split("-")[0]) ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full py-6 bg-rose-50 text-rose-600 rounded-2xl border-2 border-dashed border-rose-100 font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3"
                    >
                      <Lock size={16} /> Restricted: History Shows Existing
                      Record
                    </motion.div>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !formData.month}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-[900] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/10 hover:bg-blue-600 transition-all active:scale-[0.97] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        "Syncing Ledger..."
                      ) : (
                        <>
                          <BadgeCheck size={20} className="text-blue-400" />
                          Confirm Entry
                          <ArrowUpRight
                            size={18}
                            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentCollection;
