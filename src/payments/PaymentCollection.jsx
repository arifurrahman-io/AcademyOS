import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Wallet, Calendar, Search, CheckCircle2, 
  ShieldCheck, Lock, ArrowRight, X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../services/student.service';
import { paymentService } from '../services/payment.service';
import Loader from '../components/Loader';

const PaymentCollection = () => {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchTerm] = useState('');
  
  const currentYear = new Date().getFullYear(); // 2026
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    month: '',
    payment_type: 'monthly_tuition',
    method: 'Cash'
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
        const target = list.find(s => s._id === incomingId);
        if (target) handleStudentSelect(target);
      }
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    setFormData(prev => ({
      ...prev,
      student_id: student._id,
      amount: student.monthly_fee || 0
    }));

    try {
      const historyRes = await paymentService.getHistoryByStudent(student._id);
      setPaymentHistory(historyRes.data || []);
    } catch (err) {
      console.error("History fetch error");
    }
  };

  const isAlreadyPaid = (month) => {
    const period = `${month}-${currentYear}`;
    return paymentHistory.some(p => p.month === period);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentService.collectFee(formData);
      toast.success("Payment Recorded");
      handleStudentSelect(selectedStudent);
      setFormData(prev => ({ ...prev, month: '' }));
    } catch (err) {
      toast.error("Failed to authorize");
    } finally {
      setLoading(false);
    }
  };

  if (students.length === 0 && !selectedStudent) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      
      {/* Trial Status */}
      <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-blue-500" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
            Free Trial: 7 Days Remaining
          </span>
        </div>
        <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Upgrade</button>
      </div>

      <header className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Collect <span className="text-slate-300 font-medium">Fee</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Revenue Terminal</p>
      </header>

      {!selectedStudent ? (
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
              placeholder="Search student profile..."
              value={searchQuery}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {students
              .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 5)
              .map(s => (
                <button 
                  key={s._id}
                  onClick={() => handleStudentSelect(s)}
                  className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-slate-100 transition-all group"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">ID: {s.roll_number}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
          
          {/* Selected Resident */}
          <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl text-blue-400">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Authorized Resident</p>
                <p className="text-lg font-black tracking-tight leading-none">{selectedStudent.name}</p>
              </div>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period ({currentYear})</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold appearance-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={formData.month}
                    onChange={e => setFormData({...formData, month: e.target.value})}
                  >
                    <option value="">Choose Month</option>
                    {months.map(m => {
                      const paid = isAlreadyPaid(m);
                      return (
                        <option key={m} value={`${m}-${currentYear}`} disabled={paid}>
                          {m} {paid ? '— PAID ✓' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <Calendar size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (BDT)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-blue-500 text-lg">৳</span>
                  <input 
                    required
                    className="w-full pl-12 pr-6 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl text-2xl font-black text-blue-700 outline-none focus:border-blue-500 transition-all shadow-inner"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select 
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-blue-500 transition-all" 
                  value={formData.payment_type} 
                  onChange={e => setFormData({...formData, payment_type: e.target.value})}
                >
                  <option value="monthly_tuition">Monthly Tuition</option>
                  <option value="admission_fee">Admission Fee</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
                <select 
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-blue-500 transition-all" 
                  value={formData.method} 
                  onChange={e => setFormData({...formData, method: e.target.value})}
                >
                  <option value="Cash">Cash Currency</option>
                  <option value="bKash">bKash Digital</option>
                </select>
              </div>
            </div>

            {formData.month && isAlreadyPaid(formData.month.split('-')[0]) ? (
              <div className="w-full py-8 bg-slate-50 text-slate-400 rounded-[2rem] border-2 border-dashed border-slate-200 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                <Lock size={16} /> Transaction Locked: Already Cleared
              </div>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-7 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                {loading ? "Authorizing..." : <><CheckCircle2 size={18} className="inline mr-2" /> Authorize Transaction</>}
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentCollection;