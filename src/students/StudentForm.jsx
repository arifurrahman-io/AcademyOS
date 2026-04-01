import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Hash,
  Phone,
  Layers,
  CreditCard,
  Edit3,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowLeft,
  Activity,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import Loader from "../components/Loader";

const StudentForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const classOptions = user?.settings?.classes || [];
  const batchOptions = user?.settings?.batches || [];

  const [formData, setFormData] = useState({
    name: "",
    roll_number: "",
    class_level: "",
    batch: "",
    phone: "",
    admission_fee: "",
    monthly_fee: "",
    status: "active",
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchStudentData = async () => {
        setFetching(true);
        try {
          const res = await studentService.getById(id);
          const s = res.data;
          if (s) {
            setFormData({
              name: s.name || "",
              roll_number: s.roll_number || "",
              class_level: s.class_level ? String(s.class_level).trim() : "",
              batch: s.batch ? String(s.batch).trim() : "",
              phone: s.phone || "",
              admission_fee: s.admission_fee || "",
              monthly_fee: s.monthly_fee || "",
              status: s.status || "active",
            });
          }
        } catch (err) {
          toast.error("Registry record offline");
          navigate("/dashboard/students");
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
      return toast.error("Selection Required: Level & Batch");
    }

    setLoading(true);
    try {
      if (isEdit) {
        await studentService.update(id, formData);
        toast.success("Registry node updated successfully");
      } else {
        await studentService.create(formData);
        toast.success("New student node initialized");
      }
      navigate("/dashboard/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sync operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !user) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 font-bangla">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                <ShieldCheck size={14} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                {isEdit ? "Registry Modification" : "New Node Provisioning"}
              </p>
            </div>
            <h2 className="text-3xl font-[950] text-slate-900 tracking-tighter uppercase leading-none">
              {isEdit ? "Update" : "Enroll"}{" "}
              <span className="text-blue-600">Student</span>
            </h2>
          </div>
        </div>

        {/* STATUS TOGGLE */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: "active" })}
            className={`px-6 py-2 rounded-xl text-[10px] font-[900] uppercase tracking-widest transition-all flex items-center gap-2 ${
              formData.status === "active"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CheckCircle2 size={14} /> Active
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: "inactive" })}
            className={`px-6 py-2 rounded-xl text-[10px] font-[900] uppercase tracking-widest transition-all flex items-center gap-2 ${
              formData.status === "inactive"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <XCircle size={14} /> Inactive
          </button>
        </div>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-12 gap-8 items-start"
      >
        {/* LEFT COLUMN: PRIMARY ATTRIBUTES */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Activity size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Main Data
              </h3>
            </div>

            <div className="grid gap-6">
              <FormInput
                label="Full Legal Name"
                placeholder="Ex: Rahman Arif"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                icon={<Sparkles size={16} />}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <FormSelect
                  label="Academic Level"
                  options={classOptions}
                  value={formData.class_level}
                  onChange={(v) => setFormData({ ...formData, class_level: v })}
                  icon={<Layers size={16} />}
                />
                <FormSelect
                  label="Assigned Batch"
                  options={batchOptions}
                  value={formData.batch}
                  onChange={(v) => setFormData({ ...formData, batch: v })}
                  icon={<Zap size={16} />}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <FormInput
                  label="Registry ID (Roll)"
                  placeholder="Ex: 102"
                  value={formData.roll_number}
                  onChange={(v) => setFormData({ ...formData, roll_number: v })}
                  icon={<Hash size={16} />}
                />
                <FormInput
                  label="Contact Mobile"
                  placeholder="+880..."
                  type="tel"
                  value={formData.phone}
                  onChange={(v) => setFormData({ ...formData, phone: v })}
                  icon={<Phone size={16} />}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: FINANCIALS & SUBMIT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* FINANCIAL NODE CARD */}
          <div className="bg-slate-900 p-8 sm:p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white/10 rounded-2xl text-blue-400">
                <CreditCard size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.25em]">
                Financial Node
              </h3>
            </div>

            <div className="space-y-6 mb-10">
              <PriceInput
                label="Admission Fee"
                value={formData.admission_fee}
                onChange={(v) => setFormData({ ...formData, admission_fee: v })}
                color="blue"
              />
              <PriceInput
                label="Monthly Fee"
                value={formData.monthly_fee}
                onChange={(v) => setFormData({ ...formData, monthly_fee: v })}
                color="emerald"
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className={`w-full py-5 rounded-[2rem] font-[900] text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                isEdit
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-900"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isEdit ? "Sync Node" : "Initialize Node"}
              <ChevronRight size={18} />
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

/* --- Refined Internal Sub-Components --- */

const FormInput = ({
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
}) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
      />
    </div>
  </div>
);

const FormSelect = ({ label, options, value, onChange, icon }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
        {icon}
      </div>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-[11px] font-black uppercase text-slate-700 outline-none focus:bg-white focus:border-blue-200 transition-all appearance-none cursor-pointer"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const PriceInput = ({ label, value, onChange, color }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative">
      <div
        className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-lg ${color === "blue" ? "text-blue-400" : "text-emerald-400"}`}
      >
        ৳
      </div>
      <input
        required
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0.00"
        className="w-full pl-11 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-xl font-black text-white focus:bg-white/10 focus:border-white/20 transition-all outline-none"
      />
    </div>
  </div>
);

export default StudentForm;
