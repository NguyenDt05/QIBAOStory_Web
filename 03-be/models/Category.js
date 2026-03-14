const db = require('../config/db');

const Category = {
  async getAll() {
    const [rows] = await db.query(
      `SELECT c.categoryid, c.categoryname, c.status, count(s.storyid) as storyCount
      FROM category c 
      left join story_category s on s.categoryid = c.categoryid
      group by c.categoryid
      order by c.categoryname asc
      `,
    );
    return rows;
  },

  async create(data) {
    const [result] = await db.query(`INSERT INTO category (categoryname) VALUES (?)`, [data.categoryname]);
    return result.insertId;
  },

  async update(categoryID, data) {
    await db.query(
      'UPDATE category SET categoryname = ?, status = ? WHERE categoryid = ?', 
      [data.categoryname, data.status, categoryID]
    );
  },

  async remove(categoryID) {
        await db.query('DELETE FROM category WHERE categoryid = ?', [categoryID]);
  },

  async toggleVisibility(categoryID) {
    await db.query('UPDATE category SET status = 1- status WHERE categoryid = ?',[categoryID]);
    return this.getAll();
  },
};

module.exports = Category;
