const router   = require('express').Router();
const ctrl     = require('../controllers/storyController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const upload   = require('../middleware/upload');

// ── USER ROUTES (Public) ─────────────────────────────────────────────────────
// Lấy danh sách truyện cho trang chủ/danh sách (chỉ hiện truyện status = 1)
router.get('/', ctrl.getPublicStories); 

// Xem chi tiết truyện cho người đọc (chỉ xem được truyện đang hiện)
// Khớp với FE: /stories/:storyid
router.get('/:storyid', ctrl.getDetailForUser);


// ── ADMIN ROUTES (Protected) ──────────────────────────────────────────────────
// Áp dụng middleware bảo mật cho toàn bộ các route admin bên dưới
router.use(authenticate, requireAdmin);

// Lấy toàn bộ danh sách truyện cho trang quản lý (hiện cả truyện ẩn)
// Khớp với FE: /admin/stories
router.get('/admin/all', ctrl.getAdminStories);

// Xem chi tiết truyện dành cho Admin (lấy hết các cột, cả truyện đang ẩn)
// Khớp với FE: /admin/stories/detail
router.get('/admin/:storyid', ctrl.getDetailForAdmin);

// Tạo truyện mới
router.post('/', upload.single('cover'), ctrl.create);

// Cập nhật truyện
router.put('/:storyid', upload.single('cover'), ctrl.update);

// Xóa truyện
router.delete('/:storyid', ctrl.remove);

// Ẩn/Hiện truyện
router.patch('/:storyid/toggle', ctrl.toggleVisibility);

module.exports = router;