import React, { useState } from 'react';
import { paymentService } from '../services/payment.service';
import Button from '../components/Button';
import { formatCurrency } from '../utils/format';

const PaymentForm = ({ student, onSuccess }) => {
  const [formData, setFormData] = useState({
    student_id: student._id,
    amount: '',
    month: '', // e.g., 'January-2026'
    method: 'Cash'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const months = [
    "January-2026", "February-2026", "March-2026", "April-2026",
    "May-2026", "June-2026", "July-2026", "August-2026",
    "September-2026", "October-2026", "November-2026", "December-2026"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await paymentService.collectFee(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Payment recording failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-blue-50 rounded-md mb-4">
        <p className="text-sm text-blue-800">Recording payment for: <strong>{student.name}</strong></p>
      </div>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Select Month</label>
        <select 
          required
          className="w-full p-2 border rounded-md"
          value={formData.month}
          onChange={(e) => setFormData({...formData, month: e.target.value})}
        >
          <option value="">-- Choose Month --</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount (BDT)</label>
          <input 
            type="number" 
            required 
            className="w-full p-2 border rounded-md"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={formData.method}
            onChange={(e) => setFormData({...formData, method: e.target.value})}
          >
            <option value="Cash">Cash</option>
            <option value="bKash">bKash</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      <Button type="submit" isLoading={loading} className="w-full">
        Confirm Collection
      </Button>
    </form>
  );
};

export default PaymentForm;