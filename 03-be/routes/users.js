const router = require('express').Router();
const ctrl = require('../controllers/userController');
const histCtrl = require('../controllers/historyController');
const { authenticate, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

router.get('/', authenticate, requireAdmin, ctrl.getAll);
router.patch('/:userid/toggle', authenticate, requireAdmin, ctrl.toggleStatus);
router.delete('/:userid', authenticate, requireAdmin, ctrl.delete);
router.put('/:id/profile', authenticate, requireOwnerOrAdmin, uploadAvatar.single('image'), ctrl.updateProfile);

router.patch('/:id/password', authenticate, requireOwnerOrAdmin, ctrl.changePassword);

// --- User Profile & Library ---
router.get('/:id', authenticate, requireOwnerOrAdmin, ctrl.getProfile);
router.get('/:id/library', authenticate, requireOwnerOrAdmin, ctrl.getLibrary);
router.post('/:id/library/:storyid', authenticate, requireOwnerOrAdmin, ctrl.addToLibrary);
router.delete('/:id/library/:storyid', authenticate, requireOwnerOrAdmin, ctrl.removeFromLibrary);

// --- Lịch sử đọc ---
router.get('/:id/history', authenticate, requireOwnerOrAdmin, histCtrl.getHistory);
router.post('/:id/history', authenticate, requireOwnerOrAdmin, histCtrl.addHistory);
router.delete('/:id/history/:storyid', authenticate, requireOwnerOrAdmin, histCtrl.removeHistory);

module.exports = router;
