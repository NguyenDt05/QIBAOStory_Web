// categoryController.js
// Xử lý CRUD thể loại: getAll (user/admin), create, update, toggle, delete

const Category = require('../models/Category');

const categoryController = {
  async getAll(req, res, next) {
    try {
      // Nếu có token và role là admin thì visibleOnly = false (lấy tất cả)
      const isAdmin = req.user && req.user.role === 'admin';
      const categories = await Category.getAll({ visibleOnly: !isAdmin });
      
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { categoryname } = req.body;
      const existing = await Category.findByName(categoryname);
      if (existing) return res.status(400).json({ success: false, message: 'Thể loại đã tồn tại.' });

      await Category.create(req.body);
      res.status(201).json({ success: true, message: 'Thêm thể loại thành công.' });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      await Category.update(req.params.id, req.body);
      res.json({ success: true, message: 'Cập nhật thành công.' });
    } catch (err) {
      next(err);
    }
  },

  async toggle(req, res, next) {
    try {
      const updated = await Category.toggleVisibility(req.params.id);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await Category.remove(req.params.id);
      res.json({ success: true, message: 'Đã xóa thể loại và dọn dẹp liên kết.' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = categoryController;