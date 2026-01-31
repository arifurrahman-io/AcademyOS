import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { School, Globe, Mail, Lock, Phone, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    password: '',
    contactNumber: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      /**
       * Hits the updated backend registration endpoint
       * This creates the CoachingCenter and the Admin User simultaneously.
       */
      await api.post('/auth/register-center', {
        name: formData.name,
        slug: formData.slug,
        email: formData.email,
        password: formData.password,
        settings: {
          contactNumber: formData.contactNumber
        }
      });

      toast.success("Center registered successfully!");
      // Redirect to login so the new admin can sign in
      navigate('/login'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
      <div className="max-w-xl w-full">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
            <School size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">AcademyOS</h2>
          <p className="mt-2 text-slate-500 font-medium">Launch your multi-tenant coaching platform</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-white">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800">Create Your Center</h3>
            <p className="text-sm text-slate-500">Register your institute to start your 7-day free trial</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Institute Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Coaching Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <School size={18} />
                  </div>
                  <input 
                    required
                    placeholder="Arif's Teaching"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">URL Slug</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Globe size={18} />
                  </div>
                  <input 
                    required
                    placeholder="arifs-teaching"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Admin Credentials Section */}
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-5">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <ShieldCheck size={18} /> Admin Account Credentials
              </div>
              
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email"
                    required
                    placeholder="admin@yourcenter.com"
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-blue-100 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="password"
                    required
                    placeholder="Choose a strong password"
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-blue-100 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Contact Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel"
                  placeholder="+880 1234 567890"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              isLoading={loading} 
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Initialize My Center
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account? {' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 font-medium uppercase tracking-widest">
          Secured by AcademyOS Multi-tenant Protocol
        </p>
      </div>
    </div>
  );
};

export default Register;