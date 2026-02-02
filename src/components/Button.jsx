import React from "react";
import { Loader2 } from "lucide-react";

/**
 * @desc    Modern Tactile Button Component
 * Optimized for high-density dashboard interactions and mobile responsiveness.
 */
const Button = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}) => {
  // Base styles focusing on "squircular" design and high-contrast typography
  const baseStyles =
    "relative px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.97] overflow-hidden";

  const variants = {
    // AcademyOS primary blue with shadow depth
    primary:
      "bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 hover:shadow-blue-500/20",

    // Minimalist gray for secondary actions
    secondary: "bg-slate-100 text-slate-600 hover:bg-slate-200",

    // High-visibility danger for destructive node operations
    danger:
      "bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 shadow-sm",

    // Ghost/Glassmorphism outline for secondary registry tools
    outline:
      "bg-white border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 shadow-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="opacity-70">Synchronizing...</span>
        </>
      ) : (
        children
      )}

      {/* Subtle inner glow effect on hover */}
      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
};

export default Button;
