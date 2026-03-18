const router = require('express').Router();
const ctrl   = require('../controllers/userController');
const histCtrl = require('../controllers/historyController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/',                                            authenticate, requireAdmin, ctrl.getAll);
router.patch('/:userid/toggle',                            authenticate, requireAdmin, ctrl.toggleStatus);
router.delete('/:userid',                                  authenticate, requireAdmin, ctrl.delete);
router.put('/:id/profile',   authenticate,             ctrl.updateProfile);
router.patch('/:id/password',  authenticate,             ctrl.changePassword);

// --- User Profile & Library ---
router.get('/:id', authenticate, ctrl.getProfile);
router.get('/:id/library', authenticate, ctrl.getLibrary);
router.post('/:id/library/:storyid', authenticate, ctrl.addToLibrary);
router.delete('/:id/library/:storyid', authenticate, ctrl.removeFromLibrary);

// --- Lịch sử đọc ---
router.get('/:id/history', authenticate, histCtrl.getHistory);
router.post('/:id/history', authenticate, histCtrl.addHistory);
router.delete('/:id/history/:storyid', authenticate, histCtrl.removeHistory);

module.exports = router;
