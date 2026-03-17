const Chapter = require('../models/Chapter');

/** GET /api/stories/:storyid/chapters */
async function getByStory(req, res, next) {
  try {
    const { storyid } = req.params;
    const chapters = await Chapter.getByStory(storyid);
    res.json({ success: true, data: chapters });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid/chapters/:chapterid */
async function getById(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    
    // Xử lý logic lấy chương theo ID
    // Note: Nếu muốn hỗ trợ 'first'|'last', bạn cần viết thêm hàm riêng trong Model. 
    // Ở đây ta xử lý theo ID số trước:
    const chapter = await Chapter.getById(storyid, chapterid);
    
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chương' });
    }
    
    res.json({ success: true, data: chapter });
  } catch (err) { next(err); }
}

/** POST /api/stories/:storyid/chapters */
async function create(req, res, next) {
  try {
    const { storyid } = req.params;
    const { chaptername, content } = req.body;

    if (!chaptername || !content) {
      return res.status(400).json({ success: false, message: 'Thiếu tên chương hoặc nội dung' });
    }

    const newChapterId = await Chapter.create(storyid, { chaptername, content });
    res.status(201).json({ 
      success: true, 
      message: 'Tạo chương mới thành công',
      data: { chapterid: newChapterId } 
    });
  } catch (err) { next(err); }
}

/** PUT /api/stories/:storyid/chapters/:chapterid */
async function update(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    const { chaptername, content } = req.body;

    await Chapter.update(storyid, chapterid, { chaptername, content });
    res.json({ success: true, message: 'Cập nhật chương thành công' });
  } catch (err) { next(err); }
}

/** DELETE /api/stories/:storyid/chapters/:chapterid */
async function remove(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    await Chapter.remove(storyid, chapterid);
    res.json({ success: true, message: 'Xóa chương thành công' });
  } catch (err) { next(err); }
}

/** PATCH /api/stories/:storyid/chapters/:chapterid/toggle */
async function toggleVisibility(req, res, next) {
  try {
    const { storyid, chapterid } = req.params;
    // Hàm này trong Model trả về danh sách chương mới sau khi update
    const updatedChapters = await Chapter.toggleVisibility(storyid, chapterid);
    res.json({ success: true, data: updatedChapters });
  } catch (err) { next(err); }
}

module.exports = { getByStory, getById, create, update, remove, toggleVisibility };