import React, { useState } from 'react';
import { paymentService } from '../services/payment.service';
import { reportService } from '../services/report.service';
import Button from '../components/Button';
import { 
  Search, Download, AlertCircle, 
  UserX, Calendar, Phone, Hash, 
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

const DefaulterList = () => {
  const currentYear = 2026; // System year
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const [month, setMonth] = useState(`${months[new Date().getMonth()]}-${currentYear}`);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Hits GET /api/v1/payments/defaulters
      const res = await paymentService.getDefaulters(month);
      setDefaulters(res.data || []);
      if (res.data?.length === 0) toast.error("No defaulters found for this period");
      else toast.success(`${res.data.length} unpaid nodes identified`);
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await reportService.downloadDefaulterReport(month);
      toast.success("Audit report generated");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-12 animate-in fade-in duration-700">
      
      {/* Refined Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest">
          <AlertCircle size={14} /> Critical Audit
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Defaulter <span className="text-slate-300 font-medium">List</span>
        </h1>
      </header>

      {/* Control Bento */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64 group">
          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black uppercase appearance-none focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map(m => (
              <option key={m} value={`${m}-${currentYear}`}>{m} {currentYear}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            onClick={handleSearch} 
            isLoading={loading} 
            className="flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200"
          >
            <Search size={16} className="mr-2 inline" /> Audit Node
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleExport} 
            disabled={defaulters.length === 0}
            className="flex-1 md:flex-none px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2 inline" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Defaulter Registry Flow */}
      <div className="space-y-4">
        {defaulters.length > 0 ? (
          defaulters.map((d) => (
            <div key={d._id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-rose-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-black border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all">
                  <UserX size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-none mb-1.5">{d.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Hash size={10} /> {d.roll_number}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.batch}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a href={`tel:${d.phone || d.guardian_phone}`} className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                  <Phone size={14} /> Contact Guardian
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <ShieldAlert size={48} className="mx-auto text-slate-100 mb-4" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No defaulter nodes discovered</p>
          </div>
        )}
      </div>

      {/* Minimalist Summary Footer */}
      {defaulters.length > 0 && (
        <div className="flex items-center justify-between px-10 py-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
            <p className="text-2xl font-black text-rose-600">{defaulters.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Period</p>
            <p className="text-sm font-black text-slate-900">{month}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaulterList;