import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheck, HiSparkles, HiLightningBolt, HiStar } from 'react-icons/hi';
import GetStartedButton from '../components/GetStartedButton';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    icon: HiSparkles,
    color: 'slate',
    features: [
      '10 image generations/day',
      'Basic styles (Realistic, Anime)',
      'Standard resolution',
      'Image history (30 days)',
      'Community support',
    ],
    cta: 'Get Started Free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: 999,
    period: 'month',
    icon: HiLightningBolt,
    color: 'violet',
    features: [
      '500 image generations/month',
      'All art styles',
      'HD resolution downloads',
      'Priority generation',
      'Unlimited history',
      'Email support',
    ],
    cta: 'Start Pro Plan',
    href: '/register',
    popular: true,
  },
  {
    name: 'Premium',
    price: 1999,
    period: 'month',
    icon: HiStar,
    color: 'yellow',
    features: [
      'Unlimited generations',
      'All styles + exclusive ones',
      '4K resolution downloads',
      'Fastest generation speed',
      'Priority access',
      'Dedicated support',
      'API access',
    ],
    cta: 'Go Premium',
    href: '/register',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-poppins font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Start free, upgrade when you need more power. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-6 relative ${plan.popular ? 'border-violet-500/50 box-glow' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-5">
                <div className={`w-10 h-10 rounded-xl bg-${plan.color}-500/20 flex items-center justify-center mb-3`}>
                  <plan.icon className={`text-${plan.color}-400 text-xl`} />
                </div>
                <h3 className="font-poppins font-bold text-xl text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-slate-400 dark:text-slate-400 text-sm">/{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <HiCheck className="text-violet-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.popular ? (
                <GetStartedButton
                  to={plan.href}
                  text={plan.cta}
                  size="sm"
                  className="w-full"
                />
              ) : (
                <Link
                  to={plan.href}
                  className="block text-center py-3 rounded-full font-semibold transition-all duration-300 btn-outline"
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-slate-400 dark:text-slate-400 text-sm"
        >
          All plans include a 7-day money-back guarantee. Prices in INR. Billed monthly.
        </motion.div>
      </div>
    </div>
  );
}
