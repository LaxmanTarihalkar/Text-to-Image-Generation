import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPhotograph, HiHeart, HiSparkles, HiCreditCard, HiArrowRight } from 'react-icons/hi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import StatsCard from '../../components/StatsCard';
import ImageCard from '../../components/ImageCard';
import SkeletonCard from '../../components/SkeletonCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, imagesRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/images/history?limit=4'),
        ]);
        setStats(statsRes.data.stats);
        setRecentImages(imagesRes.data.images);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Images Generated',
        data: [3, 7, 5, 10, 8, 12, 6],
        fill: true,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 4,
      },
    ],
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

  const planColors = { free: 'text-slate-400', pro: 'text-violet-400', premium: 'text-yellow-400' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening with your account</p>
        </div>
        <Link to="/dashboard/generate" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
          <HiSparkles />
          Generate
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={HiPhotograph} label="Total Images" value={stats?.totalImages ?? '—'} color="violet" />
        <StatsCard icon={HiSparkles} label="Credits Left" value={user?.subscriptionPlan === 'free' ? `${user?.credits}/10` : '∞'} color="cyan" />
        <StatsCard icon={HiHeart} label="Favorites" value="—" color="pink" />
        <StatsCard icon={HiCreditCard} label="Plan" value={<span className={`capitalize ${planColors[user?.subscriptionPlan]}`}>{user?.subscriptionPlan}</span>} color="green" />
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Generation Activity (This Week)</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Recent images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Generations</h2>
          <Link to="/dashboard/history" className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1">
            View all <HiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : recentImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentImages.map((img) => (
              <ImageCard key={img._id} image={img} onDelete={(id) => setRecentImages((p) => p.filter((i) => i._id !== id))} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <HiPhotograph className="text-slate-600 text-5xl mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">No images yet. Start creating!</p>
            <Link to="/dashboard/generate" className="btn-primary inline-flex items-center gap-2 text-sm">
              <HiSparkles /> Generate Your First Image
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade banner for free users */}
      {user?.subscriptionPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Unlock unlimited generations</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Upgrade to Pro for 500 images/month</p>
          </div>
          <Link to="/dashboard/subscription" className="btn-primary text-sm py-2 px-5 whitespace-nowrap">
            Upgrade Now
          </Link>
        </motion.div>
      )}
    </div>
  );
}
