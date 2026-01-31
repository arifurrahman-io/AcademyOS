import api from './api';

export const studentService = {
  /**
   * Retrieves all students belonging to the logged-in coaching center.
   * Scoped by coachingScope middleware on the backend.
   */
  getAll: async (params) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  /**
   * Enrolls a new student into the coaching node.
   * Includes financial profile (admission_fee, monthly_fee).
   */
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },

  /**
   * Fetches full profile details for a specific student.
   * Required for the StudentProfile view and pre-filling the Edit Form.
   */
  getById: async (id) => {
    // Hits GET /api/v1/students/:id
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  /**
   * Updates student information.
   * Used by StudentForm in 'isEdit' mode.
   */
  update: async (id, updateData) => {
    // Hits PUT /api/v1/students/:id
    const response = await api.put(`/students/${id}`, updateData);
    return response.data;
  },

  /**
   * Removes a student record from the center's registry.
   * Scoped by coaching_id to prevent cross-center deletion.
   */
  delete: async (id) => {
    // Hits DELETE /api/v1/students/:id
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  /**
   * Utility to fetch students filtered by a specific batch.
   * Optimized for the Dashboard recent activity feed.
   */
  getByBatch: async (batchName) => {
    const response = await api.get('/students', { params: { batch: batchName } });
    return response.data;
  }
};