import React, { useState } from 'react';
import { 
  Layers, BookOpen, Plus, Trash2, Settings, 
  ShieldCheck, ArrowRight, Info 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { coachingService } from '../services/coaching.service';

const SetupCenter = () => {
  const { user, updateSettings } = useAuthStore();
  const [newClass, setNewClass] = useState('');
  const [newBatch, setNewBatch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (field, value) => {
    if (!value.trim()) return;
    setLoading(true);

    try {
      const currentSettings = user?.settings || { classes: [], batches: [] };
      const currentList = currentSettings[field] || [];

      if (currentList.includes(value.trim())) {
        toast.error(`${value} already exists`);
        return;
      }

      const updatedSettings = {
        ...currentSettings,
        [field]: [...currentList, value.trim()]
      };

      // Using the specialized updateSettings service
      const res = await coachingService.updateSettings(updatedSettings);
      
      // Update global auth store
      updateSettings(res.data);
      toast.success(`${field === 'classes' ? 'Class' : 'Batch'} added successfully`);
      field === 'classes' ? setNewClass('') : setNewBatch('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (type, value) => {
    try {
      // Using the specialized removeItem service
      const res = await coachingService.removeItem(type, value);
      updateSettings(res.data);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Settings size={18} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Configuration Module</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            Institute <span className="text-slate-400">Node</span>
          </h2>
          <p className="text-slate-500 font-medium">Define the core academic structure for your center.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
          <div className="px-5 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200">
            <ShieldCheck size={18} className="text-blue-400" />
            <span className="text-xs font-black uppercase tracking-widest">Active System</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Academic Levels Card */}
        <SetupCard 
          title="Academic Levels" 
          description="Grades, Years, or Course Levels"
          icon={<Layers size={22}/>}
          items={user?.settings?.classes || []}
          value={newClass}
          onChange={setNewClass}
          onAdd={() => handleUpdate('classes', newClass)}
          onRemove={(item) => handleRemove('classes', item)}
          placeholder="e.g. Grade 10"
          loading={loading}
          theme="blue"
        />

        {/* Operational Batches Card */}
        <SetupCard 
          title="Operation Batches" 
          description="Time slots or specific study groups"
          icon={<BookOpen size={22}/>}
          items={user?.settings?.batches || []}
          value={newBatch}
          onChange={setNewBatch}
          onAdd={() => handleUpdate('batches', newBatch)}
          onRemove={(item) => handleRemove('batches', item)}
          placeholder="e.g. Morning Shift"
          loading={loading}
          theme="emerald"
        />
      </div>

      {/* Modern Info Footer */}
      <footer className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-start gap-5 max-w-xl">
          <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600">
            <Info size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">Impact on Enrollment</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Changes made here are instantly reflected in the student registration module. Ensure class names match your official records for accurate reporting.
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href='/dashboard/students/new'}
          className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          Enroll Students <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </div>
  );
};

// Extracted SetupCard Component
const SetupCard = ({ title, description, icon, items, value, onChange, onAdd, onRemove, placeholder, loading, theme }) => {
  const styles = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 ring-blue-500/10",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 ring-emerald-500/10"
  };

  return (
    <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center gap-5 mb-10">
        <div className={`p-4 rounded-[1.5rem] border ${styles[theme]}`}>{icon}</div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{description}</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-10">
        <input 
          className={`flex-1 p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 transition-all placeholder:text-slate-300 ${styles[theme]}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        />
        <button 
          onClick={onAdd} 
          disabled={loading || !value.trim()} 
          className="p-5 bg-slate-900 text-white rounded-[1.5rem] hover:bg-blue-600 disabled:opacity-20 transition-all shadow-xl active:scale-90"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar max-h-80 pr-3">
        {items.length > 0 ? items.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-5 bg-slate-50 border border-transparent rounded-[1.5rem] hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-[10px] font-black text-slate-300 shadow-sm border border-slate-100">
                {idx + 1}
              </span>
              <span className="text-sm font-black text-slate-700">{item}</span>
            </div>
            <button 
              onClick={() => onRemove(item)} 
              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-16 opacity-20 grayscale">
            <Plus size={48} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Add Entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupCenter;