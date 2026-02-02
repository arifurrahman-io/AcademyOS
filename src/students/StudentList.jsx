import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  FileText,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Wallet,
  UserCheck,
  Users,
  Layers,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { useAuthStore } from "../store/authStore";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Button from "../components/Button";

/**
 * @desc    Modern Compact Student Registry
 * High-density UI for professional institute management.
 */
const StudentList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");

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

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_number.includes(searchTerm);
    const matchesClass = filterClass ? s.class_level === filterClass : true;
    return matchesSearch && matchesClass;
  });

  const headers = ["Identity", "Academic Level", "Batch", "Status", "Actions"];

  const renderRow = (student) => (
    <tr
      key={student._id}
      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all duration-300"
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
            <span className="text-xs font-black">{student.name.charAt(0)}</span>
          </div>
          <div>
            <p className="text-xs font-[900] text-slate-900 leading-tight uppercase tracking-tight">
              {student.name}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              ID: {student.roll_number}
            </p>
          </div>
        </div>
      </td>

      <td className="p-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-tight border border-blue-100/50">
          <Layers size={10} /> {student.class_level}
        </span>
      </td>

      <td className="p-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tight border border-slate-100">
          <BookOpen size={10} /> {student.batch}
        </span>
      </td>

      <td className="p-4">
        <div
          className={`inline-flex items-center gap-1.5 text-[10px] font-[900] uppercase tracking-tighter ${
            student.status === "active" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${student.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`}
          />
          {student.status}
        </div>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() =>
              navigate(`/dashboard/payments/collect`, {
                state: { studentId: student._id },
              })
            }
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
            title="Collect Fee"
          >
            <Wallet size={16} />
          </button>

          <button
            onClick={() =>
              navigate(`/dashboard/students/profile/${student._id}`)
            }
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="View Profile"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={() => navigate(`/dashboard/students/edit/${student._id}`)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={() => handleDelete(student._id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* COMPACT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Student <span className="text-blue-600">Registry</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Active Institute Node Access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <FileText size={14} /> Export
          </button>
          <button
            onClick={() => navigate("/dashboard/students/new")}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
            <UserPlus size={14} /> Enroll
          </button>
        </div>
      </div>

      {/* FILTER BAR - GLASS DESIGN */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name or roll..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative min-w-[160px]">
            <Layers
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <select
              className="w-full pl-10 pr-8 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase appearance-none focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Levels</option>
              {classOptions.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
          <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl border border-transparent hover:border-blue-100 transition-all">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* COMPACT TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <Table
          headers={headers}
          data={filteredStudents}
          renderRow={renderRow}
        />

        {filteredStudents.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center opacity-20 grayscale">
            <Users size={48} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Node Registry Empty
            </p>
          </div>
        )}
      </div>

      {/* COMPACT STATS FOOTER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-900 rounded-[2rem] text-white">
        <div className="flex flex-col items-center justify-center p-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Active
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">
              {students.filter((s) => s.status === "active").length}
            </span>
            <ArrowUpRight size={12} className="text-emerald-400" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 border-l border-white/10">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Fee Coverage
          </p>
          <span className="text-xl font-black text-emerald-400">88%</span>
        </div>
        <div className="hidden sm:flex flex-col items-center justify-center p-2 border-l border-white/10">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Capacity
          </p>
          <span className="text-xl font-black text-blue-400">High</span>
        </div>
        <div className="hidden sm:flex flex-col items-center justify-center p-2 border-l border-white/10">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Data Health
          </p>
          <span className="text-xl font-black text-indigo-400">Stable</span>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
