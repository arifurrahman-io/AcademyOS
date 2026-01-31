import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await authService.login({ email, password });
    
    // IMPORTANT: Check your backend response structure. 
    // If it returns { success: true, token: "...", data: { role: "admin", ... } }
    // then userData is response.data.
    const userData = response.data; 
    const token = response.token;
    const trialExpired = response.trialExpired || false;

    if (!userData || !userData.role) {
       throw new Error("User role is missing from server response");
    }

    // Save to Zustand store
    setAuth(userData, token, trialExpired);

    // Navigate based on the verified role
    if (userData.role === 'super-admin') {
      navigate('/super-admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Role not defined.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight tracking-tight">AcademyOS</h2>
          <p className="mt-2 text-slate-500 font-medium font-medium">Secure Multi-tenant Management</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-white">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800">Welcome Back</h3>
            <p className="text-sm text-slate-500">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">Error:</span>
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@academy.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                isLoading={loading} 
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] transition-all"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have a center registered? {' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Register Now
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          &copy; 2026 AcademyOS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;