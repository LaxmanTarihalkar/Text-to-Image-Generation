import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiSparkles } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <div className="font-poppins font-black text-[120px] sm:text-[180px] leading-none gradient-text opacity-20 select-none">
          404
        </div>
        <div className="-mt-8">
          <HiSparkles className="text-violet-400 text-4xl mx-auto mb-4 animate-pulse" />
          <h1 className="font-poppins font-bold text-3xl text-slate-900 dark:text-white mb-3">Page Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Looks like this page got lost in the AI dimension. Let's get you back on track.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <HiHome />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
