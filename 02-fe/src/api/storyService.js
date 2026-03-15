const db = require('../config/db');

const Story = {
  /**
   * Lấy danh sách truyện kèm mảng thể loại (Dùng JSON_ARRAYAGG)
   * Admin lấy hết, User chỉ lấy truyện có status = 1
   */
  async getAll({ visibleOnly = false } = {}) {
    const where = visibleOnly ? 'WHERE s.status = 1' : '';
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description, 
              s.storyCount, s.status, s.trangthai_rachuong, s.createdat,
              COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('categoryID', c.categoryid, 'categoryname', c.categoryname))
                 FROM story_category sc
                 JOIN category c ON sc.categoryid = c.categoryid
                 WHERE sc.storyid = s.storyid), 
                '[]'
              ) AS categories
       FROM stories s
       ${where}
       GROUP BY s.storyid
       ORDER BY s.createdat DESC`
    );
    return rows;
  },

  /**
   * Lấy chi tiết truyện cho Admin (Để đổ vào Form Edit)
   */
  async getDetailForAdmin(storyid) {
    const [rows] = await db.query(
      `SELECT s.*, 
              COALESCE(
                (SELECT JSON_ARRAYAGG(c.categoryid)
                 FROM story_category sc
                 JOIN category c ON sc.categoryid = c.categoryid
                 WHERE sc.storyid = s.storyid), 
                '[]'
              ) AS categoryIDs
       FROM stories s 
       WHERE s.storyid = ?
       GROUP BY s.storyid`,
      [storyid]
    );
    return rows[0] || null;
  },

  /**
   * Tạo truyện mới (Dùng Transaction)
   */
  async create(data, categoryIDs) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Chèn vào bảng stories
      const [result] = await conn.query(
        `INSERT INTO stories (title, author, description, image, trangthai_rachuong, storyCount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.title, data.author, data.description, data.image, data.trangthai_rachuong, data.storyCount, data.status]
      );
      const storyid = result.insertId;

      // 2. Chèn vào bảng trung gian story_category
      if (categoryIDs && categoryIDs.length > 0) {
        const values = categoryIDs.map(catID => [storyid, catID]);
        await conn.query(`INSERT INTO story_category (storyid, categoryid) VALUES ?`, [values]);
      }

      await conn.commit();
      return storyid;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /**
   * Cập nhật truyện (Dùng Transaction)
   */
  async update(storyid, data, categoryIDs) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Cập nhật bảng stories (Chỉ cập nhật ảnh nếu có ảnh mới)
      let sql = `UPDATE stories SET title = ?, author = ?, description = ?, trangthai_rachuong = ?, storyCount = ?, status = ?`;
      let params = [data.title, data.author, data.description, data.trangthai_rachuong, data.storyCount, data.status];

      if (data.image) {
        sql += `, image = ?`;
        params.push(data.image);
      }

      sql += ` WHERE storyid = ?`;
      params.push(storyid);

      await conn.query(sql, params);

      // 2. Cập nhật thể loại: Xóa tất cả liên kết cũ và chèn lại mảng mới
      if (categoryIDs) {
        await conn.query(`DELETE FROM story_category WHERE storyid = ?`, [storyid]);
        if (categoryIDs.length > 0) {
          const values = categoryIDs.map(catID => [storyid, catID]);
          await conn.query(`INSERT INTO story_category (storyid, categoryid) VALUES ?`, [values]);
        }
      }

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /**
   * Đổi trạng thái ẩn/hiện
   */
  async toggleVisibility(storyid) {
    await db.query(`UPDATE stories SET status = 1 - status WHERE storyid = ?`, [storyid]);
  },

  /**
   * Xóa truyện và liên kết
   */
  async remove(storyid) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(`DELETE FROM story_category WHERE storyid = ?`, [storyid]);
      await conn.query(`DELETE FROM stories WHERE storyid = ?`, [storyid]);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = Story;