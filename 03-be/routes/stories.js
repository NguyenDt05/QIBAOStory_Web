const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/storyController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// NHÚNG ROUTER CHAPTER TẠI ĐÂY
const chapterRouter = require('./chapters');
router.use('/', chapterRouter);

// ── USER ROUTES (Public) ─────────────────────────────────────────────────────

// Lấy danh sách truyện cho trang chủ (Chỉ hiện truyện status = 1)
// URL: GET /api/stories
router.get('/', ctrl.getPublicStories);

// Xem chi tiết truyện cho người đọc
// URL: GET /api/stories/:storyid
router.get('/:storyid', ctrl.getDetailForUser);


// ── ADMIN ROUTES (Cần đăng nhập & Quyền Admin) ───────────────────────────────

// Lấy toàn bộ danh sách truyện cho trang quản lý (Hiện cả truyện ẩn)
// URL: GET /api/stories/admin/all
router.get('/admin/all', authenticate, requireAdmin, ctrl.getAdminStories);

// Lấy chi tiết truyện để Admin sửa (Lấy toàn bộ các cột)
// URL: GET /api/stories/admin/:storyid
router.get('/admin/:storyid', authenticate, requireAdmin, ctrl.getDetailForAdmin);

/**
 * TẠO TRUYỆN MỚI
 * Sử dụng upload.single('image') để bắt file ảnh từ trường 'image' trong FormData
 */http://localhost:8080/api/stories
router.post('/', authenticate, requireAdmin, upload.single('image'), ctrl.create);

/**
 * CẬP NHẬT TRUYỆN
 * Cho phép cập nhật thông tin và thay đổi ảnh bìa mới
 */http://localhost:8080/api/stories/:storyid
router.put('/:storyid', authenticate, requireAdmin, upload.single('image'), ctrl.update);

/**
 * XÓA TRUYỆN
 * URL: DELETE /api/stories/:storyid
 */
router.delete('/:storyid', authenticate, requireAdmin, ctrl.remove);

/**
 * ẨN/HIỆN TRUYỆN
 * URL: PATCH /api/stories/:storyid/toggle
 */
router.patch('/:storyid/toggle', authenticate, requireAdmin, ctrl.toggleVisibility);

module.exports = router;