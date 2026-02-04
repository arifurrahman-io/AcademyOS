import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Zap,
  Activity,
  Server,
  Fingerprint,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/Button";
import logo from "../assets/academyos-logo.png"; // Original logo path

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
      const msg = err.response?.data?.message || "Provisioning failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const floatingBlocks = Array.from({ length: 10 });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF] px-4 py-12 selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative font-bangla">
      {/* Animated Background Blocks */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {floatingBlocks.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.03, 0.08, 0.03],
              x: [
                Math.random() * 100,
                Math.random() * -100,
                Math.random() * 100,
              ],
              y: [
                Math.random() * 100,
                Math.random() * -100,
                Math.random() * 100,
              ],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bg-blue-500/10 border border-blue-400/5 rounded-[2.5rem]"
            style={{
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-indigo-100/30 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-blue-100/30 blur-[140px]" />
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Side: System Information & Logo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-10"
        >
          {/* Logo visible on both mobile and desktop */}
          <Link
            to="/"
            className="flex flex-col items-center lg:items-start gap-6 group"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <img
                src={logo}
                alt="AcademyOS"
                className="w-20 h-20 lg:w-24 lg:h-24 object-contain relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-4xl lg:text-5xl font-[950] text-slate-900 tracking-tighter uppercase leading-none">
                Academy<span className="text-blue-600">OS</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                Infrastructure Provisioning
              </p>
            </div>
          </Link>

          {/* Desktop Only Features */}
          <div className="hidden lg:flex flex-col space-y-4">
            <p className="text-base font-medium text-slate-500 leading-relaxed max-w-sm mb-4">
              Deploy{" "}
              <span className="text-slate-900 font-bold">localized nodes</span>{" "}
              with enterprise-grade security instantly.
            </p>
            <FeatureItem
              icon={<Zap size={14} />}
              text="Instant Node Sync"
              delay={0.2}
            />
            <FeatureItem
              icon={<Fingerprint size={14} />}
              text="256-bit AES Encryption"
              delay={0.3}
            />
            <FeatureItem
              icon={<Activity size={14} />}
              text="Automated Revenue Logic"
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Right Side: Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-7 w-full"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[3rem] p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)]">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup
                  label="Coaching Identity"
                  icon={<Server size={16} />}
                  placeholder="Academy Name"
                  onChange={(v) => setFormData({ ...formData, name: v })}
                />
                <InputGroup
                  label="URL Key (Slug)"
                  icon={<Globe size={16} />}
                  placeholder="unique-slug"
                  onChange={(v) => setFormData({ ...formData, slug: v })}
                />
              </div>

              <InputGroup
                label="Primary Admin Email"
                type="email"
                icon={<Mail size={16} />}
                placeholder="admin@node.os"
                onChange={(v) => setFormData({ ...formData, email: v })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputGroup
                  label="Security Secret"
                  type="password"
                  icon={<Lock size={16} />}
                  placeholder="••••••••"
                  onChange={(v) => setFormData({ ...formData, password: v })}
                />
                <InputGroup
                  label="Contact Phone"
                  type="tel"
                  icon={<Phone size={16} />}
                  placeholder="+880..."
                  onChange={(v) =>
                    setFormData({ ...formData, contactNumber: v })
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full py-5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-[900] uppercase tracking-[0.25em] text-[11px] shadow-2xl shadow-blue-900/10 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  Provision Instance
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </form>

            <div className="mt-10 text-center border-t border-slate-50 pt-8">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                Existing Node?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-slate-900 transition-colors font-black ml-1"
                >
                  Access Portal
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, placeholder, type = "text", onChange }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
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
        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all placeholder:text-slate-300"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const FeatureItem = ({ icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center gap-4"
  >
    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-600 border border-slate-100 shadow-sm">
      {icon}
    </div>
    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
      {text}
    </span>
  </motion.div>
);

export default Register;
