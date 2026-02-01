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
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { coachingService } from "../services/coaching.service";

const SetupCenter = () => {
  const navigate = useNavigate();

  const { user, updateSettings, isTrialExpired } = useAuthStore();

  const [newClass, setNewClass] = useState("");
  const [newBatch, setNewBatch] = useState("");

  // ✅ Separate loading per action
  const [loadingKey, setLoadingKey] = useState(null); // "classes:add" | "batches:add" | "classes:remove:<item>" ...

  const classes = user?.settings?.classes || [];
  const batches = user?.settings?.batches || [];

  // ✅ If trial expired (or subscription locked), disable config
  // super-admin bypass; teacher optional bypass? (keep strict: only admin config)
  const isLocked = useMemo(() => {
    if (user?.role === "super-admin") return false;
    return Boolean(isTrialExpired);
  }, [isTrialExpired, user?.role]);

  const normalize = (v) => v.trim();

  const existsInList = (list, value) => {
    const v = value.trim().toLowerCase();
    return list.some((x) => String(x).trim().toLowerCase() === v);
  };

  const handleAdd = async (field, value) => {
    const v = normalize(value);
    if (!v) return;

    if (isLocked) {
      toast.error("Subscription required. Please upgrade to continue.");
      return navigate("/upgrade");
    }

    const currentSettings = user?.settings || { classes: [], batches: [] };
    const currentList = currentSettings[field] || [];

    if (existsInList(currentList, v)) {
      toast.error(`${v} already exists`);
      return;
    }

    const key = `${field}:add`;
    setLoadingKey(key);

    try {
      const updatedSettings = {
        ...currentSettings,
        [field]: [...currentList, v],
      };

      const res = await coachingService.updateSettings(updatedSettings);

      // ✅ Handle both shapes: {success,data} or direct settings
      const newSettings = res?.data?.data || res?.data || res;

      updateSettings(newSettings);
      toast.success(`${field === "classes" ? "Class" : "Batch"} added`);
      if (field === "classes") setNewClass("");
      if (field === "batches") setNewBatch("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Connection error");
    } finally {
      setLoadingKey(null);
    }
  };

  const handleRemove = async (field, value) => {
    if (isLocked) {
      toast.error("Subscription required. Please upgrade to continue.");
      return navigate("/upgrade");
    }

    const key = `${field}:remove:${value}`;
    setLoadingKey(key);

    try {
      const res = await coachingService.removeItem(field, value);
      const newSettings = res?.data?.data || res?.data || res;
      updateSettings(newSettings);
      toast.success("Removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Settings size={18} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Configuration Module
            </span>
          </div>

          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            Institute <span className="text-slate-400">Node</span>
          </h2>

          <p className="text-slate-500 font-medium">
            Define the core academic structure for your center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isLocked ? (
            <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
              <div className="px-5 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200">
                <ShieldCheck size={18} className="text-blue-400" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Active System
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-3xl p-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <div className="pr-2">
                <p className="text-xs font-black text-amber-800 uppercase tracking-widest">
                  Subscription Required
                </p>
                <p className="text-[11px] text-amber-700 font-semibold">
                  Upgrade to unlock configuration.
                </p>
              </div>
              <button
                onClick={() => navigate("/upgrade")}
                className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-2 gap-10">
        <SetupCard
          title="Academic Levels"
          description="Grades, Years, or Course Levels"
          icon={<Layers size={22} />}
          items={classes}
          value={newClass}
          onChange={setNewClass}
          onAdd={() => handleAdd("classes", newClass)}
          onRemove={(item) => handleRemove("classes", item)}
          placeholder="e.g. Grade 10"
          loading={loadingKey === "classes:add"}
          isLocked={isLocked}
          theme="blue"
        />

        <SetupCard
          title="Operation Batches"
          description="Time slots or specific study groups"
          icon={<BookOpen size={22} />}
          items={batches}
          value={newBatch}
          onChange={setNewBatch}
          onAdd={() => handleAdd("batches", newBatch)}
          onRemove={(item) => handleRemove("batches", item)}
          placeholder="e.g. Morning Shift"
          loading={loadingKey === "batches:add"}
          isLocked={isLocked}
          theme="emerald"
        />
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-start gap-5 max-w-xl">
          <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600">
            <Info size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-1">
              Impact on Enrollment
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Changes made here are instantly reflected in student registration.
              Keep class/batch naming consistent for accurate reporting.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/students/new")}
          className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          Enroll Students{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </footer>

      {/* Locked overlay hint (optional) */}
      {isLocked ? (
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Crown size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Unlock with Yearly License
              </h3>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                Your center is currently restricted. Submit payment proof and
                wait for verification to regain access.
              </p>
              <button
                onClick={() => navigate("/upgrade")}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Go to Upgrade <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/**
 * SetupCard (Extracted)
 */
const SetupCard = ({
  title,
  description,
  icon,
  items,
  value,
  onChange,
  onAdd,
  onRemove,
  placeholder,
  loading,
  isLocked,
  theme,
}) => {
  const styles = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 ring-blue-500/10",
    emerald:
      "text-emerald-600 bg-emerald-50 border-emerald-100 ring-emerald-500/10",
  };

  return (
    <div
      className={`bg-white p-10 rounded-[4rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col transition-all ${
        isLocked ? "opacity-60" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-5 mb-10">
        <div className={`p-4 rounded-[1.5rem] border ${styles[theme]}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {description}
          </p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-4 mb-10">
        <input
          disabled={isLocked}
          className={`flex-1 p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 transition-all placeholder:text-slate-300 ${styles[theme]}`}
          placeholder={isLocked ? "Upgrade to edit" : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLocked && onAdd()}
        />
        <button
          onClick={onAdd}
          disabled={isLocked || loading || !value.trim()}
          className="p-5 bg-slate-900 text-white rounded-[1.5rem] hover:bg-blue-600 disabled:opacity-20 transition-all shadow-xl active:scale-95"
          title={isLocked ? "Upgrade required" : "Add"}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-2">
        {items?.length ? (
          items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center justify-between p-5 bg-slate-50 border border-transparent rounded-[1.5rem] hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-[10px] font-black text-slate-300 shadow-sm border border-slate-100">
                  {idx + 1}
                </span>
                <span className="text-sm font-black text-slate-700">
                  {item}
                </span>
              </div>

              <button
                onClick={() => onRemove(item)}
                disabled={isLocked}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                title={isLocked ? "Upgrade required" : "Remove"}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 opacity-20 grayscale">
            <Plus size={48} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              Add Entry
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupCenter;
