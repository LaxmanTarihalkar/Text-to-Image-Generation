import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiUsers, HiPhotograph, HiCash, HiFlag, HiTrendingUp, HiClock } from 'react-icons/hi';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    api.get('/admin/analytics')
      .then(({ data }) => setAnalytics(data.analytics))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const dailyLabels = analytics?.dailyStats?.map((d) => d._id) || [];
  const dailyCounts = analytics?.dailyStats?.map((d) => d.count) || [];

  const lineData = {
    labels: dailyLabels,
    datasets: [{
      label: 'Images Generated',
      data: dailyCounts,
      fill: true,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#8b5cf6',
    }],
  };

  const revenueData = {
    labels: analytics?.revenueByPlan?.map((r) => r._id) || [],
    datasets: [{
      data: analytics?.revenueByPlan?.map((r) => r.total) || [],
      backgroundColor: ['rgba(139, 92, 246, 0.8)', '#06b6d4', '#f59e0b'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 15 } },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HiUsers} label="Total Users" value={analytics?.totalUsers ?? 0} color="violet" />
        <StatsCard icon={HiPhotograph} label="Total Images" value={analytics?.totalImages ?? 0} color="cyan" />
        <StatsCard icon={HiCash} label="Revenue" value={`₹${analytics?.totalRevenue ?? 0}`} color="green" />
        <StatsCard icon={HiFlag} label="Pending Reports" value={analytics?.pendingReports ?? 0} color="orange" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HiTrendingUp} label="Active Users (7d)" value={analytics?.activeUsers ?? 0} color="pink" />
        <StatsCard icon={HiUsers} label="New Users (30d)" value={analytics?.newUsersThisMonth ?? 0} color="violet" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Daily Image Generation (7 Days)</h2>
          <Line data={lineData} options={chartOptions} />
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue by Plan</h2>
          {analytics?.revenueByPlan?.length > 0 ? (
            <Doughnut data={revenueData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No revenue data</div>
          )}
        </div>
      </div>

      {/* Recent payments */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HiClock className="text-violet-400" /> Recent Payments
        </h2>
        {analytics?.recentPayments?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/50">
                  <th className="text-left text-xs text-slate-500 dark:text-slate-400 px-3 py-2">User</th>
                  <th className="text-left text-xs text-slate-500 dark:text-slate-400 px-3 py-2">Plan</th>
                  <th className="text-left text-xs text-slate-500 dark:text-slate-400 px-3 py-2">Amount</th>
                  <th className="text-left text-xs text-slate-500 dark:text-slate-400 px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentPayments.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 dark:border-slate-700/20">
                    <td className="px-3 py-3 text-sm text-slate-900 dark:text-white">{p.userId?.name}</td>
                    <td className="px-3 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">{p.planName}</td>
                    <td className="px-3 py-3 text-sm text-green-400">₹{p.amount}</td>
                    <td className="px-3 py-3 text-sm text-slate-400 dark:text-slate-400">{new Date(p.transactionDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-8">No payments yet</p>
        )}
      </div>
    </div>
  );
}
