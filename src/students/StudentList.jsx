import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, FileText, Search, Filter, 
  Eye, Edit3, Trash2, Wallet, 
  UserCheck, Users, Layers, BookOpen 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../services/student.service';
import { useAuthStore } from '../store/authStore';
import Table from '../components/Table';
import Loader from '../components/Loader';
import Button from '../components/Button';

const StudentList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const classOptions = user?.settings?.classes || [];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data);
    } catch (error) {
      toast.error("Cloud registry sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent deletion? This cannot be undone.")) return;
    try {
      await studentService.delete(id);
      toast.success("Student removed from registry");
      loadStudents();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.roll_number.includes(searchTerm);
    const matchesClass = filterClass ? s.class_level === filterClass : true;
    return matchesSearch && matchesClass;
  });

  const headers = ['Student Profile', 'Class / Level', 'Batch Details', 'Status', 'Registry Actions'];

  const renderRow = (student) => (
    <tr key={student._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-300">
      {/* Identity Card */}
      <td className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
            <UserCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-tight">{student.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Roll: {student.roll_number}</p>
          </div>
        </div>
      </td>

      {/* Academic Level */}
      <td className="p-6">
        <div className="flex items-center gap-2 text-slate-600">
          <Layers size={14} className="text-slate-300" />
          <span className="text-xs font-bold">{student.class_level}</span>
        </div>
      </td>

      {/* Operation Batch */}
      <td className="p-6">
        <div className="flex items-center gap-2 text-slate-600">
          <BookOpen size={14} className="text-slate-300" />
          <span className="text-xs font-bold">{student.batch}</span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="p-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          student.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {student.status}
        </div>
      </td>

      {/* Registry Actions Palette */}
      <td className="p-6">
        <div className="flex items-center gap-2">
          {/* NEW: Payment Initiation Button */}
          <button 
            onClick={() => navigate(`/dashboard/payments/collect`, { state: { studentId: student._id } })}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
            title="Collect Fee"
          >
            <Wallet size={18} />
          </button>
          
          <button 
            onClick={() => navigate(`/dashboard/students/profile/${student._id}`)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="View Profile"
          >
            <Eye size={18} />
          </button>
          
          <button 
            onClick={() => navigate(`/dashboard/students/edit/${student._id}`)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
            title="Edit Record"
          >
            <Edit3 size={18} />
          </button>
          
          <button 
            onClick={() => handleDelete(student._id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Delete Record"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Users size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Student Management</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Student <span className="text-slate-300">Registry</span></h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl px-6 py-4 border-slate-200">
            <FileText size={18} /> Export PDF
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/students/new')}
            className="rounded-2xl px-8 py-4 bg-slate-900 text-white font-black shadow-xl shadow-slate-200"
          >
            <UserPlus size={18} /> Enroll Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or roll..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative min-w-[200px]">
            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-11 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-xs font-black appearance-none focus:ring-4 focus:ring-blue-500/5"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classOptions.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
          <button className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <Table 
          headers={headers} 
          data={filteredStudents} 
          renderRow={renderRow} 
        />
        
        {filteredStudents.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center justify-center grayscale opacity-30">
            <Users size={64} className="mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">Registry Empty</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-10 px-10 py-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Active</p>
          <p className="text-2xl font-black text-slate-900">{students.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Coverage</p>
          <p className="text-2xl font-black text-emerald-600">88%</p>
        </div>
      </div>
    </div>
  );
};

export default StudentList;