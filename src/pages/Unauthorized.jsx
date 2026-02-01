import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Unauthorized = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const role = user?.role;

  const homePath = !isAuthenticated
    ? "/login"
    : role === "super-admin"
      ? "/super-admin/dashboard"
      : "/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-[2rem] shadow-sm p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6">
          <ShieldAlert size={32} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Access Denied
        </h1>
        <p className="text-slate-500 mt-3 text-sm font-medium">
          You don’t have permission to view this page.
        </p>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Requested Path
          </p>
          <p className="text-sm font-bold text-slate-700 mt-1">
            {location.pathname}
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={homePath}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm inline-flex items-center justify-center gap-2 hover:bg-indigo-600 transition"
          >
            <ArrowLeft size={18} /> Go Home
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-sm hover:bg-slate-50 transition"
          >
            Login with another account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
