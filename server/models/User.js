const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    credits: {
      type: Number,
      default: 10,
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    lastCreditReset: {
      type: Date,
      default: Date.now,
    },
    totalImagesGenerated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reset daily credits for free users
userSchema.methods.resetDailyCredits = function () {
  const now = new Date();
  const lastReset = new Date(this.lastCreditReset);
  const hoursDiff = (now - lastReset) / (1000 * 60 * 60);

  if (hoursDiff >= 24 && this.subscriptionPlan === 'free') {
    this.credits = 10;
    this.lastCreditReset = now;
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);
