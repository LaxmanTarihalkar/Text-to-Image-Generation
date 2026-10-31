const Favorite = require('../models/Favorite');
const Image = require('../models/Image');

// @desc    Add to favorites
// @route   POST /api/favorites/:imageId
const addFavorite = async (req, res, next) => {
  try {
    const image = await Image.findOne({ _id: req.params.imageId, isDeleted: false });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const existing = await Favorite.findOne({ userId: req.user._id, imageId: req.params.imageId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already in favorites' });
    }

    await Favorite.create({ userId: req.user._id, imageId: req.params.imageId });

    res.status(201).json({ success: true, message: 'Added to favorites' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:imageId
const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      imageId: req.params.imageId,
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user favorites
// @route   GET /api/favorites
const getFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ userId: req.user._id })
        .populate({ path: 'imageId', match: { isDeleted: false } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Favorite.countDocuments({ userId: req.user._id }),
    ]);

    // Filter out null imageId (deleted images)
    const validFavorites = favorites.filter((f) => f.imageId !== null);

    res.json({
      success: true,
      favorites: validFavorites,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if image is favorited
// @route   GET /api/favorites/check/:imageId
const checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      imageId: req.params.imageId,
    });

    res.json({ success: true, isFavorited: !!favorite });
  } catch (error) {
    next(error);
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites, checkFavorite };
