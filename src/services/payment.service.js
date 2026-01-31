import api from './api';

export const paymentService = {
  /**
   * Records a new fee payment for a student
   * @param {Object} paymentData - { student_id, amount, month, method }
   */
  collectFee: async (paymentData) => {
    const response = await api.post('/payments/collect', paymentData);
    return response.data;
  },

  /**
   * Retrieves all students who haven't paid for a specific month
   * @param {string} month - e.g., "January-2026"
   */
  getDefaulters: async (month) => {
    const response = await api.get('/payments/defaulters', { params: { month } });
    return response.data;
  },

  /**
   * Retrieves all payment records for the coaching center
   * Used for global revenue stats on the dashboard
   */
  getHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  /**
   * NEW: Fetches the transaction ledger for a specific student profile
   * Fixes the "is not a function" error in StudentProfile.jsx
   */
  getHistoryByStudent: async (studentId) => {
    // Hits GET /api/v1/payments/student/:id
    const response = await api.get(`/payments/student/${studentId}`);
    return response.data;
  },

  /**
   * Deletes or voids a payment record (Admin only)
   */
  voidPayment: async (paymentId) => {
    const response = await api.delete(`/payments/${paymentId}`);
    return response.data;
  }
};