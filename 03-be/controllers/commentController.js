const Comment = require('../models/Comment');

/** GET /api/comments — Admin: tất cả bình luận */
async function getAll(req, res, next) {
  try {
    const comments = await Comment.getAll();
    res.json({ success: true, data: comments });
  } catch (err) { next(err); }
}

/** GET /api/comments/story/:storyid — Public: bình luận visible của truyện */
async function getByStory(req, res, next) {
  try {
    const { storyid } = req.params;
    const comments = await Comment.getByStory(storyid);
    res.json({ success: true, data: comments });
  } catch (err) { next(err); }
}

/** POST /api/comments — User đăng bình luận (cần authenticate) */
async function create(req, res, next) {
  try {
    if (!req.user || !req.user.userid) {
      return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để bình luận' });
    }
    const { storyid, content } = req.body;
    if (!storyid || !content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: 'Nội dung bình luận không được bỏ trống' });
    }
    await Comment.create({
      storyid: parseInt(storyid),
      userid: req.user.userid,
      content: String(content).trim(),
      tenhienthi: req.user.tenhienthi || req.user.username || '',
    });
    res.status(201).json({ success: true, message: 'Đã thêm bình luận' });
  } catch (err) { next(err); }
}

/** PATCH /api/comments/:cmtid/toggle — Admin: ẩn/hiện bình luận */
async function toggleVisibility(req, res, next) {
  try {
    const { cmtid } = req.params;
    const updatedList = await Comment.toggleVisibility(cmtid);
    res.json({ success: true, data: updatedList });
  } catch (err) { next(err); }
}

/** DELETE /api/comments/:cmtid — Admin: xóa bình luận */
async function remove(req, res, next) {
  try {
    const { cmtid } = req.params;
    await Comment.remove(cmtid);
    const updatedList = await Comment.getAll();
    res.json({ success: true, data: updatedList });
  } catch (err) { next(err); }
}

/** DELETE /api/comments/my/:cmtid — User xóa bình luận của chính mình */
async function deleteMyComment(req, res, next) {
  try {
    const { cmtid } = req.params;
    const userid = req.user.userid;
    const db = require('../config/db');
    const [rows] = await db.query('SELECT userid FROM comment WHERE cmtid = ?', [cmtid]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    if (Number(rows[0].userid) !== Number(userid)) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa bình luận của người khác' });
    }
    await Comment.remove(cmtid);
    res.json({ success: true, message: 'Đã xóa bình luận' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getByStory, create, toggleVisibility, remove, deleteMyComment };
