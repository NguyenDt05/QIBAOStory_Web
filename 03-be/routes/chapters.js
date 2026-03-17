const express = require('express');
const router = express.Router();
const chapterCtrl = require('../controllers/chapterController');

// Middleware tăng giới hạn dung lượng để xử lý chương truyện dài (2500+ chữ)
// Đặt cái này ở đây nếu server.js của bạn chưa cấu hình limit
router.use(express.json({ limit: '10mb' }));

/**
 * LƯU Ý KHI TEST POSTMAN:
 * URL: http://localhost:8080/api/stories/1/chapters
 * Method: POST
 * Body: chọn 'raw' -> 'JSON'
 */

// Các route lấy dữ liệu (Public)
router.get('/:storyid/chapters', (req, res, next) => {
    console.log(`[GET] Đang lấy danh sách chương của Story ID: ${req.params.storyid}`);
    next();
}, chapterCtrl.getByStory);

router.get('/:storyid/chapters/:chapterid', chapterCtrl.getById);

// Các route quản lý (Nên thêm authenticate, requireAdmin vào đây)
router.post('/:storyid/chapters', (req, res, next) => {
    console.log("--- DEBUG POST CHAPTER ---");
    console.log("StoryID từ URL:", req.params.storyid);
    console.log("Dữ liệu nhận được từ Body:", req.body);
    
    if (!req.body.chaptername || !req.body.content) {
        console.error("LỖI: Postman gửi thiếu chaptername hoặc content!");
    }
    next();
}, chapterCtrl.create);

router.put('/:storyid/chapters/:chapterid', chapterCtrl.update);

router.delete('/:storyid/chapters/:chapterid', chapterCtrl.remove);

router.patch('/:storyid/chapters/:chapterid/toggle', chapterCtrl.toggleVisibility);

module.exports = router;