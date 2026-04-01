import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Edit3,
  Trash2,
  ChevronLeft,
  Wallet,
  Receipt,
  AlertCircle,
  Hash,
  Layers,
  Activity,
  ReceiptIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import { formatDate, formatCurrency } from "../utils/format";
import Loader from "../components/Loader";
import ConfirmModal from "../components/ConfirmModal";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const [studentRes, historyRes] = await Promise.allSettled([
          studentService.getById(id),
          paymentService.getHistoryByStudent(id),
        ]);

        if (studentRes.status === "fulfilled")
          setStudent(studentRes.value.data);
        if (historyRes.status === "fulfilled")
          setHistory(historyRes.value.data || []);
      } catch (err) {
        toast.error("Profile synchronization failed");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullProfile();
  }, [id]);

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await studentService.delete(id);
      toast.success("Student deleted from registry");
      navigate("/dashboard/students");
    } catch (e) {
      toast.error("Delete operation failed");
      setIsDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;
  if (!student) return <NotFoundState />;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20 font-bangla">
      {/* MODERN DELETE MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleting}
        title="Delete Student Record"
        message={`Warning: You are about to permanently delete ${student.name}. This will erase all associated transaction history.`}
      />

      {/* TOP NAVIGATION BAR */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-all"
        >
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 shadow-sm transition-all">
            <ChevronLeft size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">
              Return
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">
              Registry Explorer
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dashboard/students/edit/${id}`)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm active:scale-95"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl hover:bg-rose-100 hover:border-rose-200 transition-all shadow-sm active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>

      {/* MAIN GRID CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT COLUMN: IDENTITY & SPECS */}
        <div className="lg:col-span-4 space-y-6">
          {/* PRIMARY IDENTITY CARD */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 text-center shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent -z-10 group-hover:from-blue-50 transition-colors duration-500" />

            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-slate-200 border-8 border-white">
                {student.name?.charAt(0)}
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className={`absolute -bottom-1 -right-1 p-3 rounded-2xl border-4 border-white shadow-lg ${
                  student.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                }`}
              >
                <ShieldCheck size={20} className="text-white" />
              </motion.div>
            </div>

            <h2 className="text-3xl font-[950] text-slate-900 uppercase tracking-tighter leading-tight mb-2">
              {student.name}
            </h2>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full mb-8">
              <Hash size={12} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Roll: {student.roll_number}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-[1.5rem] text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Layers size={10} /> Level
                </p>
                <p className="text-sm font-black text-slate-700 uppercase">
                  {student.class_level}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-[1.5rem] text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Activity size={10} /> Batch
                </p>
                <p className="text-sm font-black text-slate-700 uppercase">
                  {student.batch}
                </p>
              </div>
            </div>
          </motion.div>

          {/* CONTACT INFORMATION */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 space-y-6"
          >
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Phone size={12} className="text-blue-500" /> Metadata Registry
            </h3>
            <div className="space-y-4">
              <div className="group">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">
                  Phone Link
                </p>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                  <Phone size={18} className="text-blue-400" />
                  <p className="text-sm font-black tracking-widest">
                    {student.phone || "UNREGISTERED"}
                  </p>
                </div>
              </div>
              <div className="group">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 ml-1">
                  Enrollment Date
                </p>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
                  <Calendar size={18} className="text-emerald-400" />
                  <p className="text-sm font-black tracking-widest uppercase">
                    {formatDate(student.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FINANCIAL PROFILE */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6"
          >
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <Wallet size={12} className="text-blue-600" /> Revenue Node
            </h3>
            <div className="space-y-4">
              <div className="relative p-5 bg-blue-600 rounded-[2rem] text-white overflow-hidden shadow-xl shadow-blue-100">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
                  Monthly Subscription
                </p>
                <p className="text-2xl font-[950] tracking-tighter">
                  {formatCurrency(student.monthly_fee)}
                </p>
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                  <Wallet size={80} />
                </div>
              </div>
              <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Admission Fee
                </p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">
                  {formatCurrency(student.admission_fee)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: TRANSACTION LEDGER */}
        <div className="lg:col-span-8">
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-200 rounded-[3.5rem] p-6 sm:p-10 shadow-sm min-h-[600px] flex flex-col"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-[950] text-slate-900 uppercase tracking-tight">
                    Ledger Matrix
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
                    Validated Payments Only
                  </p>
                </div>
              </div>
              <div className="px-5 py-2 bg-slate-900 rounded-2xl text-white">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {history.length} ACTIVE LOGS
                </span>
              </div>
            </div>

            <div className="space-y-4 custom-scrollbar pr-2 overflow-y-auto flex-1">
              {history.length > 0 ? (
                <AnimatePresence>
                  {history.map((payment, index) => (
                    <motion.div
                      key={payment._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                          <CheckCircle2 size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                            {payment.month}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-lg">
                              {payment.method}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {formatDate(payment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            {formatCurrency(payment.amount)}
                          </span>
                          <ArrowUpRight
                            size={18}
                            className="text-emerald-500"
                          />
                        </div>
                        <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-[0.2em] mt-1">
                          Status: Verified
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="p-8 bg-slate-50 rounded-[3rem] text-slate-200 mb-6 border border-dashed border-slate-200">
                    <Clock size={64} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-slate-400 uppercase tracking-tighter">
                      Zero Logs Detected
                    </p>
                    <p className="text-xs text-slate-300 max-w-[280px] font-bold uppercase leading-relaxed">
                      This student node has no historical financial transactions
                      in the ledger.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-8 bg-rose-50 text-rose-500 rounded-[3rem] mb-8 shadow-xl shadow-rose-100/50"
    >
      <AlertCircle size={64} />
    </motion.div>
    <h2 className="text-4xl font-[950] text-slate-900 uppercase tracking-tighter mb-3">
      Registry Error
    </h2>
    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed mb-10">
      The targeted student node ID does not match any known records in the cloud
      registry.
    </p>
    <Link
      to="/dashboard/students"
      className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
    >
      Return to Registry{" "}
      <ArrowUpRight
        size={18}
        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
      />
    </Link>
  </div>
);

export default StudentProfile;
