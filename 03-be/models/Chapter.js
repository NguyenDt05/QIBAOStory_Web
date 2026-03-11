const db = require('../config/db');

const Chapter = {
  /** Lấy danh sách chương theo storyid */
  async getByStory(storyid) {
    // TODO
  },

  /** Lấy chi tiết 1 chương (có prev/next) */
  async getById(storyid, chapterid) {
    // TODO
  },

  /** Tạo chương mới */
  async create(storyid, data) {
    // TODO
  },

  /** Cập nhật chương */
  async update(storyid, chapterid, data) {
    // TODO
  },

  /** Xoá chương */
  async remove(storyid, chapterid) {
    // TODO
  },

  /** Đổi trạng thái ẩn/hiện */
  async toggleVisibility(storyid, chapterid) {
    // TODO
  },
};

module.exports = Chapter;
