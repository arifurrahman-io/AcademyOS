import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Mail,
  Globe,
  Zap,
  Search,
  SlidersHorizontal,
  Crown,
  ShieldCheck,
  LayoutGrid,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/Button";
import Modal from "../components/Modal";
import api from "../services/api";

const CentersManagement = () => {
  // stats is expected to be the array of centers from your updated backend
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
  });

  // Helper to ensure we are mapping the correct array if backend sends { success, data: [] }
  const nodes = Array.isArray(stats) ? stats : stats?.data || [];

  const handleOpenModal = (center = null) => {
    if (center) {
      setSelectedCenter(center);
      setFormData({
        name: center.name || "",
        slug: center.slug || "",
        adminEmail: center.email || "",
        subscriptionStatus: center.subscriptionStatus || "trial",
        paymentProcessed: center.paymentProcessed ?? true,
        adminPassword: "", // Leave blank for security during edits
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
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCenter) {
        // Uses the ID we verified in the DB aggregation
        await api.put(`/coaching/${selectedCenter._id}`, formData);
        toast.success("Node architecture updated");
      } else {
        await api.post("/coaching/register", formData);
        toast.success("New node initialized");
      }
      refresh();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (node) => {
    // Explicitly check for MongoDB _id
    const id = node._id || node.id;
    if (!id) return toast.error("System Error: Node ID Missing");

    if (
      !window.confirm(
        `CRITICAL: De-provision ${node.name}? All data will be wiped.`,
      )
    )
      return;

    try {
      await api.delete(`/coaching/${id}`);
      toast.success("Node disconnected");
      refresh();
    } catch (err) {
      toast.error("De-provisioning failed");
    }
  };

  const filteredNodes = nodes.filter(
    (n) =>
      n.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <LayoutGrid size={20} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Node{" "}
              <span className="text-slate-400 font-light">Orchestrator</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Managing{" "}
            <span className="text-slate-900 font-bold">{nodes.length}</span>{" "}
            global AcademyOS coaching deployments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Filter by name or slug..."
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 ring-blue-500/10 outline-none w-64 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="rounded-2xl bg-slate-900 hover:bg-blue-600 text-white shadow-xl shadow-slate-200 px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all"
          >
            <Plus size={16} className="mr-2" /> Register Node
          </Button>
        </div>
      </header>

      {/* Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNodes.map((node) => (
          <div
            key={node._id}
            className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
          >
            {/* Status & Subscription */}
            <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
              <div
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  node.subscriptionStatus === "paid"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-blue-50 border-blue-100 text-blue-500"
                }`}
              >
                {node.subscriptionStatus}
              </div>
              {!node.paymentProcessed && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 animate-pulse text-[8px] font-black uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                  Review Payment
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:bg-blue-600 transition-colors">
                {node.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {node.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <Globe size={12} className="text-blue-500" /> {node.slug}
                  .academyos.com
                </p>
              </div>
            </div>

            {/* Node Metadata */}
            <div className="grid grid-cols-1 gap-3 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
                <Mail size={14} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-600 truncate">
                  {node.email || "no-contact-node"}
                </span>
              </div>

              <div className="flex justify-between items-center px-2 py-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <Zap size={14} className="text-amber-400" /> Node Health
                </div>
                <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[95%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 text-[9px] font-bold text-slate-400 uppercase italic">
                <Clock size={12} /> Registered:{" "}
                {new Date(node.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Command Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleOpenModal(node)}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 shadow-lg shadow-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <SlidersHorizontal size={14} /> Configure
              </button>
              <button
                onClick={() => handleDelete(node)}
                className="p-4 border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 rounded-2xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedCenter ? "Update Node Architecture" : "Initialize New Node"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Center Name
              </label>
              <input
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 ring-blue-500/20"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Subdomain Slug
              </label>
              <input
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 ring-blue-500/20"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
          </div>

          <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
                <Crown size={14} /> License Tier
              </div>
              <select
                className="bg-white border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer"
                value={formData.subscriptionStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subscriptionStatus: e.target.value,
                  })
                }
              >
                <option value="trial">Free Trial</option>
                <option value="paid">Paid Premium</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-blue-100/30">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Verify Payment
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentProcessed: !formData.paymentProcessed,
                  })
                }
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  formData.paymentProcessed
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : "bg-amber-500 text-white animate-pulse shadow-lg"
                }`}
              >
                {formData.paymentProcessed
                  ? "Processed ✓"
                  : "Review Required !"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 ring-blue-500/20"
                placeholder="admin@node.com"
                value={formData.adminEmail}
                onChange={(e) =>
                  setFormData({ ...formData, adminEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Node Secret
              </label>
              <input
                type="password"
                placeholder={selectedCenter ? "Unchanged" : "••••••••"}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold focus:ring-2 ring-blue-500/20"
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
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all"
          >
            {selectedCenter
              ? "Push Architecture Changes"
              : "Initialize Center Node"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CentersManagement;
