import React, { useState } from 'react';
import { reportService } from '../services/report.service';
import Button from '../components/Button';
import { AlertCircle, Download, Calendar, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const DefaulterReport = () => {
  const currentYear = new Date().getFullYear(); // 2026
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const [month, setMonth] = useState(`${months[new Date().getMonth()]}-${currentYear}`);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Hits GET /api/v1/payments/defaulters
      await reportService.downloadDefaulterReport(month);
      toast.success(`Defaulter audit for ${month} generated`);
    } catch (error) {
      toast.error("Cloud node failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest">
          <AlertCircle size={14} /> Critical Audit Terminal
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Defaulter <span className="text-slate-300 font-medium">Registry</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Compliance</p>
      </header>

      {/* Main Control Bento */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all space-y-10">
        
        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div className="p-4 bg-white rounded-2xl text-rose-500 shadow-sm">
            <ShieldAlert size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Objective</p>
            <p className="text-sm font-bold text-slate-600 leading-tight">
              Identify and export student nodes with uncleared billing for the selected period.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Target Billing Period ({currentYear})
            </label>
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map(m => (
                  <option key={m} value={`${m}-${currentYear}`}>{m} {currentYear}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            variant="danger" 
            onClick={handleDownload} 
            isLoading={loading}
            className="w-full py-6 bg-slate-900 hover:bg-rose-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Download size={18} /> Synchronize & Export
          </Button>
        </div>
      </div>

      {/* Security Disclaimer */}
      <div className="px-10 py-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose text-center">
          Notice: This report contains sensitive financial data. Ensure local storage complies with coaching node security protocols.
        </p>
      </div>
    </div>
  );
};

export default DefaulterReport;