import React, { useState, useEffect } from 'react';
import { HiCash, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';
import api from '../../services/api';

const statusConfig = {
  success: { icon: HiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Success' },
  pending: { icon: HiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
  failed: { icon: HiXCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' },
};

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/history')
      .then(({ data }) => setPayments(data.payments))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Payment History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your transaction records</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">Plan</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-5 py-3">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const status = statusConfig[p.paymentStatus] || statusConfig.pending;
                  return (
                    <tr key={p._id} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-4">
                        <span className="capitalize font-medium text-slate-900 dark:text-white text-sm">{p.planName}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-sm">₹{p.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                          <status.icon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm">
                        {new Date(p.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-sm">
                        {new Date(p.expiryDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <HiCash className="text-slate-600 text-5xl mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No payment history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
