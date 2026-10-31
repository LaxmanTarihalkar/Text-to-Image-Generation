import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSparkles, HiHome, HiPhotograph, HiClock, HiHeart,
  HiCreditCard, HiCash, HiUser, HiCog, HiLogout, HiMenuAlt3, HiX,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: HiHome, end: true },
  { path: '/dashboard/generate', label: 'Generate', icon: HiSparkles },
  { path: '/dashboard/history', label: 'History', icon: HiClock },
  { path: '/dashboard/favorites', label: 'Favorites', icon: HiHeart },
  { path: '/dashboard/subscription', label: 'Subscription', icon: HiCreditCard },
  { path: '/dashboard/payments', label: 'Payments', icon: HiCash },
  { path: '/dashboard/profile', label: 'Profile', icon: HiUser },
  { path: '/dashboard/settings', label: 'Settings', icon: HiCog },
];

const planColors = {
  free: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50',
  pro: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/20',
  premium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20',
};

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <HiSparkles className="text-white text-sm" />
          </div>
          <span className="font-poppins font-bold text-lg gradient-text">Pixora AI</span>
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

      {/* User info */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${planColors[user?.subscriptionPlan]}`}>
              {user?.subscriptionPlan}
            </span>
          </div>
        </div>
        {user?.subscriptionPlan === 'free' && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Daily Credits</span>
              <span>{user?.credits}/10</span>
            </div>
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all"
                style={{ width: `${(user?.credits / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
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

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <HiLogout size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass-dark border-r border-slate-200 dark:border-slate-700/50 fixed h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
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
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass-dark border-r border-slate-200 dark:border-slate-700/50 z-50 lg:hidden"
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 glass-dark border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <HiMenuAlt3 size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-cyan-500 rounded flex items-center justify-center">
              <HiSparkles className="text-white text-xs" />
            </div>
            <span className="font-poppins font-bold gradient-text">Pixora AI</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
