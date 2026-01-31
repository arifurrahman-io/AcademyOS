import React, { useState } from 'react';
import { reportService } from '../services/report.service';
import Button from '../components/Button';
import { CreditCard, Download } from 'lucide-react';

const PaymentReport = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    // Note: You can add date range filters here to pass to the backend
    try {
      // Logic for generic payment history export
      await reportService.downloadPaymentReport(); 
    } catch (error) {
      alert("Failed to generate payment report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full">
          <CreditCard size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Collection Summary</h3>
          <p className="text-sm text-gray-500">Review all financial transactions and payment methods used (Cash, bKash, etc.).</p>
        </div>
      </div>
      <Button 
        variant="secondary" 
        onClick={handleDownload} 
        isLoading={loading}
      >
        <Download size={18} /> Download Summary
      </Button>
    </div>
  );
};

export default PaymentReport;