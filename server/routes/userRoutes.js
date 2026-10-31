const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, getUserStats, getAnnouncements } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/stats', protect, getUserStats);
router.get('/announcements', protect, getAnnouncements);

module.exports = router;
