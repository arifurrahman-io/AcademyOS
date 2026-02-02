import React from "react";

/**
 * @desc    Modern Technical Loader Component
 * Optimized for node synchronization and registry loading states.
 */
const Loader = ({ fullPage = false }) => {
  // Enhanced container with glassmorphism for full-page states
  const containerClass = fullPage
    ? "fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-[999]"
    : "flex items-center justify-center p-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {/* Advanced Spinner with High-Contrast Dual Tones */}
        <div className="relative">
          <div className="w-12 h-12 border-[3px] border-slate-100 rounded-2xl animate-spin shadow-sm"></div>
          <div className="absolute inset-0 w-12 h-12 border-t-[3px] border-blue-600 rounded-2xl animate-spin"></div>

          {/* Center Pulse Point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">
            Synchronizing Node
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            AcademyOS Cloud Ledger
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
