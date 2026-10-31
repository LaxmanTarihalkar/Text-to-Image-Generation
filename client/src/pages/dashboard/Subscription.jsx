import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCheck, HiSparkles, HiLightningBolt, HiStar, HiCreditCard } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: HiSparkles,
    color: 'slate',
    features: ['10 images/day', 'Basic styles', 'Standard resolution', '30-day history'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    icon: HiLightningBolt,
    color: 'violet',
    features: ['500 images/month', 'All styles', 'HD downloads', 'Priority generation', 'Unlimited history'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    icon: HiStar,
    color: 'yellow',
    features: ['Unlimited images', 'Exclusive styles', '4K downloads', 'Fastest speed', 'Priority support', 'API access'],
  },
];

export default function Subscription() {
  const { user, updateUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    api.get('/payments/subscription').then(({ data }) => setSubscription(data.subscription));
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === 'free') return;
    setProcessingPlan(planId);
    setLoading(true);

    try {
      const { data } = await api.post('/payments/create-order', { planName: planId });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Pixora AI',
        description: `${data.plan.name} Plan Subscription`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success(`🎉 ${data.plan.name} plan activated!`);
            updateUser({ subscriptionPlan: planId, credits: data.plan.credits });
            setSubscription({ plan: planId, isActive: true });
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#8b5cf6' },
        modal: { ondismiss: () => toast('Payment cancelled') },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
      setProcessingPlan(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Subscription</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your plan and billing</p>
      </div>

      {/* Current plan */}
      <div className="card p-5 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-violet-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 dark:text-slate-400 text-sm">Current Plan</p>
            <p className="font-poppins font-bold text-xl text-slate-900 dark:text-white capitalize mt-1">{user?.subscriptionPlan}</p>
            {subscription?.expiry && (
              <p className="text-slate-400 text-xs mt-1">
                Expires: {new Date(subscription.expiry).toLocaleDateString()}
              </p>
            )}
          </div>
          <HiCreditCard className="text-violet-400 text-3xl" />
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => {
          const isCurrent = user?.subscriptionPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card p-5 relative ${plan.popular ? 'border-violet-500/50' : ''} ${isCurrent ? 'border-green-500/40' : ''}`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT
                  </span>
                </div>
              )}

              <div className="mb-4">
                <plan.icon className={`text-${plan.color}-400 text-2xl mb-2`} />
                <h3 className="font-poppins font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-slate-400 text-xs">/month</span>}
                </div>
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <HiCheck className="text-violet-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || plan.id === 'free' || (loading && processingPlan === plan.id)}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isCurrent
                    ? 'bg-green-500/20 text-green-400 cursor-default'
                    : plan.id === 'free'
                    ? 'bg-slate-700/50 text-slate-500 cursor-default'
                    : 'btn-primary'
                }`}
              >
                {loading && processingPlan === plan.id ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : isCurrent ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Free Plan'
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <p className="text-slate-400 dark:text-slate-500 text-xs text-center">
        Payments processed securely via Razorpay. 7-day money-back guarantee.
      </p>
    </div>
  );
}
