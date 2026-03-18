const router = require('express').Router();
const ctrl   = require('../controllers/commentController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ── PUBLIC / USER ACTION ──────────────────────────────────────────
router.get('/story/:storyid',           ctrl.getByStory);             // Xem comment của truyện (không cần login)
router.post('/',                        authenticate, ctrl.create);    // Viết comment mới (cần login)
router.delete('/my/:cmtid',            authenticate, ctrl.deleteMyComment); // User xóa comment của mình

// ── ADMIN ─────────────────────────────────────────────────────────
router.get('/',                         authenticate, requireAdmin, ctrl.getAll);
router.patch('/:cmtid/toggle',         authenticate, requireAdmin, ctrl.toggleVisibility);
router.delete('/:cmtid',               authenticate, requireAdmin, ctrl.remove);

module.exports = router;
