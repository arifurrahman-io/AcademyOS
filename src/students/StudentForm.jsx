import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  UserPlus, Hash, BookOpen, Phone, Layers, 
  CreditCard, Wallet, Edit3, CheckCircle2, XCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../services/student.service';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Loader from '../components/Loader';

const StudentForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  // Extract options from center settings
  const classOptions = user?.settings?.classes || [];
  const batchOptions = user?.settings?.batches || [];

  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    class_level: '',
    batch: '',
    phone: '',
    admission_fee: '',
    monthly_fee: '',
    status: 'active'
  });

  /**
   * Data Synchronization Logic
   * Using a single useEffect to handle the edit state
   */
  useEffect(() => {
    if (isEdit && id) {
      const fetchStudentData = async () => {
        setFetching(true);
        try {
          // Hits GET /api/v1/students/:id
          const res = await studentService.getById(id);
          const s = res.data;
          
          if (s) {
            setFormData({
              name: s.name || '',
              roll_number: s.roll_number || '',
              // Force string conversion and trim to ensure exact match with <option> values
              class_level: s.class_level ? String(s.class_level).trim() : '', 
              batch: s.batch ? String(s.batch).trim() : '',             
              phone: s.phone || '',
              admission_fee: s.admission_fee || '',
              monthly_fee: s.monthly_fee || '',
              status: s.status || 'active'
            });
          }
        } catch (err) {
          toast.error("Registry record could not be loaded");
          navigate('/dashboard/students');
        } finally {
          setFetching(false);
        }
      };
      fetchStudentData();
    }
  }, [isEdit, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.class_level || !formData.batch) {
      return toast.error("Please select a Class and Batch from the list");
    }

    setLoading(true);
    try {
      if (isEdit) {
        // PUT /api/v1/students/:id
        await studentService.update(id, formData);
        toast.success("Profile successfully synchronized");
      } else {
        // POST /api/v1/students
        await studentService.create(formData);
        toast.success("New student enrolled");
      }
      navigate('/dashboard/students');
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching student data OR if center settings aren't loaded yet
  if (fetching || !user) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-[3rem] shadow-sm border border-slate-200 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className={`p-5 rounded-[1.5rem] shadow-inner ${isEdit ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
            {isEdit ? <Edit3 size={32} /> : <UserPlus size={32} />}
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              {isEdit ? "Update Profile" : "Enroll Student"}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {isEdit ? `Modifying node: ${formData.name}` : "Initialize a new student record"}
            </p>
          </div>
        </div>

        {isEdit && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'active'})}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${formData.status === 'active' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <CheckCircle2 size={14} /> Active
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'inactive'})}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${formData.status === 'inactive' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <XCircle size={14} /> Inactive
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Student Identity</label>
          <input 
            required 
            placeholder="Full Name"
            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Class Selector - Bound to classOptions */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Layers size={14}/> Academic Level
            </label>
            <div className="relative">
              <select 
                required
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 appearance-none cursor-pointer"
                value={formData.class_level}
                onChange={e => setFormData({...formData, class_level: e.target.value})}
              >
                <option value="">Select Level</option>
                {classOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Layers size={16} />
              </div>
            </div>
          </div>

          {/* Batch Selector - Bound to batchOptions */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <BookOpen size={14}/> Operation Batch
            </label>
            <div className="relative">
              <select 
                required
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 appearance-none cursor-pointer"
                value={formData.batch}
                onChange={e => setFormData({...formData, batch: e.target.value})}
              >
                <option value="">Select Batch</option>
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <BookOpen size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Other fields: Roll Number, Phone, Fees... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Hash size={14}/> Registration Number
            </label>
            <input 
              required 
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700"
              value={formData.roll_number} 
              onChange={e => setFormData({...formData, roll_number: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Phone size={14}/> Contact Phone
            </label>
            <input 
              required 
              type="tel"
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700"
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-500"/> Admission Fee
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-emerald-600 text-sm">৳</span>
                <input 
                  required 
                  type="number"
                  className="w-full pl-10 pr-5 py-5 bg-emerald-50/30 border border-emerald-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 font-black text-emerald-700"
                  value={formData.admission_fee} 
                  onChange={e => setFormData({...formData, admission_fee: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Wallet size={14} className="text-blue-500"/> Monthly Tuition
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-blue-600 text-sm">৳</span>
                <input 
                  required 
                  type="number"
                  className="w-full pl-10 pr-5 py-5 bg-blue-50/30 border border-blue-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-blue-700"
                  value={formData.monthly_fee} 
                  onChange={e => setFormData({...formData, monthly_fee: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={loading} 
          className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all ${
            isEdit ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-900 hover:bg-blue-600 text-white'
          }`}
        >
          {isEdit ? "Synchronize Registry" : "Confirm Enrollment"}
        </Button>
      </form>
    </div>
  );
};

export default StudentForm;