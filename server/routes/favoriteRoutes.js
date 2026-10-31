const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites, checkFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFavorites);
router.post('/:imageId', protect, addFavorite);
router.delete('/:imageId', protect, removeFavorite);
router.get('/check/:imageId', protect, checkFavorite);

module.exports = router;
