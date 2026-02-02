import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  School,
  Globe,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/Button";

/**
 * @desc    Modern Compact Node Registration
 * Optimized for multi-tenant provisioning with high-density UI.
 */
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        adminEmail: formData.email,
        adminPassword: formData.password,
        phone: formData.contactNumber,
      };

      await api.post("/auth/register-center", payload);
      toast.success("Institute node provisioned successfully.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Provisioning failed. Check slug availability.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF] px-4 py-12 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: System Information (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col space-y-8 pr-8">
          <div className="space-y-4">
            <div className="inline-flex p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
              <School size={28} />
            </div>
            <h1 className="text-4xl font-[950] text-slate-900 tracking-tighter uppercase leading-none">
              Academy<span className="text-blue-600">OS</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
              "Deploy localized nodes with enterprise-grade security and
              automated ledger logic instantly."
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem icon={<Zap size={14} />} text="Instant Node Sync" />
            <FeatureItem
              icon={<Lock size={14} />}
              text="256-bit AES Encryption"
            />
            <FeatureItem
              icon={<Activity size={14} />}
              text="Automated Revenue Logic"
            />
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem]">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
              Status
            </p>
            <p className="text-xs font-bold text-blue-900/60">
              Cluster 2026 is currently accepting new node provisioning.
            </p>
          </div>
        </div>

        {/* Right Side: Registration Card */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-slate-200/60">
            <div className="mb-8">
              <h2 className="text-2xl font-[900] text-slate-900 tracking-tight uppercase">
                Initialize Node
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Global Registry Access
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputGroup
                  label="Coaching Identity"
                  icon={<School size={16} />}
                  placeholder="Dhaka Science Academy"
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
                <InputGroup
                  label="Instance URL Key"
                  icon={<Globe size={16} />}
                  placeholder="unique-slug"
                  onChange={(v) => setFormData({ ...formData, slug: v })}
                />
              </div>

              <InputGroup
                label="Root Admin Email"
                type="email"
                icon={<Mail size={16} />}
                placeholder="admin@institute.com"
                onChange={(v) => setFormData({ ...formData, email: v })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputGroup
                  label="Security Secret"
                  type="password"
                  icon={<Lock size={16} />}
                  placeholder="••••••••"
                  onChange={(v) => setFormData({ ...formData, password: v })}
                />
                <InputGroup
                  label="Contact Point"
                  type="tel"
                  icon={<Phone size={16} />}
                  placeholder="+880..."
                  onChange={(v) =>
                    setFormData({ ...formData, contactNumber: v })
                  }
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-[900] uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all flex items-center justify-center gap-2 group mt-4"
              >
                Provision Instance{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-slate-50 pt-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                Existing Tenant?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-slate-900 transition-colors font-black underline decoration-blue-100 underline-offset-4"
                >
                  Access Portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components for Cleanliness --- */

const InputGroup = ({ label, icon, placeholder, type = "text", onChange }) => (
  <div className="space-y-1.5 group">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
        {icon}
      </div>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-4 ring-blue-500/5 focus:bg-white transition-all placeholder:text-slate-300"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
      {icon}
    </div>
    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
      {text}
    </span>
  </div>
);

export default Register;
