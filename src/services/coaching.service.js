import api from "./api";

/**
 * Service for managing Coaching Center nodes and Super-Admin registry.
 * Bridges the frontend to the backend coaching.controller.js aggregation.
 */
export const coachingService = {
  /**
   * Registers a new coaching center node and its initial admin user.
   * Logic: Triggers an atomic transaction on the backend.
   */
  register: async (centerData) => {
    const response = await api.post("/coaching/register", centerData);
    return response.data;
  },

  /**
   * Fetches the full list of coaching nodes for the Super-Admin Registry.
   * Logic: Calls the /all route which uses $lookup to join email/phone data.
   */
  getMonitorAll: async () => {
    // This route provides the merged data for "Access Email" and "Phone".
    const response = await api.get("/coaching/all");
    return response.data;
  },

  /**
   * Updates a specific center node's license, status, or warning flags.
   * Used for: Switching Trial to Paid, Deactivating, and Toggle Payment Warning.
   */
  update: async (id, updateData) => {
    // Matches: PUT /api/v1/coaching/:id
    const response = await api.put(`/coaching/${id}`, updateData);
    return response.data;
  },

  /**
   * Updates institute-specific settings like Classes/Levels and Batches.
   * Logic: Scoped to the logged-in Coaching Admin's session.
   */
  updateSettings: async (settingsData) => {
    const response = await api.put("/coaching/settings", {
      settings: settingsData,
    });
    return response.data;
  },

  /**
   * Removes a specific string item from the classes or batches arrays.
   * Matches: DELETE /api/v1/coaching/settings/:type/:value
   */
  removeItem: async (type, value) => {
    const response = await api.delete(`/coaching/settings/${type}/${value}`);
    return response.data;
  },

  /**
   * Purges a coaching center and all child data from the system.
   * Logic: Restricted to Super-Admin only.
   */
  delete: async (id) => {
    const response = await api.delete(`/coaching/${id}`);
    return response.data;
  },
};
