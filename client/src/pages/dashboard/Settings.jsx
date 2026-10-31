import React, { useState } from 'react';
import { HiLockClosed, HiEye, HiEyeOff, HiBell, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function Settings() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, updates: false });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast.success('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Change password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <HiShieldCheck className="text-violet-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
            { key: 'new', label: 'New Password', placeholder: 'Min. 6 characters' },
            { key: 'confirm', label: 'Confirm New Password', placeholder: 'Repeat new password' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{field.label}</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passwords[field.key]}
                  onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="input-field pl-10 pr-10"
                  required
                />
                {field.key === 'new' && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPass ? <HiEyeOff /> : <HiEye />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6 flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <HiBell className="text-cyan-400" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates about your account via email' },
            { key: 'updates', label: 'Product Updates', desc: 'Get notified about new features and improvements' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-violet-500' : 'bg-slate-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-500/20">
        <h2 className="font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
        <button
          onClick={() => toast.error('Please contact support to delete your account')}
          className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm transition-all"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
