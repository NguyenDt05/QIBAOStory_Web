const db = require('../config/db');

// Tên bảng thực tế: library (PK composite: userid + storyid, savedat)

const Library = {
  /**
   * Lấy danh sách tủ sách JOIN stories để có đủ thông tin hiển thị
   */
  async getLibraryByUser(userid) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.storyCount,
              s.status, s.trangthai_rachuong, l.savedat
       FROM library l
       JOIN stories s ON l.storyid = s.storyid
       WHERE l.userid = ?
       ORDER BY l.savedat DESC`,
      [userid]
    );
    return rows;
  },

  /**
   * Thêm truyện vào tủ sách (INSERT IGNORE tránh duplicate)
   */
  async addToLibrary(userid, storyid) {
    const [result] = await db.query(
      `INSERT IGNORE INTO library (userid, storyid, savedat) VALUES (?, ?, NOW())`,
      [userid, storyid]
    );
    return result.affectedRows > 0;
  },

  /**
   * Xóa truyện khỏi tủ sách
   */
  async removeFromLibrary(userid, storyid) {
    const [result] = await db.query(
      `DELETE FROM library WHERE userid = ? AND storyid = ?`,
      [userid, storyid]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Library;
