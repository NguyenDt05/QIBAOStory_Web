const db = require('../config/db');

const History = {
  /**
   * Lấy lịch sử đọc của user — JOIN stories & chapter để có tên truyện, tên chương
   * Lấy 1 bản ghi mới nhất theo storyid (chương đọc gần đây nhất của mỗi truyện)
   */
  async getByUser(userid) {
    const [rows] = await db.query(
      `SELECT rh.userid, rh.storyid, rh.chapterid, rh.read_at,
              s.title AS storyTitle, s.image AS storyCover,
              c.chaptername
       FROM reading_history rh
       JOIN stories s ON rh.storyid = s.storyid
       JOIN chapter c ON rh.chapterid = c.chapterid
       WHERE rh.userid = ?
       ORDER BY rh.read_at DESC`,
      [userid]
    );
    // Deduplicate: chỉ lấy bản ghi mới nhất của mỗi truyện
    const seen = new Set();
    return rows.filter(r => {
      if (seen.has(r.storyid)) return false;
      seen.add(r.storyid);
      return true;
    });
  },

  /**
   * Lưu/cập nhật lịch sử đọc
   * Dùng INSERT ... ON DUPLICATE KEY UPDATE để ghi đè nếu đã đọc chương này
   */
  async upsert(userid, storyid, chapterid) {
    await db.query(
      `INSERT INTO reading_history (userid, storyid, chapterid, read_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE chapterid = VALUES(chapterid), read_at = CURRENT_TIMESTAMP`,
      [userid, storyid, chapterid]
    );
  },

  /**
   * Xóa 1 mục khỏi lịch sử
   */
  async remove(userid, storyid) {
    await db.query(
      'DELETE FROM reading_history WHERE userid = ? AND storyid = ?',
      [userid, storyid]
    );
  },
};

module.exports = History;
