/**
 * Run this script once to create the admin user:
 * node utils/seedAdmin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteOne({ email: 'admin@pixora.ai' });

    await User.create({
      name: 'Admin',
      email: 'admin@pixora.ai',
      password: 'admin123',
      role: 'admin',
      credits: 999999,
      subscriptionPlan: 'premium',
    });

    console.log('✅ Admin created: admin@pixora.ai / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
