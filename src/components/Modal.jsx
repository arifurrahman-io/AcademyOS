import React, { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";

/**
 * @desc    Modern Glassmorphism Modal
 * Optimized for high-density dashboard configuration and node management.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* 1. BLURRED BACKDROP - Modern Glass Effect */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 2. MODAL CONTAINER - Squircular Design */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
        {/* Header Section */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">
                {title}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Authorized Node Action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area - Optimized for high-density forms */}
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Subtle Bottom Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      </div>
    </div>
  );
};

export default Modal;
