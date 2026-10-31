import React, { useState, useEffect } from 'react';
import { HiFlag, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  reviewed: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
  dismissed: 'bg-slate-500/20 text-slate-400',
};

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/admin/reports${params}`);
      setReports(data.reports);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [filter]);

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/admin/reports/${id}`, { status });
      setReports((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      toast.success('Report updated');
    } catch {
      toast.error('Failed to update report');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage reported content</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'reviewed', 'resolved', 'dismissed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
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
        ) : reports.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-700/30">
            {reports.map((report) => (
              <div key={report._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-slate-500 capitalize">{report.reason?.replace('_', ' ')}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Reported by: <span className="text-slate-900 dark:text-white">{report.userId?.name}</span>
                    </p>
                    {report.imageId && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-1">
                        Image: {report.imageId.prompt}
                      </p>
                    )}
                    {report.description && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">"{report.description}"</p>
                    )}
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>

                  {report.imageId?.imageUrl && (
                    <img src={report.imageId.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}

                  <div className="flex flex-col gap-1">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdate(report._id, 'resolved')}
                          className="p-1.5 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Resolve"
                        >
                          <HiCheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdate(report._id, 'dismissed')}
                          className="p-1.5 text-slate-400 hover:bg-slate-500/20 rounded-lg transition-colors"
                          title="Dismiss"
                        >
                          <HiXCircle size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <HiFlag className="text-slate-600 text-5xl mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
