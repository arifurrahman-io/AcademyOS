import React, { useMemo, useState } from "react";
import {
  Check,
  Smartphone,
  Crown,
  ShieldCheck,
  Info,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Modal from "../components/Modal";
import api from "../services/api";
import { formatCurrency } from "../utils/format";
import { useLocation, useNavigate } from "react-router-dom";

const YEARLY_PRICE = 1200;
const MERCHANT_NUMBER = "01684516151"; // your merchant number

const UpgradePlan = () => {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [paymentData, setPaymentData] = useState({
    senderNumber: "",
    trxId: "",
    provider: "bkash", // bkash | nagad
  });

  const plan = useMemo(
    () => ({
      name: "Yearly Subscription",
      price: YEARLY_PRICE,
      features: [
        "Unlimited Students & Staff",
        "PDF Reports & Exports",
        "Role-Based Access",
        "Data Backup & Security",
        "Priority Support",
      ],
    }),
    [],
  );

  const handleOpenPayment = () => setShowPaymentModal(true);

  const resetForm = () => {
    setPaymentData({ senderNumber: "", trxId: "", provider: "bkash" });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ new endpoint (coaching admin submits proof)
      await api.post("/subscriptions/submit-payment", {
        provider: paymentData.provider, // "bkash" | "nagad"
        senderNumber: paymentData.senderNumber,
        trxId: paymentData.trxId,
      });

      toast.success("Payment submitted. Waiting for verification.");
      setShowPaymentModal(false);
      resetForm();

      // Optional: return user where they came from (keeps them logged-in but locked)
      const params = new URLSearchParams(location.search);
      const from = params.get("from");

      // If they came from a locked page, keep them on upgrade
      // Because after submit they are still locked until verified.
      if (from) navigate("/upgrade", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] p-6 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-black uppercase tracking-widest">
          <ShieldCheck size={16} /> Subscription Required
        </div>

        <h2 className="mt-4 text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Activate your <span className="text-blue-600">Yearly License</span>
        </h2>

        <p className="mt-3 text-slate-500 text-sm font-medium leading-relaxed">
          Your trial may have ended or your yearly license expired. Complete a
          payment and submit the proof—Super Admin will verify it and activate
          your access for 1 year.
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Clock size={14} /> Verification typically within working hours
        </div>
      </div>

      {/* Plan Card */}
      <div className="max-w-xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
          {/* Accent */}
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

          <div className="p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {plan.name}
                </h3>
                <p className="mt-1 text-slate-500 text-sm font-medium">
                  1-year full access for your coaching center
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                Recommended
              </div>
            </div>

            <div className="mt-7 flex items-end gap-2">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">
                {formatCurrency(plan.price)}
              </span>
              <span className="text-slate-400 font-bold">/year</span>
            </div>

            <div className="mt-8 grid gap-3">
              {plan.features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-100">
                    <Check size={16} className="text-emerald-600" />
                  </span>
                  <span className="text-slate-700 font-semibold text-sm">
                    {f}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white">
                  <Info size={18} />
                </span>
                <div className="text-sm">
                  <p className="font-black text-slate-900">How to pay</p>
                  <p className="mt-1 text-slate-500 font-medium leading-relaxed">
                    Send Money to{" "}
                    <span className="font-black text-slate-900">
                      {MERCHANT_NUMBER}
                    </span>{" "}
                    via
                    <span className="font-black text-pink-600"> bKash</span> or
                    <span className="font-black text-orange-600"> Nagad</span>.
                    Then submit your Sender Number + TrxID for verification.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleOpenPayment}
              className="w-full mt-8 py-4 rounded-2xl bg-slate-900 hover:bg-blue-600 transition-all shadow-lg"
            >
              Pay & Submit Proof
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          resetForm();
        }}
        title="Submit Payment Proof"
      >
        <div className="space-y-6">
          {/* Merchant Block */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white border border-white/5">
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Crown size={14} /> Merchant Wallet
            </p>

            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-sm font-bold flex items-center gap-2">
                <Smartphone size={16} /> bKash / Nagad
              </span>
              <span className="text-lg font-mono font-black text-blue-400">
                {MERCHANT_NUMBER}
              </span>
            </div>

            <p className="mt-3 text-[10px] text-slate-400 italic font-medium leading-relaxed">
              Step 1: Send Money to the number above. Step 2: Paste TrxID and
              sender account.
            </p>
          </div>

          {/* Provider Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() =>
                setPaymentData((p) => ({ ...p, provider: "bkash" }))
              }
              className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                paymentData.provider === "bkash"
                  ? "border-pink-500 bg-pink-50 text-pink-600 ring-4 ring-pink-500/10"
                  : "border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              bKash
            </button>

            <button
              type="button"
              onClick={() =>
                setPaymentData((p) => ({ ...p, provider: "nagad" }))
              }
              className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                paymentData.provider === "nagad"
                  ? "border-orange-500 bg-orange-50 text-orange-600 ring-4 ring-orange-500/10"
                  : "border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              Nagad
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Sender Account Number
              </label>
              <input
                placeholder="017XXXXXXXX"
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                value={paymentData.senderNumber}
                onChange={(e) =>
                  setPaymentData((p) => ({
                    ...p,
                    senderNumber: e.target.value,
                  }))
                }
              />
              <p className="mt-2 text-[11px] text-slate-500 font-medium">
                Enter the number you used to send money.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Transaction ID (TrxID)
              </label>
              <input
                placeholder="ABC123XYZ..."
                required
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-mono transition-all font-bold"
                value={paymentData.trxId}
                onChange={(e) =>
                  setPaymentData((p) => ({
                    ...p,
                    trxId: e.target.value.trim(),
                  }))
                }
              />
              <p className="mt-2 text-[11px] text-slate-500 font-medium">
                TrxID must be unique. If you submit a duplicate TrxID, it will
                be rejected.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-blue-600 transition-all"
              >
                Submit for Verification
              </Button>

              <p className="mt-3 text-[11px] text-slate-400 font-semibold text-center">
                After submission, your access will activate once Super Admin
                verifies the payment.
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UpgradePlan;
