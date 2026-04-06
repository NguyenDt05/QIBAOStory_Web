// Story.js
// Model tương tác với bảng stories và story_category trong MySQL

const db = require('../config/db');

const Story = {
  /** Lấy danh sách truyện kèm mảng thể loại */
  async getAllStories({ visibleOnly = false } = {}) {
    const where = visibleOnly ? "WHERE s.status = 1" : '';
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description, 
              s.storyCount, s.status, s.trangthai_rachuong, s.createdat, s.updatedat,
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
       ORDER BY COALESCE(s.updatedat, s.createdat) DESC, s.storyid DESC`
    );
    return rows;
  },

  /** Lấy 1 truyện đang hiện (status=1) theo ID — cho User xem chi tiết */
  async getForUser(storyid) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description,
              s.storyCount, s.status, s.trangthai_rachuong, s.createdat, s.updatedat,
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
      if (categoryIDs?.length > 0) {
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

  async update(storyid, data, categoryIDs) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      let sql = `UPDATE stories SET title = ?, author = ?, description = ?, trangthai_rachuong = ?, storyCount = ?, status = ?`;
      let params = [data.title, data.author, data.description, data.trangthai_rachuong, data.storyCount, data.status];
      if (data.image) {
        sql += `, image = ?`;
        params.push(data.image);
      }
      sql += ` WHERE storyid = ?`;
      params.push(storyid);
      await conn.query(sql, params);

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

  async remove(storyid) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Xóa các dữ liệu liên quan phân tầng (Cascade delete)
      await conn.query(`DELETE FROM story_category WHERE storyid = ?`, [storyid]);
      await conn.query(`DELETE FROM user_library WHERE storyid = ?`, [storyid]).catch(() => {/* Ignore if table doesn't exist just in case */ });
      await conn.query(`DELETE FROM comments WHERE storyid = ?`, [storyid]).catch(() => { });
      await conn.query(`DELETE FROM chapter WHERE storyid = ?`, [storyid]);

      // Cuối cùng xóa truyện
      await conn.query(`DELETE FROM stories WHERE storyid = ?`, [storyid]);

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  async toggleVisibility(storyid) {
    await db.query(`UPDATE stories SET status = 1 - status WHERE storyid = ?`, [storyid]);
  },

  /** ==========================================
   *  CÁC QUERY TRANG CHỦ (PUBLIC API) - LIMIT 4
   *  ========================================== */

  // 1. Truyện Hot Đề Cử — 4 truyện có lượt cập nhật chương liên tục và gần nhất
  async getHotStories(limit = 4) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.storyCount, s.status,
              s.trangthai_rachuong, s.createdat, s.updatedat,
              COUNT(c.chapterid)  AS recent_chapter_count,
              MAX(c.createdat)    AS latest_chapter_date
       FROM stories s
       LEFT JOIN chapter c ON c.storyid = s.storyid
         AND c.status = 1
         AND c.createdat >= DATE_SUB(NOW(), INTERVAL 60 DAY)
       WHERE s.status = 1
       GROUP BY s.storyid
       ORDER BY recent_chapter_count DESC, latest_chapter_date DESC, s.updatedat DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    return rows;
  },

  // 2. Tác phẩm mới (Sắp xếp theo ngày đăng — truyện mới nhất lên đầu)
  async getNewestStories(limit = 4) {
    const [rows] = await db.query(
      `SELECT storyid, title, author, image, storyCount, status, trangthai_rachuong, createdat, updatedat
       FROM stories
       WHERE status = 1
       ORDER BY createdat DESC, storyid DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    return rows;
  },

  // 3. Truyện Hoàn Thành — match tất cả alias: 'hoanthanh', 'hoan_thanh', 'da_hoan', 'Full', 'full'
  async getCompletedStories(limit = 4) {
    const [rows] = await db.query(
      `SELECT storyid, title, author, image, storyCount, status, trangthai_rachuong, createdat, updatedat
       FROM stories
       WHERE status = 1
         AND LOWER(trangthai_rachuong) IN ('hoanthanh', 'hoan_thanh', 'da_hoan', 'full')
       ORDER BY COALESCE(updatedat, createdat) DESC, storyid DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    return rows;
  },

  // 4. Mới Cập Nhật — JOIN chapter để lấy tên chương mới nhất của mỗi truyện
  async getRecentlyUpdated(limit = 7) {
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.storyCount,
              s.status, s.trangthai_rachuong, s.updatedat,
              lc.chaptername AS latestChapterName,
              lc.createdat   AS latestChapterDate,
              lc.chapterid   AS latestChapterId
       FROM stories s
       LEFT JOIN (
         SELECT c1.storyid, c1.chaptername, c1.createdat, c1.chapterid
         FROM chapter c1
         INNER JOIN (
           SELECT storyid, MAX(createdat) AS max_date
           FROM chapter
           WHERE status = 1
           GROUP BY storyid
         ) c2 ON c1.storyid = c2.storyid AND c1.createdat = c2.max_date
       ) lc ON s.storyid = lc.storyid
       WHERE s.status = 1
       ORDER BY COALESCE(lc.createdat, s.updatedat) DESC, s.storyid DESC
       LIMIT ?`,
      [parseInt(limit)]
    );
    return rows;
  },

  // 5. Tìm kiếm truyện theo từ khóa (LIKE — tìm tương đối, case-insensitive)
  async search(query) {
    const keyword = `%${query}%`;
    const [rows] = await db.query(
      `SELECT s.storyid, s.title, s.author, s.image, s.description,
              s.storyCount, s.status, s.trangthai_rachuong, s.createdat, s.updatedat,
              COALESCE(
                (SELECT JSON_ARRAYAGG(JSON_OBJECT('categoryID', c.categoryid, 'categoryname', c.categoryname))
                 FROM story_category sc
                 JOIN category c ON sc.categoryid = c.categoryid
                 WHERE sc.storyid = s.storyid),
                '[]'
              ) AS categories
       FROM stories s
       WHERE s.status = 1
         AND (s.title LIKE ? OR s.author LIKE ? OR s.description LIKE ?)
       GROUP BY s.storyid
       ORDER BY COALESCE(s.updatedat, s.createdat) DESC, s.storyid DESC`,
      [keyword, keyword, keyword]
    );
    return rows;
  },

  // 6. Lấy truyện theo thể loại
  async getByCategory(categoryId, limit = 20) {
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
       JOIN story_category sc_filter ON s.storyid = sc_filter.storyid
       WHERE sc_filter.categoryid = ?
         AND s.status = 1 
       GROUP BY s.storyid
       ORDER BY s.updatedat DESC
       LIMIT ?`,
      [parseInt(categoryId), parseInt(limit)]
    );
    return rows;
  },
};

module.exports = Story;