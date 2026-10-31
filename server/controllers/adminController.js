const User = require('../models/User');
const Image = require('../models/Image');
const Payment = require('../models/Payment');
const Report = require('../models/Report');
const Announcement = require('../models/Announcement');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalImages,
      totalRevenue,
      activeUsers,
      newUsersThisMonth,
      pendingReports,
      recentPayments,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Image.countDocuments({ isDeleted: false }),
      Payment.aggregate([
        { $match: { paymentStatus: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      User.countDocuments({ role: 'user', updatedAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: thirtyDaysAgo } }),
      Report.countDocuments({ status: 'pending' }),
      Payment.find({ paymentStatus: 'success' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email'),
    ]);

    // Daily generation stats for last 7 days
    const dailyStats = await Image.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue by plan
    const revenueByPlan = await Payment.aggregate([
      { $match: { paymentStatus: 'success' } },
      { $group: { _id: '$planName', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalImages,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeUsers,
        newUsersThisMonth,
        pendingReports,
        recentPayments,
        dailyStats,
        revenueByPlan,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', plan = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (plan) query.subscriptionPlan = plan;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block/unblock user
// @route   PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot block admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all images (admin)
// @route   GET /api/admin/images
const getAllImages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (search) query.prompt = { $regex: search, $options: 'i' };

    const [images, total] = await Promise.all([
      Image.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Image.countDocuments(query),
    ]);

    res.json({
      success: true,
      images,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete image (admin)
// @route   DELETE /api/admin/images/:id
const deleteImage = async (req, res, next) => {
  try {
    await Image.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
const getAllReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('userId', 'name email')
        .populate({ path: 'imageId', select: 'prompt imageUrl style' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(query),
    ]);

    res.json({
      success: true,
      reports,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
const updateReport = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    res.json({ success: true, message: 'Report updated', report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/admin/payments
const getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.paymentStatus = status;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(query),
    ]);

    res.json({
      success: true,
      payments,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/admin/announcements
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;
    const announcement = await Announcement.create({
      title,
      message,
      type,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all announcements
// @route   GET /api/admin/announcements
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle announcement active status
// @route   PUT /api/admin/announcements/:id
const toggleAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (!ann) return res.status(404).json({ success: false, message: 'Not found' });
    ann.isActive = !ann.isActive;
    await ann.save();
    res.json({ success: true, announcement: ann });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllImages,
  deleteImage,
  getAllReports,
  updateReport,
  getAllPayments,
  createAnnouncement,
  getAnnouncements,
  toggleAnnouncement,
};
