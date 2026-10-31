import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiLightningBolt, HiGlobe, HiHeart } from 'react-icons/hi';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-poppins font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            About <span className="gradient-text">Pixora AI</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We're on a mission to democratize AI art creation, making it accessible to everyone — from professional artists to curious beginners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: HiSparkles, title: 'Our Mission', color: 'violet', desc: 'To empower every person with the ability to create stunning visual art using the power of artificial intelligence, regardless of artistic skill.' },
            { icon: HiLightningBolt, title: 'Our Technology', color: 'cyan', desc: 'Pixora AI is powered by state-of-the-art diffusion models, delivering photorealistic and artistic images from simple text descriptions.' },
            { icon: HiGlobe, title: 'Our Community', color: 'green', desc: 'Join thousands of creators, artists, and developers who use Pixora AI to bring their imagination to life every single day.' },
            { icon: HiHeart, title: 'Our Values', color: 'pink', desc: 'We believe in creativity, accessibility, and responsible AI. Every feature we build is designed with our users\' needs at heart.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-4`}>
                <item.icon className={`text-${item.color}-400 text-2xl`} />
              </div>
              <h3 className="font-poppins font-bold text-xl text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8 text-center gradient-border"
        >
          <h2 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white mb-4">Built with ❤️ for Creators</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Pixora AI is a full-stack SaaS platform built with the MERN stack, featuring real-time AI image generation, subscription management, and a professional admin dashboard. We're constantly improving and adding new features based on community feedback.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
