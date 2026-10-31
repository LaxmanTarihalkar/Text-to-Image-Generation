import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiLightningBolt, HiShieldCheck, HiGlobe } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import GetStartedButton from '../components/GetStartedButton';

const SHOWCASE_IMAGES = [
  { prompt: 'Cyberpunk city at night', style: 'cyberpunk', url: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20at%20night%2C%20neon%20lights%2C%20futuristic?width=400&height=400&nologo=true&seed=1' },
  { prompt: 'Fantasy dragon', style: 'fantasy', url: 'https://image.pollinations.ai/prompt/fantasy%20dragon%20flying%20over%20mountains%2C%20epic%20art?width=400&height=400&nologo=true&seed=2' },
  { prompt: 'Anime warrior', style: 'anime', url: 'https://image.pollinations.ai/prompt/anime%20warrior%20girl%2C%20vibrant%20colors%2C%20detailed?width=400&height=400&nologo=true&seed=3' },
  { prompt: '3D abstract art', style: '3d', url: 'https://image.pollinations.ai/prompt/3D%20abstract%20geometric%20art%2C%20octane%20render?width=400&height=400&nologo=true&seed=4' },
  { prompt: 'Space nebula', style: 'realistic', url: 'https://image.pollinations.ai/prompt/space%20nebula%2C%20photorealistic%2C%208k?width=400&height=400&nologo=true&seed=5' },
  { prompt: 'Cartoon landscape', style: 'cartoon', url: 'https://image.pollinations.ai/prompt/cartoon%20magical%20landscape%2C%20colorful?width=400&height=400&nologo=true&seed=6' },
];

const FEATURES = [
  { icon: HiSparkles, title: 'AI-Powered Generation', desc: 'State-of-the-art AI models transform your text into stunning visuals in seconds.', color: 'violet' },
  { icon: HiLightningBolt, title: 'Lightning Fast', desc: 'Generate high-quality images in under 10 seconds with our optimized pipeline.', color: 'cyan' },
  { icon: HiShieldCheck, title: 'Secure & Private', desc: 'Your prompts and images are protected with enterprise-grade security.', color: 'green' },
  { icon: HiGlobe, title: 'Multiple Styles', desc: 'Choose from Realistic, Anime, 3D, Cartoon, Cyberpunk, and more art styles.', color: 'orange' },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Digital Artist', text: 'Pixora AI has completely transformed my creative workflow. The quality is absolutely incredible.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Game Developer', text: 'I use Pixora daily for concept art. The cyberpunk and fantasy styles are unmatched.', rating: 5 },
  { name: 'Priya Sharma', role: 'Content Creator', text: 'The best AI image generator I\'ve tried. Fast, beautiful results every time.', rating: 5 },
];

const FAQ_ITEMS = [
  { q: 'How does Pixora AI work?', a: 'Pixora AI uses advanced AI models to interpret your text prompts and generate unique, high-quality images based on your description and chosen style.' },
  { q: 'How many images can I generate for free?', a: 'Free users get 10 image generations per day. Credits reset every 24 hours automatically.' },
  { q: 'What image styles are available?', a: 'We offer Realistic, Anime, 3D Render, Cartoon, Cyberpunk, Fantasy, and Abstract styles.' },
  { q: 'Can I download my generated images?', a: 'Yes! All generated images can be downloaded in high resolution directly from your dashboard.' },
  { q: 'Is there a refund policy?', a: 'We offer a 7-day money-back guarantee on all paid plans if you\'re not satisfied.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-400 mb-6 border border-violet-500/20">
              <HiSparkles className="animate-pulse" />
              <span>Powered by Advanced AI • Free to Start</span>
            </div>

            <h1 className="font-poppins font-black text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6 text-slate-900 dark:text-white">
              Turn Words Into{' '}
              <span className="gradient-text text-glow">Stunning Art</span>
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Generate breathtaking AI artwork from simple text prompts. Choose your style, describe your vision, and watch magic happen.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GetStartedButton
                to="/register"
                text="Start Creating Free"
                float
                particles
              />
              <Link to="/pricing" className="btn-outline text-base px-8 py-4">
                View Pricing
              </Link>
            </div>

            <p className="text-slate-400 dark:text-slate-500 text-sm mt-4">No credit card required • 10 free generations/day</p>
          </motion.div>

          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* Image Showcase */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              AI Art <span className="gradient-text">Gallery</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400">All images generated by Pixora AI users</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SHOWCASE_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">{img.prompt}</p>
                    <span className="text-violet-400 text-xs">{img.style}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Why Choose <span className="gradient-text">Pixora AI</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Everything you need to create stunning AI artwork</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover p-6 text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-${f.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                  <f.icon className={`text-${f.color}-400 text-2xl`} />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Loved by <span className="gradient-text">Creators</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <FaStar key={j} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-slate-900 dark:text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Start free, upgrade when you need more</p>
            <GetStartedButton to="/pricing" text="View All Plans" />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-slate-900 dark:text-white">{item.q}</span>
                  <span className={`text-violet-500 dark:text-violet-400 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="px-5 pb-5"
                  >
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <div className="card p-10 gradient-border">
              <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
                Ready to Create?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Join thousands of creators using Pixora AI today.</p>
              <GetStartedButton
                to="/register"
                text="Get Started Free"
                particles
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
