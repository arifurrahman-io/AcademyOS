import React, { useEffect, useState } from 'react';
import { 
  History, Search, Download, Filter, 
  CreditCard, Calendar, User, ArrowRight 
} from 'lucide-react';
import api from '../services/api';
import { formatDate, formatCurrency } from '../utils/format';
import Loader from '../components/Loader';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments/history');
        // Ensure we are targeting the nested data array from the response
        setPayments(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Ledger sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    p.student_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.student_id?.roll_number?.includes(searchTerm)
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-12 animate-in fade-in duration-700">
      
      {/* Refined Minimalist Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <History size={14} /> Center Ledger
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Transaction <span className="text-slate-300 font-medium">History</span>
        </h1>
      </header>

      {/* Modern Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-medium shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all"
            placeholder="Filter by name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center p-4 bg-slate-900 text-white rounded-[1.25rem] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
          <Download size={20} />
        </button>
      </div>

      {/* Minimalist List Flow */}
      <div className="space-y-4">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((p) => (
            <div key={p._id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-100 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center font-black group-hover:bg-slate-900 group-hover:text-white transition-all">
                  {p.student_id?.name?.charAt(0) || <User size={20}/>}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-none mb-1.5">{p.student_id?.name || 'External Entry'}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll: {p.student_id?.roll_number || 'N/A'}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(p.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="text-left md:text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Period</p>
                  <p className="text-xs font-black text-slate-600 flex items-center gap-2">
                    <Calendar size={12} className="text-slate-300" /> {p.month}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Volume</p>
                  <p className="text-xl font-black text-blue-600 tracking-tighter">
                    {formatCurrency(p.amount)}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                    <CreditCard size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <History size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No transaction nodes discovered</p>
          </div>
        )}
      </div>

      {/* Minimalist Bento Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-slate-50">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Entries</p>
          <p className="text-3xl font-black text-slate-900">{filteredPayments.length}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Volume</p>
          <p className="text-3xl font-black text-blue-600">
            {formatCurrency(filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0))}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Sync</p>
          <p className="text-3xl font-black text-slate-200">2026 Node</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;