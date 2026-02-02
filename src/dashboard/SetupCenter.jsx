import React, { useMemo, useState } from "react";
import {
  Layers,
  BookOpen,
  Plus,
  Trash2,
  Settings,
  ShieldCheck,
  ArrowRight,
  Info,
  Lock,
  Crown,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { coachingService } from "../services/coaching.service";

/**
 * @desc    Modern Compact Setup Module
 * Optimized for high-density academic configuration.
 */
const SetupCenter = () => {
  const navigate = useNavigate();
  const { user, updateSettings, isTrialExpired } = useAuthStore();
  const [newClass, setNewClass] = useState("");
  const [newBatch, setNewBatch] = useState("");
  const [loadingKey, setLoadingKey] = useState(null);

  const classes = user?.settings?.classes || [];
  const batches = user?.settings?.batches || [];

  const isLocked = useMemo(() => {
    if (user?.role === "super-admin") return false;
    return Boolean(isTrialExpired);
  }, [isTrialExpired, user?.role]);

  const normalize = (v) => v.trim();

  const handleAdd = async (field, value) => {
    const v = normalize(value);
    if (!v || isLocked) return;

    const currentSettings = user?.settings || { classes: [], batches: [] };
    const currentList = currentSettings[field] || [];

    if (currentList.some((x) => x.toLowerCase() === v.toLowerCase())) {
      return toast.error(`${v} already exists`);
    }

    setLoadingKey(`${field}:add`);
    try {
      const res = await coachingService.updateSettings({
        ...currentSettings,
        [field]: [...currentList, v],
      });
      const newSettings = res?.data?.data || res?.data || res;
      updateSettings(newSettings);
      toast.success(`${field === "classes" ? "Level" : "Batch"} added`);
      field === "classes" ? setNewClass("") : setNewBatch("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Connection error");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleRemove = async (field, value) => {
    if (isLocked) return;
    setLoadingKey(`${field}:remove:${value}`);
    try {
      const res = await coachingService.removeItem(field, value);
      const newSettings = res?.data?.data || res?.data || res;
      updateSettings(newSettings);
      toast.success("Item Removed");
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. COMPACT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
            <Settings size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Node <span className="text-blue-600">Config</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Core Registry Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLocked ? (
            <button
              onClick={() => navigate("/upgrade")}
              className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all group"
            >
              <Lock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Locked: Upgrade Required
              </span>
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                System Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. DUAL CONFIG CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <SetupCard
          title="Academic Levels"
          icon={<Layers size={18} />}
          items={classes}
          value={newClass}
          onChange={setNewClass}
          onAdd={() => handleAdd("classes", newClass)}
          onRemove={(item) => handleRemove("classes", item)}
          placeholder="e.g. Class 10"
          isLoading={loadingKey === "classes:add"}
          isLocked={isLocked}
          accent="blue"
        />

        <SetupCard
          title="Time Batches"
          icon={<BookOpen size={18} />}
          items={batches}
          value={newBatch}
          onChange={setNewBatch}
          onAdd={() => handleAdd("batches", newBatch)}
          onRemove={(item) => handleRemove("batches", item)}
          placeholder="e.g. Morning Shift"
          isLoading={loadingKey === "batches:add"}
          isLocked={isLocked}
          accent="emerald"
        />
      </div>

      {/* 3. MINIMALIST ACTION FOOTER */}
      <div className="p-4 bg-slate-900 rounded-[2rem] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-white/10 rounded-lg text-blue-400">
            <Info size={16} />
          </div>
          <p className="text-[11px] font-medium text-slate-300">
            Changes propagate to{" "}
            <span className="text-white font-bold">Enrollment</span> &{" "}
            <span className="text-white font-bold">Billing</span> modules
            instantly.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/students/new")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95"
        >
          Proceed to Enrollment <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

/**
 * SetupCard Sub-component
 */
const SetupCard = ({
  title,
  icon,
  items,
  value,
  onChange,
  onAdd,
  onRemove,
  placeholder,
  isLoading,
  isLocked,
  accent,
}) => {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <div
      className={`flex flex-col bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm transition-all ${isLocked ? "grayscale opacity-70" : "hover:shadow-md"}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 rounded-xl border ${themes[accent]}`}>
          {icon}
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          {title}
        </h3>
      </div>

      {/* Input Group */}
      <div className="relative mb-6">
        <input
          disabled={isLocked}
          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
          placeholder={isLocked ? "System Locked" : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        <button
          onClick={onAdd}
          disabled={isLocked || isLoading || !value.trim()}
          className="absolute right-1.5 top-1.5 p-1.5 bg-slate-900 text-white rounded-lg hover:bg-blue-600 disabled:opacity-30 transition-all"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus size={18} />
          )}
        </button>
      </div>

      {/* Dynamic List */}
      <div className="space-y-2 overflow-y-auto max-h-48 pr-1 custom-scrollbar">
        {items?.length > 0 ? (
          items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-50/50 border border-transparent rounded-xl hover:border-slate-100 hover:bg-white transition-all group"
            >
              <span className="text-xs font-bold text-slate-600 flex items-center gap-3">
                <span className="text-[10px] text-slate-300 font-black tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </span>
              <button
                onClick={() => onRemove(item)}
                disabled={isLocked}
                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:hidden"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              No Entries Recorded
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupCenter;
