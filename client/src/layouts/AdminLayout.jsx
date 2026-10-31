import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSparkles, HiChartBar, HiUsers, HiPhotograph,
  HiFlag, HiCash, HiBell, HiLogout, HiMenuAlt3, HiX, HiShieldCheck,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: HiChartBar, end: true },
  { path: '/admin/users', label: 'Users', icon: HiUsers },
  { path: '/admin/images', label: 'Images', icon: HiPhotograph },
  { path: '/admin/reports', label: 'Reports', icon: HiFlag },
  { path: '/admin/payments', label: 'Payments', icon: HiCash },
  { path: '/admin/announcements', label: 'Announcements', icon: HiBell },
];

const AdminSidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent">
      <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <HiShieldCheck className="text-white text-sm" />
          </div>
          <div>
            <span className="font-poppins font-bold text-sm text-slate-900 dark:text-white">Admin Panel</span>
            <p className="text-xs text-slate-400 dark:text-slate-500">Pixora AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white lg:hidden"
            >
              <HiX size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-medium text-sm">{user?.name}</p>
            <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 space-y-1">
        <NavLink
          to="/dashboard"
          className="sidebar-link text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
        >
          <HiSparkles size={18} />
          <span className="text-sm font-medium">User Dashboard</span>
        </NavLink>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="sidebar-link w-full text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <HiLogout size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex">
      <aside className="hidden lg:flex flex-col w-64 glass-dark border-r border-slate-200 dark:border-slate-700/50 fixed h-full z-30">
        <AdminSidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass-dark border-r border-slate-200 dark:border-slate-700/50 z-50 lg:hidden"
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 glass-dark border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <HiMenuAlt3 size={24} />
          </button>
          <span className="font-poppins font-bold text-red-500 dark:text-red-400">Admin Panel</span>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
