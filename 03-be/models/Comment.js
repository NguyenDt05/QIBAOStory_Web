const db = require('../config/db');

// Tên bảng thực tế trong DB: comment (số ít)
// Cột: cmtid (PK), userid, storyid, content, createdat, tenhienthi, visible (0/1)

const Comment = {
  /**
   * Admin: Lấy tất cả bình luận, JOIN users để có username, avatar
   * Mỗi item: { cmtid, storyid, content, visible, createdat, userid, username, tenhienthi, avatar, storyTitle }
   */
  async getAll() {
    const [rows] = await db.query(
      `SELECT c.cmtid, c.storyid, c.content, c.visible, c.createdat,
              c.userid, u.username, u.tenhienthi, u.avatar,
              s.title AS storyTitle
       FROM comment c
       JOIN users u ON c.userid = u.userid
       JOIN stories s ON c.storyid = s.storyid
       ORDER BY c.createdat DESC`
    );
    return rows;
  },

  /**
   * Public: Chỉ lấy bình luận visible (visible=1) của 1 truyện, kèm thông tin user
   * Mỗi item: { cmtid, storyid, content, visible, createdat, username, tenhienthi, avatar }
   */
  async getByStory(storyid) {
    const [rows] = await db.query(
      `SELECT c.cmtid, c.storyid, c.content, c.visible, c.createdat,
              c.userid, u.username, u.tenhienthi, u.avatar
       FROM comment c
       JOIN users u ON c.userid = u.userid
       WHERE c.storyid = ? AND c.visible = 1
       ORDER BY c.createdat DESC`,
      [storyid]
    );
    return rows;
  },

  /**
   * Thêm bình luận mới
   * data: { storyid, userid, content, tenhienthi }
   */
  async create(data) {
    const [result] = await db.query(
      'INSERT INTO comment (storyid, userid, content, tenhienthi) VALUES (?, ?, ?, ?)',
      [data.storyid, data.userid, data.content, data.tenhienthi || '']
    );
    return result.insertId;
  },

  /**
   * Admin: Toggle ẩn/hiện bình luận (visible 0↔1)
   */
  async toggleVisibility(cmtid) {
    await db.query('UPDATE comment SET visible = 1 - visible WHERE cmtid = ?', [cmtid]);
    return this.getAll();
  },

  /**
   * Xóa bình luận
   */
  async remove(cmtid) {
    await db.query('DELETE FROM comment WHERE cmtid = ?', [cmtid]);
  },
};

module.exports = Comment;
