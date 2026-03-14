const Category = require('../models/Category');

const categoryService = {
  // Lấy toàn bộ danh mục
  async getAllCategories() {
    try {
      const categories = await Category.getAll();
      return categories;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách danh mục: ' + error.message);
    }
  },

  // Tạo danh mục mới (có kiểm tra tên trùng)
  async createCategory(categoryData) {
    if (!categoryData.categoryname || categoryData.categoryname.trim() === '') {
      throw new Error('Tên danh mục không được để trống');
    }
    
    try {
      const newId = await Category.create(categoryData);
      return { id: newId, ...categoryData };
    } catch (error) {
      throw new Error('Không thể tạo danh mục: ' + error.message);
    }
  },

  // Cập nhật thông tin danh mục
  async updateCategory(id, data) {
    if (!id) throw new Error('Thiếu ID danh mục');
    
    try {
      await Category.update(id, data);
      return { message: 'Cập nhật thành công' };
    } catch (error) {
      throw new Error('Cập nhật thất bại: ' + error.message);
    }
  },

  // Xóa danh mục
  async deleteCategory(id) {
    try {
      await Category.remove(id);
      return { message: 'Xóa danh mục thành công' };
    } catch (error) {
      throw new Error('Xóa thất bại (có thể danh mục đang có truyện): ' + error.message);
    }
  },

  // Ẩn/Hiện danh mục
  async toggleCategoryStatus(id) {
    try {
      const updatedList = await Category.toggleVisibility(id);
      return updatedList;
    } catch (error) {
      throw new Error('Lỗi khi thay đổi trạng thái: ' + error.message);
    }
  }
};

module.exports = categoryService;