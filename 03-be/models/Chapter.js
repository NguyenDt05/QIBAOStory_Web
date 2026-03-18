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
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      const [result] = await conn.query(
        `INSERT INTO chapter (storyid, chaptername, content) VALUES (?, ?, ?)`,
        [storyid, data.chaptername, data.content]
      );
      const chapterid = result.insertId;

      // Cập nhật số chương và thời gian cập nhật của truyện
      await conn.query(
        `UPDATE stories SET storyCount = storyCount + 1, updatedat = CURRENT_TIMESTAMP WHERE storyid = ?`,
        [storyid]
      );

      await conn.commit();
      return chapterid;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /** Cập nhật chương */
  async update(storyid, chapterid, data) {
    let sql = `UPDATE chapter SET chaptername = ?, content = ?`;
    let params = [data.chaptername, data.content];
    
    if (data.status !== undefined) {
      sql += `, status = ?`;
      params.push(data.status);
    }
    
    sql += ` WHERE storyid = ? AND chapterid = ?`;
    params.push(storyid, chapterid);
    
    await db.query(sql, params);
  },

  /** Xoá chương */
  async remove(storyid, chapterid) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      await conn.query(
        `DELETE FROM chapter WHERE storyid = ? AND chapterid = ?`,
        [storyid, chapterid]
      );

      // Cập nhật số chương của truyện (chỉ giảm nếu > 0)
      await conn.query(
        `UPDATE stories SET storyCount = GREATEST(storyCount - 1, 0) WHERE storyid = ?`,
        [storyid]
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
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
