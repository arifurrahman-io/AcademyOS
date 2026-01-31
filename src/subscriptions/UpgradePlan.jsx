import React, { useState } from 'react';
import { Check, Smartphone, Landmark, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Modal from '../components/Modal';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

const UpgradePlan = () => {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [paymentData, setPaymentData] = useState({
    senderNumber: '',
    transactionId: '',
    method: 'bKash'
  });

  const plans = [
    {
      name: 'Yearly Pro',
      price: 250, // Updated to 250 BDT
      features: ['Unlimited Students', 'Advanced Analytics', 'PDF Reports', 'Multi-staff Access', '7/24 Support'],
      recommended: true
    }
  ];

  const handleOpenPayment = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits the upgrade-center endpoint with payment proof
      await api.post('/subscriptions/request-upgrade', {
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        ...paymentData
      });
      toast.success("Payment submitted! Wait for Admin verification.");
      setShowPaymentModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Activate Your License</h2>
        <p className="text-slate-500 mt-2 font-medium">Professional tools for professional coaching centers.</p>
      </div>

      <div className="max-w-xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="p-10 rounded-[2.5rem] border-4 border-blue-600 bg-white shadow-2xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest">
              Recommended
            </div>
            
            <h3 className="text-3xl font-black text-slate-800">{plan.name}</h3>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-900">{formatCurrency(plan.price)}</span>
              <span className="text-slate-400 font-bold">/year</span>
            </div>

            <ul className="mt-8 space-y-4">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-600 font-medium">
                  <div className="bg-emerald-100 p-1 rounded-full"><Check size={14} className="text-emerald-600" /></div>
                  {f}
                </li>
              ))}
            </ul>

            <Button onClick={() => handleOpenPayment(plan)} className="w-full mt-10 py-4 rounded-2xl shadow-lg shadow-blue-200">
              Upgrade Now
            </Button>
          </div>
        ))}
      </div>

      {/* Payment Submission Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Complete Payment">
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white">
            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Merchant Accounts</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-sm font-bold flex items-center gap-2"><Smartphone size={16}/> bKash/Nagad</span>
                <span className="text-lg font-mono font-black text-blue-400">01684516151</span>
              </div>
              <p className="text-[10px] text-slate-400 italic font-medium">Instructions: Send Money to the number above, then submit the Transaction ID below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setPaymentData({...paymentData, method: 'bKash'})}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${paymentData.method === 'bKash' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 text-slate-400'}`}
              >bKash</button>
              <button 
                type="button"
                onClick={() => setPaymentData({...paymentData, method: 'Nagad'})}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${paymentData.method === 'Nagad' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}
              >Nagad</button>
            </div>

            <div className="space-y-3">
              <input 
                placeholder="Sender Phone Number" 
                required
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10"
                value={paymentData.senderNumber}
                onChange={e => setPaymentData({...paymentData, senderNumber: e.target.value})}
              />
              <input 
                placeholder="Transaction ID (TrxID)" 
                required
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-mono"
                value={paymentData.transactionId}
                onChange={e => setPaymentData({...paymentData, transactionId: e.target.value})}
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full py-4 rounded-2xl">
              Submit Payment Proof
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UpgradePlan;