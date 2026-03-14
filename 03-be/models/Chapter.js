const db = require('../config/db');

const Chapter = {
  /** Lấy danh sách chương theo storyid */
  async getByStory(storyid) {
    const [rows] = await db.query(`
      SELECT chapterid, storyid, chaptername, status, createdat
      FROM chapter
      WHERE storyid = ?
      ORDER BY createdat ASC
    `, [storyid]);
    return rows;
  },

  /** Lấy chi tiết 1 chương (có prev/next) */
  async getById(storyid, chapterid) {
    const [rows] = await db.query(
      `SELECT * FROM chapter WHERE storyid = ? AND chapterid = ?`,
      [storyid, chapterid]
    );
    return rows[0] ?? null;
  },

  /** Tạo chương mới */
  async create(storyid, data) {
    const [result] = await db.query(
      `INSERT INTO chapter (storyid, chaptername, content) VALUES (?, ?, ?)`,
      [storyid, data.chaptername, data.content]
    );
    return result.insertId;
  },

  /** Cập nhật chương */
  async update(storyid, chapterid, data) {
    await db.query(
      `UPDATE chapter SET chaptername = ?, content = ? WHERE storyid = ? AND chapterid = ?`,
      [data.chaptername, data.content, storyid, chapterid]
    );
  },

  /** Xoá chương */
  async remove(storyid, chapterid) {
    await db.query(
      `DELETE FROM chapter WHERE storyid = ? AND chapterid = ?`,
      [storyid, chapterid]
    );
  },

  /** Đổi trạng thái ẩn/hiện */
  async toggleVisibility(storyid, chapterid) {
    await db.query(
      `UPDATE chapter SET status = 1 - status WHERE storyid = ? AND chapterid = ?`,
      [storyid, chapterid]
    );
    return this.getByStory(storyid);
  },
};

module.exports = Chapter;
