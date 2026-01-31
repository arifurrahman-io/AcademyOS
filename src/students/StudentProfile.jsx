import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, Phone, Calendar, ShieldCheck, 
  Wallet, CreditCard, BookOpen, Clock, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../services/student.service';
import { paymentService } from '../services/payment.service'; // Ensure this service exists
import { formatDate, formatCurrency } from '../utils/format';
import Loader from '../components/Loader';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]); // New state for payment history
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        // Parallel fetch for student details and their specific history
        const [studentRes, historyRes] = await Promise.all([
          studentService.getById(id),
          paymentService.getHistoryByStudent(id) // Endpoint: GET /payments/student/:id
        ]);
        
        setStudent(studentRes.data);
        setHistory(historyRes.data || []);
      } catch (err) {
        toast.error("Failed to sync profile node");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullProfile();
  }, [id]);

  if (loading) return <Loader />;
  if (!student) return <NotFoundState />;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Card */}
      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl">
            {student.name.charAt(0)}
          </div>
          <div className={`absolute -bottom-2 -right-2 p-3 rounded-2xl border-4 border-white shadow-lg ${student.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            <ShieldCheck size={20} className="text-white" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{student.name}</h2>
            <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-full">
              ID: {student.roll_number}
            </span>
          </div>
          <p className="text-slate-400 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
            <BookOpen size={18} className="text-blue-500" /> {student.class_level} • {student.batch}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <User size={14} /> Personal Identity
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <InfoItem icon={<Phone size={16} />} label="Primary Contact" value={student.phone || 'N/A'} />
            <InfoItem icon={<Calendar size={16} />} label="Admission Date" value={formatDate(student.createdAt)} />
            <div className="pt-4 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Status</p>
              <StatusBadge status={student.status} />
            </div>
          </div>
        </div>

        {/* Financial Fee Profile */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl space-y-8 text-white">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <CreditCard size={14} /> Fee Profile
          </h3>
          <div className="space-y-6">
            <FeeCard label="Admission Fee" amount={student.admission_fee} color="emerald" icon={<Wallet size={20} />} />
            <FeeCard label="Monthly Tuition" amount={student.monthly_fee} color="blue" icon={<CreditCard size={20} />} />
          </div>
        </div>
      </div>

      {/* NEW: Payment History Section */}
      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock size={16} /> Transaction Ledger
          </h3>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Showing {history.length} Records
          </span>
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((payment) => (
              <div key={payment._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <CheckCircle2 size={18} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payment.method}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{payment.month}</p>
                  <p className="text-xl font-black text-slate-900">{formatCurrency(payment.amount)}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 italic">Paid on: {formatDate(payment.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No transactions found for this node</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Sub-Components for Cleanliness --- */

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-slate-800">{value}</p>
    </div>
  </div>
);

const FeeCard = ({ label, amount, color, icon }) => (
  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
    <div className="flex items-center gap-4">
      <div className={`p-3 bg-${color}-500/20 rounded-xl text-${color}-400`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black">{formatCurrency(amount || 0)}</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
    status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
  }`}>
    <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
    {status}
  </div>
);

const NotFoundState = () => (
  <div className="text-center py-20 font-black text-slate-300 uppercase tracking-widest">
    Student Record Not Found
  </div>
);

export default StudentProfile;