import React, { useState, useEffect } from 'react';
import { HiCash, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusConfig = {
  success: { icon: HiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  pending: { icon: HiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  failed: { icon: HiXCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filter) params.append('status', filter);
      const { data } = await api.get(`/admin/payments?${params}`);
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [page, filter]);

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Payment Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{pagination?.total || 0} total transactions</p>
      </div>

      {/* Revenue summary */}
      <div className="card p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20 flex items-center gap-3">
        <HiCash className="text-green-400 text-2xl" />
        <div>
          <p className="text-slate-400 dark:text-slate-400 text-xs">Page Revenue (Successful)</p>
          <p className="text-slate-900 dark:text-white font-bold text-xl">₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['', 'success', 'pending', 'failed'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`text-sm px-3 py-1.5 rounded-lg transition-all ${filter === s ? 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
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
                  {['User', 'Plan', 'Amount', 'Status', 'Payment ID', 'Date', 'Expiry'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const status = statusConfig[p.paymentStatus] || statusConfig.pending;
                  return (
                    <tr key={p._id} className="border-b border-slate-100 dark:border-slate-700/20 hover:bg-slate-50 dark:hover:bg-slate-700/10 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-slate-900 dark:text-white text-sm">{p.userId?.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{p.userId?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm capitalize">{p.planName}</td>
                      <td className="px-4 py-3 text-slate-900 dark:text-white font-medium text-sm">₹{p.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                          <status.icon size={12} />
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 dark:text-slate-400 text-xs font-mono">{p.paymentId || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 dark:text-slate-400 text-xs">{new Date(p.transactionDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-400 dark:text-slate-400 text-xs">{new Date(p.expiryDate).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <HiCash className="text-slate-600 text-5xl mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No payments found</p>
          </div>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm py-2 px-4 disabled:opacity-40">Previous</button>
          <span className="text-slate-400 text-sm">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-outline text-sm py-2 px-4 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
