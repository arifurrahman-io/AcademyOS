import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import Modal from "../components/Modal";
import Button from "../components/Button";

const TABS = [
  { key: "pending", label: "Pending", icon: <Clock3 size={14} /> },
  { key: "verified", label: "Verified", icon: <CheckCircle2 size={14} /> },
  { key: "rejected", label: "Rejected", icon: <XCircle size={14} /> },
];

const normalizeList = (payload) => {
  // Supports:
  // 1) { items: [], meta:{} }
  // 2) []
  // 3) { data: { items: [] } } (extra nesting)
  if (!payload) return { items: [], meta: null };

  if (Array.isArray(payload)) return { items: payload, meta: null };

  if (Array.isArray(payload.items))
    return { items: payload.items, meta: payload.meta || null };

  if (payload.data) return normalizeList(payload.data);

  return { items: [], meta: null };
};

const SuperAdminPaymentsManagement = () => {
  const [tab, setTab] = useState("pending");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [items, setItems] = useState([]); // ALWAYS ARRAY ✅
  const [meta, setMeta] = useState(null);

  // verify modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const fetchPayments = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    setLoading(true);

    try {
      const res = await api.get("/subscriptions/payments", {
        params: { status: tab, q },
      });

      // Backend returns: { success:true, data:{ items, meta } }
      const normalized = normalizeList(res.data?.data);
      setItems(normalized.items);
      setMeta(normalized.meta);

      if (showToast) toast.success("Payments synced");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filtered = useMemo(() => {
    // items is always array ✅
    if (!q.trim()) return items;

    const s = q.trim().toLowerCase();

    return items.filter((p) => {
      const centerName = p.coaching_id?.name || "";
      const slug = p.coaching_id?.slug || "";
      const trx = p.trxId || p.transactionId || "";
      const sender = p.senderNumber || "";
      const method = p.method || "";

      return (
        centerName.toLowerCase().includes(s) ||
        slug.toLowerCase().includes(s) ||
        trx.toLowerCase().includes(s) ||
        sender.toLowerCase().includes(s) ||
        method.toLowerCase().includes(s)
      );
    });
  }, [items, q]);

  const openVerify = (payment) => {
    setSelected(payment);
    setOpen(true);
  };

  const handleVerify = async () => {
    if (!selected?._id) return toast.error("Payment ID missing");
    setVerifying(true);
    try {
      // your backend route: PUT /subscriptions/payments/:paymentId/verify
      await api.put(`/subscriptions/payments/${selected._id}/verify`, {
        action: "verify", // optional, keep for future
      });

      toast.success("Payment verified. 1 year activated.");
      setOpen(false);
      setSelected(null);
      fetchPayments(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verify failed");
    } finally {
      setVerifying(false);
    }
  };

  const badge = (status) => {
    const map = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
      rejected: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return map[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-7 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={12} />
            Subscription Payments
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Billing & Verification Console
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Review bKash/Nagad payments, verify to activate 1-year access.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPayments(true)}
              placeholder="Search center, trx, sender..."
              className="w-80 max-w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-semibold text-sm"
            />
          </div>

          <button
            onClick={() => fetchPayments(true)}
            disabled={refreshing}
            className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Syncing" : "Sync"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all
              ${
                tab === t.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-black text-slate-800">
            Records: <span className="text-blue-600">{filtered.length}</span>
          </p>
          {meta?.total != null ? (
            <p className="text-[11px] font-bold text-slate-400">
              Total: {meta.total} • Page {meta.page}/{meta.pages}
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="p-10 text-slate-500 font-semibold">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-slate-500 font-semibold">
            No payments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Center
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Method
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Sender
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    TrxID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const center = p.coaching_id || {};
                  const status = p.status || tab;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-5">
                        <div className="space-y-0.5">
                          <p className="font-black text-slate-900">
                            {center.name || "Unknown"}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400">
                            {center.slug ? `${center.slug}.academyos.com` : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-black text-slate-700">
                          {p.method || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-700">
                          {p.senderNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-mono font-black text-slate-800">
                          {p.trxId || p.transactionId || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-black text-slate-900">
                          {p.amount ?? 1200} BDT
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-[10px] font-black uppercase ${badge(
                            status,
                          )}`}
                        >
                          {status}
                          {status === "verified" ? (
                            <BadgeCheck size={14} />
                          ) : null}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        {status === "pending" ? (
                          <button
                            onClick={() => openVerify(p)}
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
                          >
                            Verify
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verify Modal */}
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        title="Verify Payment"
      >
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-sm font-black text-slate-900">
              {selected?.coaching_id?.name || "Unknown Center"}
            </p>
            <p className="text-[11px] text-slate-500 font-bold mt-1">
              Method: {selected?.method || "N/A"} • Sender:{" "}
              {selected?.senderNumber || "N/A"}
            </p>
            <p className="text-[11px] text-slate-500 font-bold mt-1">
              TrxID:{" "}
              <span className="font-mono">
                {selected?.trxId || selected?.transactionId || "N/A"}
              </span>{" "}
              • Amount: {selected?.amount ?? 1200} BDT
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleVerify}
              isLoading={verifying}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500"
            >
              Approve & Activate 1 Year
            </Button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            After approval, the coaching node will be active for 1 year from
            verification date.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default SuperAdminPaymentsManagement;
