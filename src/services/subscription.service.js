import api from "./api";

export const subscriptionService = {
  /**
   * Super Admin dashboard monitor
   * GET /api/v1/subscriptions/monitor-all
   */
  getMonitorAll: async () => {
    const res = await api.get("/subscriptions/monitor-all");
    return res.data; // { success, data: [...] }
  },

  /**
   * Super Admin payment list
   * GET /api/v1/subscriptions/payments?status=pending&q=...
   */
  getPayments: async ({ status = "pending", q = "" } = {}) => {
    const res = await api.get("/subscriptions/payments", {
      params: { status, q },
    });
    return res.data;
  },

  /**
   * Verify payment
   * PATCH /api/v1/subscriptions/payments/:id/verify
   */
  verifyPayment: async (id, payload = {}) => {
    const res = await api.patch(
      `/subscriptions/payments/${id}/verify`,
      payload,
    );
    return res.data;
  },

  /**
   * Reject payment
   * PATCH /api/v1/subscriptions/payments/:id/reject
   */
  rejectPayment: async (id, payload = {}) => {
    const res = await api.patch(
      `/subscriptions/payments/${id}/reject`,
      payload,
    );
    return res.data;
  },
};
