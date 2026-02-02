import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserPlus,
  Hash,
  BookOpen,
  Phone,
  Layers,
  CreditCard,
  Wallet,
  Edit3,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BadgeInfo,
} from "lucide-react";
import toast from "react-hot-toast";
import { studentService } from "../services/student.service";
import { useAuthStore } from "../store/authStore";
import Button from "../components/Button";
import Loader from "../components/Loader";

/**
 * @desc    Modern Compact Enrollment/Edit Form
 * Optimized for high-speed registry entry and multi-center logic.
 */
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
      return toast.error("Select Academic Level and Batch");
    }

    setLoading(true);
    try {
      if (isEdit) {
        await studentService.update(id, formData);
        toast.success("Registry node updated");
      } else {
        await studentService.create(formData);
        toast.success("New student initialized");
      }
      navigate("/dashboard/students");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !user) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 1. COMPACT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-2xl shadow-lg ${isEdit ? "bg-amber-600 text-white" : "bg-slate-900 text-white"}`}
          >
            {isEdit ? <Edit3 size={20} /> : <UserPlus size={20} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {isEdit ? "Modify" : "Enroll"}{" "}
              <span className="text-blue-600">Student</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Registry Node Synchronization
            </p>
          </div>
        </div>

        {/* Status Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: "active" })}
            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${formData.status === "active" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}
          >
            <CheckCircle2 size={12} /> Active
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: "inactive" })}
            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${formData.status === "inactive" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}
          >
            <XCircle size={12} /> Inactive
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-6">
        {/* 2. CORE IDENTITY CARD */}
        <div className="md:col-span-3 space-y-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Legal Name
            </label>
            <input
              required
              placeholder="Full Name"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Academic Level
              </label>
              <select
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none"
                value={formData.class_level}
                onChange={(e) =>
                  setFormData({ ...formData, class_level: e.target.value })
                }
              >
                <option value="">Select Level</option>
                {classOptions.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Operation Batch
              </label>
              <select
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none"
                value={formData.batch}
                onChange={(e) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
              >
                <option value="">Select Batch</option>
                {batchOptions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                ID/Roll
              </label>
              <input
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                value={formData.roll_number}
                onChange={(e) =>
                  setFormData({ ...formData, roll_number: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Contact Number
              </label>
              <input
                required
                type="tel"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* 3. FINANCIALS & SUBMIT */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
              <CreditCard size={14} /> Financial Profile
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Admission Fee
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-400 text-xs">
                    ৳
                  </span>
                  <input
                    required
                    type="number"
                    className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:bg-white/10 transition-all outline-none"
                    value={formData.admission_fee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admission_fee: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Monthly Tuition
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-400 text-xs">
                    ৳
                  </span>
                  <input
                    required
                    type="number"
                    className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:bg-white/10 transition-all outline-none"
                    value={formData.monthly_fee}
                    onChange={(e) =>
                      setFormData({ ...formData, monthly_fee: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                isEdit
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-900"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEdit ? "Sync Changes" : "Confirm Enrollment"}{" "}
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
