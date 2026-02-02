import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  Mail,
  Phone,
  Calendar,
  Search,
  Shield,
  Trash2,
  Settings2,
  AlertCircle,
  ExternalLink,
  Zap,
  BadgeCheck,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Modal from "../components/Modal";
import api from "../services/api";

const getId = (node) => node?._id || node?.id || node?.centerId || null;

const normalizeCenters = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (payload.data) return normalizeCenters(payload.data);
  return [];
};

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const toInputDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const isPaidNode = (node) => {
  if (node?.subscriptionStatus === "paid") return true; // legacy
  if (node?.subscriptionStatus === "active") return true; // legacy alt
  if (node?.subscription?.status === "active") return true; // new engine
  return false;
};

const getSubDates = (node) => {
  const start =
    node?.subscription?.startAt ||
    node?.subscriptionStartDate ||
    node?.paidAt ||
    null;

  const end =
    node?.subscription?.endAt ||
    node?.subscriptionEndDate ||
    node?.expiryDate ||
    node?.endAt ||
    null;

  return { start, end };
};

const CentersManagement = () => {
  const outlet = useOutletContext() || {};
  const refreshFromLayout = outlet.refresh;
  const stats = outlet.stats;

  const [localCenters, setLocalCenters] = useState([]);
  const [bootLoading, setBootLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * ✅ FULL CONTROL FORM:
   * - legacy subscriptionStatus
   * - new engine subscription.status + dates
   * - paymentProcessed
   */
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    adminEmail: "",
    adminPassword: "",
    phone: "",

    // legacy flags (your UI uses these too)
    subscriptionStatus: "trial", // trial | paid | suspended | expired
    paymentProcessed: true,

    // new engine fields
    subStatus: "trial_active", // trial_active | trial_expired | payment_pending | active | expired | suspended
    startAt: "",
    endAt: "",
  });

  const bootstrap = async () => {
    setBootLoading(true);

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await api.get("/coaching/all", {
        signal: controller.signal,
        timeout: 8000,
      });

      const arr = normalizeCenters(res.data);
      setLocalCenters(arr);
    } catch (err) {
      const isAbort =
        err?.name === "CanceledError" ||
        err?.code === "ERR_CANCELED" ||
        err?.message?.toLowerCase?.().includes("canceled");

      const msg = isAbort
        ? "API timeout. Backend not responding."
        : err.response?.data?.message || "Failed to load centers";

      console.error("BOOTSTRAP ERROR:", err);
      toast.error(msg);
    } finally {
      clearTimeout(t);
      setBootLoading(false);
    }
  };

  useEffect(() => {
    const arr = normalizeCenters(stats);
    if (arr.length > 0) {
      setLocalCenters(arr);
      return;
    }
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  const nodes = useMemo(() => {
    return (localCenters || []).map((n) => ({ ...n, _id: getId(n) }));
  }, [localCenters]);

  const filteredNodes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter(
      (n) =>
        n?.name?.toLowerCase().includes(q) ||
        n?.slug?.toLowerCase().includes(q) ||
        n?.email?.toLowerCase().includes(q),
    );
  }, [nodes, searchTerm]);

  const safeRefresh = async () => {
    if (typeof refreshFromLayout === "function") {
      await refreshFromLayout(true);
    } else {
      await bootstrap();
    }
  };

  const handleOpenModal = (center = null) => {
    if (center) {
      const phone = center.phone || center.settings?.contactNumber || "";
      const { start, end } = getSubDates(center);

      setSelectedCenter(center);
      setFormData({
        name: center.name || "",
        slug: center.slug || "",
        adminEmail: center.email || center.adminEmail || "",
        adminPassword: "",
        phone,

        subscriptionStatus: center.subscriptionStatus || "trial",
        paymentProcessed: center.paymentProcessed ?? true,

        subStatus: center?.subscription?.status || "trial_active",
        startAt: toInputDate(start),
        endAt: toInputDate(end),
      });
    } else {
      setSelectedCenter(null);
      setFormData({
        name: "",
        slug: "",
        adminEmail: "",
        adminPassword: "",
        phone: "",

        subscriptionStatus: "trial",
        paymentProcessed: true,

        subStatus: "trial_active",
        startAt: "",
        endAt: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (node) => {
    const id = getId(node);
    if (!id) return toast.error("System Error: Node ID Missing");

    if (
      !window.confirm("Permanent Deletion: All data will be purged. Continue?")
    )
      return;

    try {
      await api.delete(`/coaching/${id}`);
      toast.success("Center deleted");
      await safeRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const getTrialStatus = (expiryDate) => {
    if (!expiryDate) return { percent: 0, color: "bg-slate-200", remaining: 0 };
    const total = 14;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const percent = Math.min(100, Math.max(0, (remaining / total) * 100));
    let color = "bg-emerald-500";
    if (percent < 30) color = "bg-rose-500";
    else if (percent < 60) color = "bg-amber-500";
    return { percent, color, remaining: Math.max(0, remaining) };
  };

  /**
   * ✅ quick actions in modal
   */
  const activateOneYear = () => {
    const start = new Date();
    const end = addDays(start, 365);

    setFormData((s) => ({
      ...s,
      subscriptionStatus: "paid", // legacy
      paymentProcessed: true,
      subStatus: "active", // new engine
      startAt: toInputDate(start),
      endAt: toInputDate(end),
    }));
  };

  const markPendingPayment = () => {
    setFormData((s) => ({
      ...s,
      paymentProcessed: false,
      subStatus: "payment_pending",
      subscriptionStatus: "trial",
      startAt: "",
      endAt: "",
    }));
  };

  const expireSubscription = () => {
    setFormData((s) => ({
      ...s,
      subscriptionStatus: "expired",
      subStatus: "expired",
      paymentProcessed: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert input date -> Date (or null)
    const startAtISO = formData.startAt ? new Date(formData.startAt) : null;
    const endAtISO = formData.endAt ? new Date(formData.endAt) : null;

    const payload = {
      name: formData.name,
      slug: formData.slug,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword,
      phone: formData.phone,

      // legacy
      subscriptionStatus: formData.subscriptionStatus,
      paymentProcessed: formData.paymentProcessed,

      // new engine
      subscription: {
        status: formData.subStatus,
        startAt: startAtISO,
        endAt: endAtISO,
        plan: "yearly",
      },
    };

    try {
      if (selectedCenter?._id) {
        await api.put(`/coaching/${selectedCenter._id}`, payload);
        toast.success("Center updated");
      } else {
        await api.post("/coaching/register", payload);
        toast.success("Center created");
      }
      setIsModalOpen(false);
      await safeRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            <Shield size={12} /> System Root
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Cluster <span className="text-indigo-600 font-medium">Nodes</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Managing{" "}
            <span className="font-bold text-slate-800">{nodes.length}</span>{" "}
            isolated deployments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter nodes..."
              className="pl-11 pr-6 py-3.5 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500/30 rounded-2xl text-sm font-semibold outline-none w-72 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg"
          >
            <Plus size={18} /> Provision Node
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm overflow-x-auto">
        {bootLoading ? (
          <div className="p-10 text-slate-500 font-semibold flex items-center justify-between">
            <span>Loading centers...</span>
            <button
              onClick={bootstrap}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Instance Info
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Access Point
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  License
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Trial / Subscription
                </th>
                <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Command
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredNodes.map((node, index) => {
                const id = getId(node);
                const phone =
                  node.phone || node.settings?.contactNumber || "N/A";
                const paid = isPaidNode(node);

                const { start, end } = getSubDates(node);
                const trial = getTrialStatus(node.trialExpiryDate);

                return (
                  <tr
                    key={id || `node-${index}`}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Instance */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-md">
                          {(node.name || "?").charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {node.name || "—"}
                            {node.slug && (
                              <a
                                href={`https://${node.slug}.academyos.com`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink
                                  size={12}
                                  className="text-slate-300 hover:text-indigo-500"
                                />
                              </a>
                            )}
                          </div>
                          <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <Zap size={10} className="text-amber-500" />
                            {node.slug ? `${node.slug}.academyos.com` : "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Access */}
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                          <Mail size={12} className="text-slate-400" />
                          {node.email || "—"}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {phone}
                        </div>
                      </div>
                    </td>

                    {/* License */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${
                            paid
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-indigo-50 text-indigo-600 border-indigo-100"
                          }`}
                        >
                          {node.subscriptionStatus || (paid ? "paid" : "trial")}
                        </span>

                        {!node.paymentProcessed && (
                          <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1 animate-pulse">
                            <AlertCircle size={10} /> Billing Warning
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Trial / Subscription */}
                    <td className="px-6 py-6">
                      {paid ? (
                        <div className="space-y-1">
                          <div className="text-[10px] font-black uppercase text-slate-400">
                            Subscription
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                              <span className="text-slate-400 font-black uppercase text-[10px]">
                                Start
                              </span>
                              <span>{formatDate(start)}</span>
                            </div>

                            <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                              <span className="text-slate-400 font-black uppercase text-[10px]">
                                End
                              </span>
                              <span>{formatDate(end)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-32 space-y-1.5">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-slate-400">Days</span>
                            <span
                              className={
                                trial.remaining <= 3
                                  ? "text-rose-500"
                                  : "text-slate-600"
                              }
                            >
                              {trial.remaining}d
                            </span>
                          </div>

                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-1000 ${trial.color}`}
                              style={{ width: `${trial.percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenModal(node)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Settings2 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(node)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredNodes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-slate-500 font-semibold"
                  >
                    No centers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCenter ? "Node Control Panel" : "Cluster Provisioning"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Base Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Institute Name
              </label>
              <input
                required
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-4 ring-indigo-500/10 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Subdomain Key
              </label>
              <input
                required
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-4 ring-indigo-500/10 outline-none"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Contact Number
              </label>
              <input
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-4 ring-indigo-500/10 outline-none"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Subscription / Payment Control */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Calendar size={16} /> Billing Controls
                </h3>
                <p className="text-slate-500 text-[11px] font-bold mt-1">
                  Manage subscription state + payment processing from here.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={activateOneYear}
                  className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-2"
                >
                  <BadgeCheck size={16} /> Activate 1 Year
                </button>

                <button
                  type="button"
                  onClick={markPendingPayment}
                  className="px-4 py-2 rounded-2xl bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all"
                >
                  Mark Pending
                </button>

                <button
                  type="button"
                  onClick={expireSubscription}
                  className="px-4 py-2 rounded-2xl bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2"
                >
                  <Ban size={16} /> Expire
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Legacy status */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Legacy Subscription Status
                </label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-black text-[11px] uppercase outline-none"
                  value={formData.subscriptionStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscriptionStatus: e.target.value,
                    })
                  }
                >
                  <option value="trial">trial</option>
                  <option value="paid">paid</option>
                  <option value="active">active</option>
                  <option value="expired">expired</option>
                  <option value="suspended">suspended</option>
                  <option value="deactivated">deactivated</option>
                </select>
              </div>

              {/* New engine status */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Subscription Engine Status
                </label>
                <select
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-black text-[11px] uppercase outline-none"
                  value={formData.subStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, subStatus: e.target.value })
                  }
                >
                  <option value="trial_active">trial_active</option>
                  <option value="trial_expired">trial_expired</option>
                  <option value="payment_pending">payment_pending</option>
                  <option value="active">active</option>
                  <option value="expired">expired</option>
                  <option value="suspended">suspended</option>
                </select>
              </div>

              {/* Payment processed */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Payment Processed
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((s) => ({
                      ...s,
                      paymentProcessed: !s.paymentProcessed,
                    }))
                  }
                  className={`w-full px-4 py-3 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all
                    ${
                      formData.paymentProcessed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                    }`}
                >
                  {formData.paymentProcessed ? "Processed ✓" : "Pending ⚠️"}
                </button>
              </div>

              {/* Dates */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Subscription Start
                </label>
                <input
                  type="date"
                  value={formData.startAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startAt: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Subscription End
                </label>
                <input
                  type="date"
                  value={formData.endAt}
                  onChange={(e) =>
                    setFormData({ ...formData, endAt: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Preview
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {formatDate(formData.startAt)} → {formatDate(formData.endAt)}
                </p>
                <p className="text-[11px] font-bold text-slate-500 mt-1">
                  Engine:{" "}
                  <span className="text-slate-900">{formData.subStatus}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Admin credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Admin Email (Required)
              </label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-4 ring-indigo-500/10 outline-none"
                value={formData.adminEmail}
                onChange={(e) =>
                  setFormData({ ...formData, adminEmail: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder={
                  selectedCenter ? "Keep empty to skip" : "Minimum 8 chars"
                }
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-800 focus:ring-4 ring-indigo-500/10 outline-none"
                value={formData.adminPassword}
                onChange={(e) =>
                  setFormData({ ...formData, adminPassword: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-indigo-600 transition-all"
          >
            {selectedCenter ? "Save Changes" : "Create Center"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CentersManagement;
