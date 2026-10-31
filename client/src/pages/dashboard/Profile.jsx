import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiCamera } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const planColors = { free: 'text-slate-400 bg-slate-700/50', pro: 'text-violet-400 bg-violet-500/20', premium: 'text-yellow-400 bg-yellow-500/20' };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-500 rounded-full flex items-center justify-center hover:bg-violet-400 transition-colors">
            <HiCamera size={14} className="text-white" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-lg">{user?.name}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize mt-1 inline-block ${planColors[user?.subscriptionPlan]}`}>
            {user?.subscriptionPlan} plan
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-5">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={user?.email}
                className="input-field pl-10 opacity-60 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Avatar URL (optional)</label>
            <input
              type="url"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="input-field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-3 px-6 flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Account Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Member Since', value: new Date(user?.createdAt).toLocaleDateString() },
            { label: 'Total Generated', value: user?.totalImagesGenerated || 0 },
            { label: 'Current Plan', value: user?.subscriptionPlan, capitalize: true },
            { label: 'Credits Left', value: user?.subscriptionPlan === 'free' ? `${user?.credits}/10` : 'Unlimited' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-100 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-slate-500 dark:text-slate-400 text-xs">{stat.label}</p>
              <p className={`text-slate-900 dark:text-white font-semibold mt-1 ${stat.capitalize ? 'capitalize' : ''}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
