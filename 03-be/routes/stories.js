// routes/stories.js
// Định nghĩa toàn bộ route cho /api/stories và /api/stories/:storyid/chapters

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/storyController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Nhúng chapter router (xử lý /:storyid/chapters/*)
const chapterRouter = require('./chapters');
router.use('/', chapterRouter);

// ── PUBLIC ───────────────────────────────────────────────────────────

// CÁC API TRANG CHỦ (Lấy nhanh, có LIMIT để tối ưu)
router.get('/home/hot', ctrl.getHotHome);
router.get('/home/newest', ctrl.getNewestHome);
router.get('/home/completed', ctrl.getCompletedHome);
router.get('/home/updated', ctrl.getUpdatedHome);

// GET /api/stories — Danh sách truyện (chỉ hiện status = 1)
router.get('/', ctrl.getPublicStories);

// GET /api/stories/search?q=... — Tìm kiếm tương đối (PHẢI ĐẶT TRƯỚC /:storyid)
router.get('/search', ctrl.search);

// GET /api/stories/:storyid/detail — Chi tiết truyện + danh sách chương (cho trang đọc)
router.get('/:storyid/detail', ctrl.getDetailForUser);

// ── ADMIN ────────────────────────────────────────────────────────────

// LƯU Ý: /admin/all và /admin/:storyid phải đặt TRƯỚC /:storyid
// để tránh 'admin' bị match như một storyid

// GET /api/stories/admin/all — Tất cả truyện (kể cả ẩn)
router.get('/admin/all', authenticate, requireAdmin, ctrl.getAdminStories);

// GET /api/stories/admin/:storyid — Chi tiết đầy đủ để Admin sửa
router.get('/admin/:storyid', authenticate, requireAdmin, ctrl.getDetailForAdmin);

// GET /api/stories/category/:categoryid — Public: Lấy danh sách truyện theo thể loại
router.get('/category/:categoryid', ctrl.getByCategory);

// POST /api/stories/:storyid/increment-view — Tăng lượt xem (Public, chống spam ở FE)
// Đặt TRƯỚC /:storyid để Express không nhầm 'increment-view' là storyid
router.post('/:storyid/increment-view', ctrl.incrementView);

// GET /api/stories/:storyid — Public: lấy thông tin cơ bản 1 truyện (FE dùng để lấy storyTitle/cover)
// Admin dùng /admin/:storyid (đã có auth riêng ở trên)
router.get('/:storyid', ctrl.getBasicForUser);

// POST /api/stories — Tạo truyện mới
router.post('/', authenticate, requireAdmin, upload.single('image'), ctrl.create);

// PUT /api/stories/:storyid — Cập nhật truyện
router.put('/:storyid', authenticate, requireAdmin, upload.single('image'), ctrl.update);

// DELETE /api/stories/:storyid — Xóa truyện
router.delete('/:storyid', authenticate, requireAdmin, ctrl.remove);

// PATCH /api/stories/:storyid/toggle — Ẩn/hiện truyện
router.patch('/:storyid/toggle', authenticate, requireAdmin, ctrl.toggleVisibility);

module.exports = router;