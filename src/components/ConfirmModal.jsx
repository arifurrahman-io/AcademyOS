import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                {title || "Confirm Deletion"}
              </h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wide">
                {message ||
                  "Are you sure? This action is permanent and cannot be reversed."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex border-t border-slate-50">
              <button
                onClick={onClose}
                className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <div className="w-px bg-slate-50" />
              <button
                disabled={isLoading}
                onClick={onConfirm}
                className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Confirm Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
