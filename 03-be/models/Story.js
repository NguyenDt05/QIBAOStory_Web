const db = require('../config/db');

const Story = {
  /** Lấy tất cả truyện (tuỳ chọn lọc visible) */
  async getAll({ visibleOnly = false } = {}) {
    // TODO
  },

  /** Lấy 1 truyện theo storyid */
  async getById(storyid) {
    // TODO
  },

  /** Tạo truyện mới */
  async create(data) {
    // TODO
  },

  /** Cập nhật truyện */
  async update(storyid, data) {
    // TODO
  },

  /** Xoá truyện */
  async remove(storyid) {
    // TODO
  },

  /** Đổi trạng thái ẩn/hiện */
  async toggleVisibility(storyid) {
    // TODO
  },

  /** Lấy truyện liên quan */
  async getRelated(storyid, limit = 6) {
    // TODO
  },
};

module.exports = Story;
