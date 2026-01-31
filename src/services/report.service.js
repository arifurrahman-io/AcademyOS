import api from './api';

export const reportService = {
  downloadStudentReport: async () => {
    const response = await api.get('/reports/students', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadDefaulterReport: async (month) => {
    const response = await api.get('/reports/defaulters', { 
      params: { month }, 
      responseType: 'blob' 
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `defaulters_${month}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};