const db = require('../config/db');

const Story = {
  /**
   * Lấy danh sách truyện kèm mảng thể loại (Dùng cho danh sách Admin/User)
   */
  async getAll({ visibleOnly = false } = {}) {
    const where = visibleOnly ? 'WHERE s.status = 1' : '';
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.storyCount,
              s.status, s.trangthai_rachuong, s.createdat,
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

  /** * VIEW USER: Lấy thông tin chi tiết truyện công khai
   */
  async getDetailForUser(storyid) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description, 
              s.storyCount, s.trangthai_rachuong, s.createdat,
              COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('categoryID', c.categoryid, 'categoryname', c.categoryname))
                 FROM story_category sc
                 JOIN category c ON sc.categoryid = c.categoryid
                 WHERE sc.storyid = s.storyid), 
                '[]'
              ) AS categories
       FROM stories s 
       WHERE s.storyid = ? AND s.status = 1
       GROUP BY s.storyid`,
      [storyid]
    );
    return rows[0] || null;
  },

  /** * VIEW ADMIN: Lấy để đổ vào Form Edit (Trả về mảng ID để dễ xử lý checkbox)
   */
  async getDetailForAdmin(storyid) {
    const [rows] = await db.query(
      `SELECT s.*, 
              COALESCE(
                (SELECT JSON_ARRAYAGG(sc.categoryid)
                 FROM story_category sc
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

  /** * TẠO TRUYỆN MỚI (Transaction)
   */
  async create(data, categoryIDs) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [res] = await conn.query(
        `INSERT INTO stories (title, author, description, image, trangthai_rachuong, storyCount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.title, data.author, data.description, data.image, data.trangthai_rachuong, data.storyCount, data.status || 1]
      );
      const storyid = res.insertId;

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

  /** * CẬP NHẬT TRUYỆN (Transaction)
   */
  async update(storyid, data, categoryIDs) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Cập nhật thông tin truyện (Chỉ đổi ảnh nếu có ảnh mới)
      let updateFields = 'title = ?, author = ?, description = ?, trangthai_rachuong = ?, storyCount = ?, status = ?';
      let params = [data.title, data.author, data.description, data.trangthai_rachuong, data.storyCount, data.status];

      if (data.image) {
        updateFields += ', image = ?';
        params.push(data.image);
      }

      params.push(storyid);
      await conn.query(`UPDATE stories SET ${updateFields} WHERE storyid = ?`, params);

      // 2. Cập nhật thể loại (Xóa hết cũ - Chèn mới)
      if (categoryIDs) {
        await conn.query(`DELETE FROM story_category WHERE storyid = ?`, [storyid]);
        if (categoryIDs.length > 0) {
          const values = categoryIDs.map(catID => [storyid, catID]);
          await conn.query(`INSERT INTO story_category (storyid, categoryid) VALUES ?`, [values]);
        }
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /** XÓA TRUYỆN */
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
  },

  /** ẨN / HIỆN */
  async toggleVisibility(storyid) {
    await db.query(`UPDATE stories SET status = 1 - status WHERE storyid = ?`, [storyid]);
  }
};

module.exports = Story;