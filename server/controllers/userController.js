const User = require('../models/User');
const Image = require('../models/Image');
const Announcement = require('../models/Announcement');

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    res.json({
      success: true,
      message: 'Profile updated',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
const getUserStats = async (req, res, next) => {
  try {
    const [totalImages, user] = await Promise.all([
      Image.countDocuments({ userId: req.user._id, isDeleted: false }),
      User.findById(req.user._id),
    ]);

    res.json({
      success: true,
      stats: {
        totalImages,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan,
        totalImagesGenerated: user.totalImagesGenerated,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active announcements
// @route   GET /api/users/announcements
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, announcements });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, changePassword, getUserStats, getAnnouncements };
