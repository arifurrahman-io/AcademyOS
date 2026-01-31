import React, { useState } from 'react';
import { reportService } from '../services/report.service';
import Button from '../components/Button';
import { FileText, Download } from 'lucide-react';

const StudentReport = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await reportService.downloadStudentReport();
    } catch (error) {
      alert("Failed to generate student report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">General Student List</h3>
          <p className="text-sm text-gray-500">Generate a PDF containing names, roll numbers, and batches of all active students.</p>
        </div>
      </div>
      <Button 
        onClick={handleDownload} 
        isLoading={loading}
        className="w-full md:w-auto"
      >
        <Download size={18} /> Download PDF
      </Button>
    </div>
  );
};

export default StudentReport;