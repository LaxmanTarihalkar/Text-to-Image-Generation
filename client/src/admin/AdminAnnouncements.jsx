import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBell, HiPlus, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const typeColors = {
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/admin/announcements');
      setAnnouncements(data.announcements);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/admin/announcements', form);
      setAnnouncements((prev) => [data.announcement, ...prev]);
      setForm({ title: '', message: '', type: 'info' });
      setShowForm(false);
      toast.success('Announcement created!');
    } catch {
      toast.error('Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.put(`/admin/announcements/${id}`);
      setAnnouncements((prev) => prev.map((a) => a._id === id ? data.announcement : a));
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Announcements</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Broadcast messages to all users</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <HiPlus /> New Announcement
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Create Announcement</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Announcement message..."
                rows={3}
                className="input-field resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input-field w-auto"
              >
                {['info', 'warning', 'success', 'error'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary text-sm py-2 px-5">
                {submitting ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm py-2 px-5">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann._id} className={`card p-4 border ${typeColors[ann.type]} ${!ann.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[ann.type]}`}>
                      {ann.type}
                    </span>
                    <span className={`text-xs ${ann.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                      {ann.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{ann.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{ann.message}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">{new Date(ann.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleToggle(ann._id)}
                  className={`text-xl transition-colors ${ann.isActive ? 'text-green-400 hover:text-red-400' : 'text-slate-500 hover:text-green-400'}`}
                >
                  {ann.isActive ? <HiEye /> : <HiEyeOff />}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <HiBell className="text-slate-600 text-5xl mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No announcements yet</p>
        </div>
      )}
    </div>
  );
}
