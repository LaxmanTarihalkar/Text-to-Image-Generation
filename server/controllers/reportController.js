const Report = require('../models/Report');
const Image = require('../models/Image');

// @desc    Report an image
// @route   POST /api/reports
const createReport = async (req, res, next) => {
  try {
    const { imageId, reason, description } = req.body;

    const image = await Image.findOne({ _id: imageId, isDeleted: false });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Check if already reported by this user
    const existing = await Report.findOne({ userId: req.user._id, imageId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reported this image' });
    }

    await Report.create({ userId: req.user._id, imageId, reason, description });

    // Increment report count on image
    await Image.findByIdAndUpdate(imageId, { $inc: { reportCount: 1 } });

    res.status(201).json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReport };
