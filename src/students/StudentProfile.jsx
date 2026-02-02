import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Phone,
  Calendar,
  ShieldCheck,
  Wallet,
  CreditCard,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { paymentService } from "../services/payment.service";
import { formatDate, formatCurrency } from "../utils/format";
import Loader from "../components/Loader";

/**
 * @desc    Modern Compact Student Node Profile
 * High-density UI designed for professional academy management.
 */
const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;
  if (!student) return <NotFoundState />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      {/* 1. COMPACT HERO IDENTITY */}
      <div className="relative overflow-hidden bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl font-black text-white border border-white/10">
              {student.name.charAt(0)}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 p-2 rounded-xl border-4 border-slate-900 ${student.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`}
            >
              <BadgeCheck size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                {student.name}
              </h2>
              <span className="inline-flex px-3 py-1 bg-white/10 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                Node ID: {student.roll_number}
              </span>
            </div>
            <p className="text-slate-400 font-bold text-sm flex items-center justify-center md:justify-start gap-2">
              <BookOpen size={14} className="text-blue-400" />{" "}
              {student.class_level} • {student.batch}
            </p>
          </div>

          <StatusBadge status={student.status} />
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 2. METADATA SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Registry Metadata
            </h3>
            <div className="space-y-4">
              <InfoItem
                icon={<Phone size={14} />}
                label="Primary Phone"
                value={student.phone || "N/A"}
              />
              <InfoItem
                icon={<Calendar size={14} />}
                label="Enrolled On"
                value={formatDate(student.createdAt)}
              />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-lg space-y-4">
            <FeeRow
              label="Admission"
              amount={student.admission_fee}
              color="emerald"
            />
            <FeeRow label="Monthly" amount={student.monthly_fee} color="blue" />
          </div>
        </div>

        {/* 3. COMPACT TRANSACTION LEDGER */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Transaction Ledger
            </h3>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              {history.length} Logs Active
            </span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {history.length > 0 ? (
              history.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-transparent rounded-2xl hover:bg-white hover:border-slate-100 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        {payment.month}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {payment.method} Gateway
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center opacity-20 grayscale">
                <Clock size={32} className="mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No node activity recorded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Compact Sub-Components --- */

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-xs font-black text-slate-800">{value}</p>
    </div>
  </div>
);

const FeeRow = ({ label, amount, color }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
      {label}
    </span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-black text-white">
        {formatCurrency(amount || 0)}
      </span>
      <ArrowUpRight size={10} className={`text-${color}-400`} />
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <div
    className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
      status === "active"
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
    }`}
  >
    <div
      className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"}`}
    />
    {status}
  </div>
);

const NotFoundState = () => (
  <div className="text-center py-20 font-black text-slate-300 uppercase tracking-widest text-xs">
    Node Registry Offline: Student Not Found
  </div>
);

export default StudentProfile;
