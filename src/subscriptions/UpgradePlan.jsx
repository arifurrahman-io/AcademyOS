import React, { useMemo, useState, useEffect } from "react";
import { Check, ShieldCheck, Clock, Copy } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Modal from "../components/Modal";
import api from "../services/api";
import { formatCurrency } from "../utils/format";
import { useLocation, useNavigate } from "react-router-dom";

const YEARLY_PRICE = 1200;
const MERCHANT_NUMBER = "01684516151";

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "—";
  }
};

const daysLeft = (endAt) => {
  if (!endAt) return null;
  const ms = new Date(endAt).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const UpgradePlan = () => {
  const [loading, setLoading] = useState(false); // submit
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [statusLoading, setStatusLoading] = useState(true); // status fetch
  const [statusError, setStatusError] = useState("");

  /**
   * ✅ Backend statuses we support
   * - "active" => verified subscription
   * - "pending" => payment submitted, waiting verification
   * - "declined" => admin rejected
   * - "trial" or "trial_expired" or "expired" or "unknown" => show purchase screen
   *
   * NOTE: your /subscriptions/my-status already returns { status, startAt, endAt, plan, trialEnd }
   * We'll only rely on that.
   */
  const [sub, setSub] = useState({
    status: "unknown",
    plan: "yearly",
    startAt: null,
    endAt: null,
    trialEnd: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [paymentData, setPaymentData] = useState({
    senderNumber: "",
    transactionId: "",
    method: "bkash",
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

  const closeModal = () => {
    setShowPaymentModal(false);
    setPaymentData({ senderNumber: "", transactionId: "", method: "bkash" });
  };

  const copyMerchant = async () => {
    try {
      await navigator.clipboard.writeText(MERCHANT_NUMBER);
      toast.success("Merchant number copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  // ✅ Load subscription/payment status (dynamic)
  const fetchStatus = async () => {
    setStatusError("");
    setStatusLoading(true);

    try {
      const res = await api.get("/subscriptions/my-status", {
        headers: { "Cache-Control": "no-cache" },
      });

      const data = res.data?.data || {};
      const status = String(data.status || "unknown").toLowerCase();

      setSub({
        status,
        plan: data.plan || "yearly",
        startAt: data.startAt || null,
        endAt: data.endAt || null,
        trialEnd: data.trialEnd || null,
      });
    } catch (err) {
      setStatusError(err.response?.data?.message || "Failed to load status.");
      setSub((s) => ({ ...s, status: "unknown" }));
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/subscriptions/upgrade-center", {
        method: paymentData.method,
        senderNumber: paymentData.senderNumber,
        transactionId: paymentData.transactionId,
      });

      toast.success("Payment submitted. Waiting for verification.");
      closeModal();

      // refresh status so UI becomes "pending"
      await fetchStatus();

      // optional redirect back to blocked page if you want:
      const params = new URLSearchParams(location.search);
      const from = params.get("from");
      if (from) navigate(decodeURIComponent(from), { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const isActive = sub.status === "active";
  const isPending = sub.status === "pending";
  const isDeclined = sub.status === "declined";

  // ✅ show purchase screen when not active/pending
  const shouldShowPurchase = !isActive && !isPending && !statusLoading; // includes declined/trial/expired/unknown

  const left = daysLeft(sub.endAt);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 bg-[#FDFDFF]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} /> License Terminal
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Subscription <span className="text-blue-600">Status</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
              Pay via bKash/Nagad, submit proof, and get verified for 1 year.
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-white p-2 rounded-xl border border-slate-100">
            <Clock size={14} className="text-blue-500" />
            {isActive
              ? "Active License"
              : isPending
                ? "Pending Verification"
                : "Upgrade Required"}
          </div>
        </div>

        {/* Loading / Error */}
        {statusLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 font-bold">
            Loading subscription status...
          </div>
        ) : statusError ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8">
            <p className="text-rose-700 font-black text-sm">
              Status Load Failed
            </p>
            <p className="text-rose-700/80 text-sm font-semibold mt-2">
              {statusError}
            </p>
            <button
              onClick={fetchStatus}
              className="mt-4 px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ✅ ACTIVE VIEW */}
            {isActive && (
              <div className="rounded-[2rem] border border-emerald-200 bg-white shadow-xl shadow-emerald-100/60 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Status
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                        Verified • Active
                      </div>
                      <h3 className="mt-4 text-2xl font-black text-slate-900">
                        Yearly License Enabled
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-slate-600">
                        Your node is operational. Renew before expiry to avoid
                        lock.
                      </p>
                    </div>

                    <div className="sm:text-right bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Days Left
                      </p>
                      <p className="text-3xl font-black text-emerald-700 tabular-nums">
                        {left == null ? "—" : `${Math.max(0, left)}d`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoTile
                      label="Start Date"
                      value={formatDate(sub.startAt)}
                    />
                    <InfoTile
                      label="Expiry Date"
                      value={formatDate(sub.endAt)}
                    />
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={fetchStatus}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Refresh Status
                    </button>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Renew / Extend
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ PENDING VIEW */}
            {isPending && (
              <div className="rounded-[2rem] border border-amber-200 bg-white shadow-xl shadow-amber-100/60 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Status
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                        Payment Submitted • Pending
                      </div>
                      <h3 className="mt-4 text-2xl font-black text-slate-900">
                        Waiting for Verification
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-slate-600">
                        Super Admin will verify your payment. You’ll be
                        activated immediately after approval.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Amount
                      </p>
                      <p className="text-3xl font-black text-slate-900 tabular-nums">
                        {formatCurrency(YEARLY_PRICE)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={fetchStatus}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Check Again
                    </button>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Submit Another Proof
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ DECLINED BANNER + PURCHASE VIEW */}
            {shouldShowPurchase && (
              <div className="space-y-6">
                {isDeclined && (
                  <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 sm:p-7">
                    <p className="text-[11px] font-black uppercase tracking-widest text-rose-700">
                      Payment Declined
                    </p>
                    <p className="mt-2 text-sm font-semibold text-rose-800/80">
                      Your submitted proof was rejected. Please re-check your
                      Transaction ID and submit again.
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 transition-all"
                      >
                        Submit New Proof
                      </button>
                    </div>
                  </div>
                )}

                {/* ✅ PURCHASE SCREEN (your current UpgradePlan UI) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Main Plan Card */}
                  <div className="lg:col-span-3 rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                    <div className="p-6 sm:p-8 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                            Current Tier
                          </p>
                          <h3 className="text-2xl font-black text-slate-900">
                            {plan.name}
                          </h3>
                        </div>
                        <div className="sm:text-right bg-blue-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                            Provisioning Fee
                          </p>
                          <div className="flex items-baseline gap-1 sm:justify-end">
                            <span className="text-4xl font-black text-blue-600 tracking-tighter">
                              {formatCurrency(plan.price)}
                            </span>
                            <span className="text-slate-400 font-bold text-sm">
                              /yr
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {plan.features.map((f) => (
                          <div
                            key={f}
                            className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl transition-colors hover:bg-slate-50"
                          >
                            <div className="shrink-0 w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                              <Check
                                size={14}
                                className="text-emerald-600"
                                strokeWidth={3}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 tracking-tight">
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={() => setShowPaymentModal(true)}
                          className="w-full py-4 rounded-2xl text-white bg-slate-900 hover:bg-blue-600 shadow-lg shadow-slate-300"
                        >
                          Initialize Activation
                        </Button>

                        <button
                          type="button"
                          onClick={copyMerchant}
                          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-black text-[11px] uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
                        >
                          <Copy size={16} />
                          <span className="sm:hidden lg:inline">
                            Merchant ID
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Gateway: bKash / Nagad
                        </span>
                        <span className="text-[10px] font-black text-slate-900 tracking-widest tabular-nums">
                          {MERCHANT_NUMBER}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar / Steps */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                        Activation Protocol
                      </p>
                      <div className="space-y-6">
                        <Step
                          n="1"
                          text={`Transfer ${formatCurrency(
                            YEARLY_PRICE,
                          )} to our verified merchant number.`}
                        />
                        <Step
                          n="2"
                          text="Open the activation terminal and select your payment provider."
                        />
                        <Step
                          n="3"
                          text="Log your Sender Number and the unique Transaction ID."
                        />
                        <Step
                          n="4"
                          text="Await node synchronization (usually within working hours)."
                        />
                      </div>
                    </div>

                    <div className="p-5 rounded-[1.5rem] bg-amber-50 border border-amber-100 flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg text-amber-600 shadow-sm shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1">
                          Audit Notice
                        </p>
                        <p className="text-xs text-amber-900/70 font-semibold leading-relaxed">
                          Incorrect Transaction IDs may trigger manual audit and
                          delay activation.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={fetchStatus}
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-white text-slate-700 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Refresh Status
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={closeModal}
        title="Verification Sync"
      >
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-3">
            {["bkash", "nagad"].map((p) => {
              const active = paymentData.method === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPaymentData((s) => ({ ...s, method: p }))}
                  className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all
                    ${
                      active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                    }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Send to
              </p>
              <p className="text-sm font-black text-slate-900">
                {MERCHANT_NUMBER}
              </p>
              <p className="text-[11px] font-bold text-slate-500 mt-1">
                Amount:{" "}
                <span className="font-black">
                  {formatCurrency(YEARLY_PRICE)}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={copyMerchant}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2"
            >
              <Copy size={14} /> Copy
            </button>
          </div>

          <form onSubmit={handleSubmitPayment} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Source Account
              </label>
              <input
                required
                placeholder="01XXXXXXXXX"
                value={paymentData.senderNumber}
                onChange={(e) =>
                  setPaymentData((s) => ({
                    ...s,
                    senderNumber: e.target.value,
                  }))
                }
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Ledger Transaction ID
              </label>
              <input
                required
                placeholder="e.g. 8A1BC2D3E4"
                value={paymentData.transactionId}
                onChange={(e) =>
                  setPaymentData((s) => ({
                    ...s,
                    transactionId: e.target.value.trim(),
                  }))
                }
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-mono font-bold transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-1/3 py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <Button
                type="submit"
                isLoading={loading}
                className="w-full sm:w-2/3 py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                Submit Proof
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

const Step = ({ n, text }) => (
  <div className="flex items-start gap-4 group">
    <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[11px] font-black shadow-lg group-hover:scale-110 transition-transform">
      {n}
    </div>
    <p className="text-sm font-bold text-slate-600 leading-relaxed pt-1">
      {text}
    </p>
  </div>
);

const InfoTile = ({ label, value }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
  </div>
);

export default UpgradePlan;
