import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Modal from "../components/Modal";
import api from "../services/api";

const CentersManagement = () => {
  const { stats, refresh } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    adminEmail: "",
    adminPassword: "",
    subscriptionStatus: "trial",
    paymentProcessed: true,
    phone: "", // ✅ add phone to form
  });

  /**
   * ✅ IMPORTANT:
   * After fixing SuperAdminDashboard, `stats` should already be an ARRAY from /coaching/all.
   * But we still support older shapes safely.
   */
  const rawNodes = useMemo(() => {
    if (Array.isArray(stats)) return stats;
    if (Array.isArray(stats?.data)) return stats.data;
    if (Array.isArray(stats?.centers)) return stats.centers;
    return [];
  }, [stats]);

  /**
   * Normalize IDs + normalize phone so UI always shows correctly.
   * Backend /coaching/all returns `phone` at root (not inside settings).
   */
  const nodes = useMemo(() => {
    return rawNodes.map((n) => ({
      ...n,
      _id: n?._id ?? n?.id ?? n?.centerId ?? null,
      // ✅ normalize phone so UI can display even if API changes
      phone:
        n?.phone ?? n?.settings?.contactNumber ?? n?.settings?.phone ?? "N/A",
    }));
  }, [rawNodes]);

  const handleOpenModal = (center = null) => {
    if (center) {
      setSelectedCenter(center);
      setFormData({
        name: center.name || "",
        slug: center.slug || "",
        adminEmail: center.email || "",
        subscriptionStatus: center.subscriptionStatus || "trial",
        paymentProcessed: center.paymentProcessed ?? true,
        adminPassword: "",
        phone: center.phone ?? center.settings?.contactNumber ?? "", // ✅ preload phone
      });
    } else {
      setSelectedCenter(null);
      setFormData({
        name: "",
        slug: "",
        adminEmail: "",
        adminPassword: "",
        subscriptionStatus: "trial",
        paymentProcessed: true,
        phone: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ payload aligned with backend
    const payload = {
      name: formData.name,
      slug: formData.slug,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword,
      subscriptionStatus: formData.subscriptionStatus,
      paymentProcessed: formData.paymentProcessed,
      phone: formData.phone || "", // ✅ this maps to settings.contactNumber in service/update
    };

    try {
      if (selectedCenter?._id) {
        await api.put(`/coaching/${selectedCenter._id}`, payload);
        toast.success("Infrastructure provision updated");
      } else {
        await api.post("/coaching/register", payload);
        toast.success("New node successfully established");
      }

      await refresh();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, node) => {
    if (!id) {
      console.error("DELETE FAILED – FULL NODE:", node);
      return toast.error("System Error: Node ID Missing");
    }
    if (
      !window.confirm(
        "Permanent Deletion: All node data will be purged. Continue?",
      )
    )
      return;

    try {
      await api.delete(`/coaching/${id}`);
      toast.success("Instance decommissioned");
      await refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Wipe operation failed");
    }
  };

  const filteredNodes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return nodes;
    return nodes.filter(
      (n) =>
        n.name?.toLowerCase().includes(term) ||
        n.slug?.toLowerCase().includes(term) ||
        n.email?.toLowerCase().includes(term),
    );
  }, [nodes, searchTerm]);

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

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden shadow-sm overflow-x-auto">
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
                Trial Health
              </th>
              <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Command
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredNodes.map((node, index) => {
              const trial = getTrialStatus(node.trialExpiryDate);
              const avatarChar = (node.name || "?").charAt(0).toUpperCase();

              return (
                <tr
                  key={node._id || `node-${index}`}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Instance Info */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-md">
                        {avatarChar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {node.name}
                          {node.slug ? (
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
                          ) : null}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                          <Zap size={10} className="text-amber-500" />{" "}
                          {node.slug ? `${node.slug}.academyos.com` : "—"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Access Point */}
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                        <Mail size={12} className="text-slate-400" />{" "}
                        {node.email || "—"}
                      </div>

                      {/* ✅ FIX: show phone from normalized `node.phone` */}
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                        <Phone size={12} className="text-slate-400" />{" "}
                        {node.phone || "N/A"}
                      </div>
                    </div>
                  </td>

                  {/* License */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${
                          node.subscriptionStatus === "paid"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-indigo-50 text-indigo-600 border-indigo-100"
                        }`}
                      >
                        {node.subscriptionStatus || "trial"}
                      </span>

                      {!node.paymentProcessed && (
                        <span className="text-[9px] font-bold text-rose-500 flex items-center gap-1 animate-pulse">
                          <AlertCircle size={10} /> Billing Warning
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Trial Health */}
                  <td className="px-6 py-6">
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
                  </td>

                  {/* Command */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenModal(node)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Settings2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(node._id, node)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedCenter ? "Infrastructure Update" : "Cluster Provisioning"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
          </div>

          {/* ✅ Phone input added */}
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
              placeholder="e.g. 017xxxxxxxx"
            />
          </div>

          <div className="p-6 bg-indigo-600 rounded-3xl text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Calendar size={18} /> License Management
                </h3>
                <p className="text-indigo-100 text-[10px] mt-0.5 font-medium">
                  Assign access tier and override billing status
                </p>
              </div>

              <select
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold uppercase outline-none"
                value={formData.subscriptionStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscriptionStatus: e.target.value,
                  })
                }
              >
                <option value="trial" className="text-slate-900">
                  Standard Trial
                </option>
                <option value="paid" className="text-slate-900">
                  Enterprise
                </option>
                <option value="suspended" className="text-slate-900">
                  Suspended
                </option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/10 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Manual Billing Bypass
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentProcessed: !formData.paymentProcessed,
                  })
                }
                className={`px-5 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  formData.paymentProcessed
                    ? "bg-white text-indigo-600"
                    : "bg-rose-500 text-white animate-pulse"
                }`}
              >
                {formData.paymentProcessed ? "Verified ✓" : "Pending Action"}
              </button>
            </div>
          </div>

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
            {selectedCenter
              ? "Apply Architecture Changes"
              : "Establish Deployment Node"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CentersManagement;
