const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);

router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

router.get('/images', getAllImages);
router.delete('/images/:id', deleteImage);

router.get('/reports', getAllReports);
router.put('/reports/:id', updateReport);

router.get('/payments', getAllPayments);

router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', toggleAnnouncement);

module.exports = router;
