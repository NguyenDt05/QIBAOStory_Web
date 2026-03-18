const express = require('express');
const router = express.Router();
const chapterCtrl = require('../controllers/chapterController');
const { authenticate, requireAdmin, optionalAuthenticate } = require('../middleware/auth');

// Middleware tăng giới hạn dung lượng để xử lý chương truyện dài (2500+ chữ)
router.use(express.json({ limit: '10mb' }));

// ── Các route lấy dữ liệu (Public) ──────────────────────────────────────────
router.get('/:storyid/chapters', chapterCtrl.getByStory);

router.get('/:storyid/chapters/:chapterid', optionalAuthenticate, chapterCtrl.getById);

// ── Các route quản lý (Yêu cầu đăng nhập Admin) ─────────────────────────────
router.post('/:storyid/chapters', authenticate, requireAdmin, chapterCtrl.create);

router.put('/:storyid/chapters/:chapterid', authenticate, requireAdmin, chapterCtrl.update);

router.delete('/:storyid/chapters/:chapterid', authenticate, requireAdmin, chapterCtrl.remove);

router.patch('/:storyid/chapters/:chapterid/toggle', authenticate, requireAdmin, chapterCtrl.toggleVisibility);

module.exports = router;