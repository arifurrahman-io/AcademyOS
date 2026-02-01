import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  School,
  Globe,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
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
      /**
       * Payload aligned with coaching.service.js createCenter(data)
       * Service expects: name, slug, adminEmail, adminPassword, phone
       */
      const payload = {
        name: formData.name,
        slug: formData.slug,
        adminEmail: formData.email, // Mapped to service 'adminEmail'
        adminPassword: formData.password, // Mapped to service 'adminPassword'
        phone: formData.contactNumber, // Mapped to service 'phone'
      };

      await api.post("/auth/register-center", payload);

      toast.success("Institute successfully provisioned!");
      navigate("/login");
    } catch (err) {
      // Catch specific errors like "Subdomain already in use"
      const msg =
        err.response?.data?.message ||
        "Registration failed. Try a different slug.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Top Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-slate-900 rounded-[1.5rem] text-white shadow-2xl mb-4">
            <School size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
            Academy<span className="text-blue-600">OS</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Multi-Tenant Infrastructure
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Sidebar Info (Visual only) */}
            <div className="hidden md:flex md:col-span-2 bg-slate-900 p-8 flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-bold leading-tight mb-4">
                  Launch your digital campus in seconds.
                </h3>
                <ul className="space-y-4">
                  {[
                    "Isolated Tenant Database",
                    "Automated Tuition Logic",
                    "Staff Access Control",
                    "Instant PDF Reports",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
                    >
                      <ShieldCheck size={14} className="text-blue-500" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">
                  Trial Policy
                </p>
                <p className="text-xs text-slate-300">
                  7 Days of full premium access included with every new node.
                </p>
              </div>
            </div>

            {/* Right Form Area */}
            <div className="md:col-span-3 p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Provision New Node
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Enter your institute credentials below.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-4">
                  {/* Institute Name */}
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Coaching Identity
                    </label>
                    <div className="relative">
                      <School
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                      />
                      <input
                        required
                        placeholder="Institute Name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Instance Subdomain
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                      />
                      <input
                        required
                        placeholder="unique-slug"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Root Admin Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                      />
                      <input
                        type="email"
                        required
                        placeholder="admin@institute.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Security Secret
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                      />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all"
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                      Support Contact
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                        size={18}
                      />
                      <input
                        type="tel"
                        required
                        placeholder="+880..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 ring-blue-500/5 focus:border-blue-500/30 transition-all"
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
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group"
                >
                  Deploy Instance{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-slate-900 transition-colors"
                  >
                    Access Portal
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
