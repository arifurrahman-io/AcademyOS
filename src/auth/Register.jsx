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
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/Button";

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
        "Registration failed. Check slug availability.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] px-6 py-12 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-md w-full space-y-10">
        {/* Minimalist Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200">
            <School size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Academy<span className="text-blue-600">OS</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
              Infrastructure Provisioning
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-5">
              {/* Institute Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Coaching Identity
                </label>
                <div className="relative group">
                  <School
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    placeholder="E.g. Dhaka Science Academy"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Unique Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Instance URL Key
                </label>
                <div className="relative group">
                  <Globe
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    placeholder="unique-slug"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Admin Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Root Admin Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    placeholder="admin@institute.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Security Secret
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Support Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Contact Point
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="+880..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-5 rounded-[1.5rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group"
            >
              Initialize Node{" "}
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
                className="text-blue-600 hover:text-slate-900 transition-colors underline decoration-blue-100 underline-offset-4"
              >
                Access Portal
              </Link>
            </p>
          </div>
        </div>

        {/* Dynamic Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-slate-400 grayscale opacity-50">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Enterprise Encrypted Node
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
