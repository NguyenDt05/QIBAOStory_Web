// chapterController.js
// Xử lý CRUD chương truyện: getByStory, getById, create, update, remove, toggleVisibility

const Chapter = require('../models/Chapter');

/** GET /api/stories/:storyid/chapters */
async function getByStory(req, res, next) {
  try {
    const { storyid } = req.params;
    const chapters = await Chapter.getByStory(storyid);
    res.json({ success: true, data: chapters });
  } catch (err) { next(err); }
}

/** GET /api/stories/:storyid/chapters/:chapterid
 *  Hỗ trợ alias: chapterid = 'first' → chương đầu tiên
 */
async function getById(req, res, next) {
  try {
    const { storyid } = req.params;
    let { chapterid } = req.params;

    // Hỗ trợ alias 'first': lấy chương đầu tiên của truyện
    if (chapterid === 'first') {
      const allChapters = await Chapter.getByStory(storyid);
      if (!allChapters.length) {
        return res.status(404).json({ success: false, message: 'Truyện chưa có chương nào' });
      }
      chapterid = allChapters[0].chapterid;
    }

    const chapter = await Chapter.getById(storyid, chapterid);

    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chương' });
    }

    // Lấy danh sách chương để tính prev/next
    const allChapters = await Chapter.getByStory(storyid);
    const idx = allChapters.findIndex(c => c.chapterid == chapterid);
    const prevChapter = idx > 0 ? allChapters[idx - 1] : null;
    const nextChapter = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;

    // --- PAYWALL LOGIC ---
    // Khách (chưa đăng nhập) chỉ được đọc 2 chương đầu (idx = 0 và 1)
    if (idx > 1 && !req.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để đọc chương này',
        isLocked: true,
        data: {
          chapter: { chapterid: chapter.chapterid, chaptername: chapter.chaptername }, // Cố tình không trả về content
          prevChapter,
          nextChapter,
          chapterIndex: idx,
          totalChapters: allChapters.length,
        }
      });
    }

    res.json({
      success: true,
      data: {
        chapter,
        prevChapter,
        nextChapter,
        chapterIndex: idx,
        totalChapters: allChapters.length,
      },
    });
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
    const { chaptername, content, status } = req.body;

    await Chapter.update(storyid, chapterid, { chaptername, content, status });
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