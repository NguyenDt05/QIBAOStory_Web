const History = require('../models/History');

/** GET /api/users/:id/history — Lấy lịch sử đọc của user */
async function getHistory(req, res, next) {
  try {
    const userid = req.params.id;
    const history = await History.getByUser(userid);
    res.json({ success: true, data: history });
  } catch (err) { next(err); }
}

/** POST /api/users/:id/history — Ghi lịch sử đọc (hoặc cập nhật) */
async function addHistory(req, res, next) {
  try {
    const userid = req.params.id;
    const { storyid, chapterid } = req.body;
    if (!storyid || !chapterid) {
      return res.status(400).json({ success: false, message: 'Thiếu storyid hoặc chapterid' });
    }
    await History.upsert(userid, storyid, chapterid);
    res.json({ success: true, message: 'Đã lưu lịch sử đọc' });
  } catch (err) { next(err); }
}

/** DELETE /api/users/:id/history/:storyid — Xóa 1 mục lịch sử */
async function removeHistory(req, res, next) {
  try {
    const { id: userid, storyid } = req.params;
    await History.remove(userid, storyid);
    const history = await History.getByUser(userid);
    res.json({ success: true, data: history });
  } catch (err) { next(err); }
}

module.exports = { getHistory, addHistory, removeHistory };
