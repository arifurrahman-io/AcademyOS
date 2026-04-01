import api from "./api";

/**
 * Utility to trigger browser download from a blob response
 */
const triggerDownload = (data, filename) => {
  const url = window.URL.createObjectURL(
    new Blob([data], { type: "application/pdf" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const reportService = {
  /**
   * @desc Download complete student registry as PDF
   */
  downloadStudentReport: async () => {
    const response = await api.get("/reports/students", {
      responseType: "blob",
    });
    triggerDownload(
      response.data,
      `AcademyOS_Student_Registry_${Date.now()}.pdf`,
    );
  },

  /**
   * @desc Download list of defaulters for a specific month
   */
  downloadDefaulterReport: async (month) => {
    const response = await api.get("/reports/defaulters", {
      params: { month },
      responseType: "blob",
    });
    triggerDownload(response.data, `Defaulters_${month.replace(" ", "_")}.pdf`);
  },

  /**
   * @desc Download a specific payment receipt
   */
  downloadPaymentReceipt: async (paymentId) => {
    const response = await api.get(`/reports/receipt/${paymentId}`, {
      responseType: "blob",
    });
    triggerDownload(response.data, `Receipt_${paymentId.slice(-6)}.pdf`);
  },

  /**
   * @desc Download general collection report for institute audit
   */
  downloadCollectionReport: async (startDate, endDate) => {
    const response = await api.get("/reports/collections", {
      params: { startDate, endDate },
      responseType: "blob",
    });
    triggerDownload(
      response.data,
      `Collection_Report_${startDate}_to_${endDate}.pdf`,
    );
  },
};
