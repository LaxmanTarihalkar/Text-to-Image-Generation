const Image = require('../models/Image');
const User = require('../models/User');
const { generateImage } = require('../services/pollinationsService');

// @desc    Generate AI image
// @route   POST /api/images/generate
const generate = async (req, res, next) => {
  try {
    const { prompt, style = 'realistic', width = 1024, height = 1024 } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const user = await User.findById(req.user._id);

    // Check credits
    if (user.subscriptionPlan === 'free' && user.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: 'No credits remaining. Upgrade your plan or wait for daily reset.',
      });
    }

    // Generate image via Pollinations AI
    const result = await generateImage(prompt, style, width, height);

    if (!result.success) {
      return res.status(500).json({ success: false, message: 'Image generation failed' });
    }

    // Save to database
    const image = await Image.create({
      userId: user._id,
      prompt: prompt.trim(),
      enhancedPrompt: result.enhancedPrompt,
      style,
      imageUrl: result.imageUrl,
      width,
      height,
    });

    // Deduct credits for free users
    if (user.subscriptionPlan === 'free') {
      user.credits = Math.max(0, user.credits - 1);
    }
    user.totalImagesGenerated += 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Image generated successfully',
      image,
      creditsRemaining: user.credits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's image history
// @route   GET /api/images/history
const getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search = '', style = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id, isDeleted: false };

    if (search) {
      query.prompt = { $regex: search, $options: 'i' };
    }
    if (style) {
      query.style = style;
    }

    const [images, total] = await Promise.all([
      Image.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Image.countDocuments(query),
    ]);

    res.json({
      success: true,
      images,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, userId: req.user._id });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    image.isDeleted = true;
    await image.save();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single image
// @route   GET /api/images/:id
const getImage = async (req, res, next) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isDeleted: false,
    });

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

module.exports = { generate, getHistory, deleteImage, getImage };
