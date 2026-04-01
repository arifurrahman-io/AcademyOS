import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  FileText,
  Search,
  Filter,
  Eye,
  Wallet,
  Users,
  Layers,
  BookOpen,
  ArrowUpRight,
  RefreshCw,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Zap,
  DownloadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { reportService } from "../services/report.service";
import { useAuthStore } from "../store/authStore";
import Table from "../components/Table";
import Loader from "../components/Loader";

const StudentList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const classOptions = user?.settings?.classes || [];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const response = await studentService.getAll();
      setStudents(response.data);
      if (showToast)
        toast.success("Registry node synchronized", {
          icon: <Zap className="text-amber-500" />,
        });
    } catch (error) {
      toast.error("Cloud registry sync failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.loading("Compiling registry PDF...", { id: "export-toast" });
      await reportService.downloadStudentReport();
      toast.success("Registry exported successfully", { id: "export-toast" });
    } catch (error) {
      toast.error("Export failed. Service node offline.", {
        id: "export-toast",
      });
    } finally {
      setExporting(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = s.name || "";
      const roll = s.roll_number || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roll.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = filterClass ? s.class_level === filterClass : true;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, filterClass]);

  const headers = [
    "Identity Node",
    "Academic Context",
    "Ledger Rate",
    "Node Status",
    "Actions",
  ];

  const renderRow = (student) => (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={student._id}
      className="group border-b border-slate-50 hover:bg-indigo-50/30 transition-all duration-300"
    >
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 text-indigo-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            <span className="text-sm font-black italic">
              {(student.name || "S").charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-[950] text-slate-800 leading-tight uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
              {student.name}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 bg-slate-100 w-fit px-1.5 py-0.5 rounded">
              ID: {student.roll_number}
            </p>
          </div>
        </div>
      </td>

      <td className="p-4">
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest">
            <Layers size={10} /> {student.class_level}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-tight">
            <BookOpen size={10} /> {student.batch}
          </span>
        </div>
      </td>

      <td className="p-4">
        <div className="flex flex-col">
          <p className="text-sm font-black text-slate-700">
            ৳{student.monthly_fee?.toLocaleString()}
          </p>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
            Subscription Rate
          </p>
        </div>
      </td>

      <td className="p-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-[1000] uppercase tracking-widest border ${
            student.status === "active"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${student.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
          />
          {student.status}
        </div>
      </td>

      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() =>
              navigate(`/dashboard/payments/collection`, {
                state: { studentId: student._id },
              })
            }
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all shadow-sm active:scale-90"
            title="Revenue Terminal"
          >
            <Wallet size={16} />
          </button>
          <button
            onClick={() =>
              navigate(`/dashboard/students/profile/${student._id}`)
            }
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all shadow-sm active:scale-90"
            title="View Intelligence"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 font-bangla">
      {/* VIBRANT HERO HEADER */}
      <div className="relative overflow-hidden bg-slate-950 p-10 sm:p-12 rounded-[3.5rem] text-white shadow-2xl shadow-slate-200 group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
          <Users size={220} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-[1000] tracking-tighter uppercase italic leading-none">
                Student <span className="text-indigo-400">Registry</span>
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  Node Protocol: Operational
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadStudents(true)}
              disabled={refreshing}
              className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-slate-300 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                size={24}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={() => navigate("/dashboard/students/new")}
              className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-[1000] text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:shadow-xl shadow-indigo-500/30 transition-all active:scale-95"
            >
              <UserPlus size={20} /> Enroll Node
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH & EXPORT DOCK */}
      <div className="grid md:grid-cols-12 gap-5 bg-white p-5 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
        <div className="md:col-span-6 relative group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-all"
            size={20}
          />
          <input
            type="text"
            placeholder="Query identity by name or roll number..."
            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.75rem] text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-indigo-200 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="md:col-span-3 relative">
          <Layers
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <select
            className="w-full pl-14 pr-10 py-5 bg-slate-50 border-2 border-transparent rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest appearance-none focus:bg-white focus:border-blue-200 transition-all outline-none cursor-pointer"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Academic Levels</option>
            {classOptions.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 flex items-center justify-center gap-3 px-4 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {exporting ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <DownloadCloud size={18} />
            )}
            Export
          </button>
          <div className="flex items-center justify-center p-5 bg-indigo-50 text-indigo-600 rounded-[1.75rem] border border-indigo-100">
            <Filter size={20} />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_22px_70px_rgba(0,0,0,0.02)] overflow-hidden">
        <Table
          headers={headers}
          data={filteredStudents}
          renderRow={renderRow}
        />

        <AnimatePresence mode="wait">
          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-40 text-center flex flex-col items-center justify-center"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-6 border border-dashed border-slate-200">
                <Users size={48} strokeWidth={1} />
              </div>
              <p className="text-xs font-[1000] uppercase tracking-[0.4em] text-slate-300">
                Null Matrix Discovery
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ANALYTICS DOCK */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-12 bg-white border border-slate-100 rounded-[4rem] shadow-2xl shadow-slate-200/50">
        <MetricItem
          label="Registry Nodes"
          value={students.length}
          color="indigo"
          icon={<Users size={14} />}
        />
        <MetricItem
          label="Active Logic"
          value={students.filter((s) => s.status === "active").length}
          color="emerald"
          icon={<Activity size={14} />}
        />
        <MetricItem
          label="Query Matches"
          value={filteredStudents.length}
          color="blue"
          icon={<Search size={14} />}
        />
        <MetricItem
          label="Sync Status"
          value="Stable"
          color="amber"
          icon={<RefreshCw size={14} />}
        />
      </div>
    </div>
  );
};

const MetricItem = ({ label, value, color, icon }) => {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  }[color];

  return (
    <div className="flex flex-col items-center text-center space-y-3 group cursor-default">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-indigo-500 transition-colors flex items-center gap-2">
        {icon} {label}
      </span>
      <div
        className={`px-8 py-3 rounded-2xl border-2 font-[1000] text-2xl shadow-inner transition-all group-hover:scale-105 ${colors}`}
      >
        {value}
      </div>
    </div>
  );
};

export default StudentList;
