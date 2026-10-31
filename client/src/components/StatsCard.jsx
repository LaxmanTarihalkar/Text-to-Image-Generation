import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, color = 'violet', trend }) => {
  const colors = {
    violet: 'from-violet-500/20 to-purple-500/20 border-violet-500/20 text-violet-400',
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/20 text-cyan-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/20 text-green-400',
    orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/20 text-orange-400',
    pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/20 text-pink-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-5 bg-gradient-to-br ${colors[color]} border`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color]}`}>
          <Icon size={20} className={colors[color].split(' ').pop()} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white font-poppins">{value}</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{label}</p>
    </motion.div>
  );
};

export default StatsCard;
