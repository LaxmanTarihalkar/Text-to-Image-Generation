const express = require('express');
const router = express.Router();
const { generate, getHistory, deleteImage, getImage } = require('../controllers/imageController');
const { protect } = require('../middleware/auth');
const { generateLimiter } = require('../middleware/rateLimiter');

router.post('/generate', protect, generateLimiter, generate);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
