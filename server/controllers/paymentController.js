const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan configurations
const PLANS = {
  pro: { amount: 99900, credits: 500, durationDays: 30, name: 'Pro' },
  premium: { amount: 199900, credits: 999999, durationDays: 30, name: 'Premium' },
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
const createOrder = async (req, res, next) => {
  try {
    const { planName } = req.body;

    if (!PLANS[planName]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const plan = PLANS[planName];

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { planName, userId: req.user._id.toString() },
    });

    // Save pending payment
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    await Payment.create({
      userId: req.user._id,
      planName,
      amount: plan.amount / 100,
      orderId: order.id,
      paymentStatus: 'pending',
      expiryDate,
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      plan: { ...plan, planName },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id, paymentStatus: 'success', signature: razorpay_signature },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Update user subscription
    const plan = PLANS[payment.planName];
    await User.findByIdAndUpdate(payment.userId, {
      subscriptionPlan: payment.planName,
      subscriptionExpiry: payment.expiryDate,
      credits: plan.credits,
    });

    res.json({ success: true, message: 'Payment verified successfully', payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscription status
// @route   GET /api/payments/subscription
const getSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();

    let isActive = false;
    if (user.subscriptionPlan !== 'free' && user.subscriptionExpiry) {
      isActive = new Date(user.subscriptionExpiry) > now;
      if (!isActive) {
        // Expire subscription
        await User.findByIdAndUpdate(user._id, { subscriptionPlan: 'free', credits: 10 });
      }
    }

    res.json({
      success: true,
      subscription: {
        plan: user.subscriptionPlan,
        expiry: user.subscriptionExpiry,
        isActive,
        credits: user.credits,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment, getPaymentHistory, getSubscription };
