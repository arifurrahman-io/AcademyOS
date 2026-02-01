import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const NotFound = () => {
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
        <h1 className="text-8xl font-black text-slate-200 leading-none">404</h1>

        <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 mt-3">
          Node Not Found
        </p>

        <p className="text-slate-500 mt-4 text-sm font-medium">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          to={homePath}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-lg hover:bg-indigo-600 transition"
        >
          <Home size={18} />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
