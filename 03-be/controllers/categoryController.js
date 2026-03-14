
const categoryService = require('../services/CategoryService');

const categoryController = {
  // GET: /api/categories
  async getAll(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Khong lay duoc danh sach danh muc" });
    }
  },

  // POST: /api/categories
  async create(req, res) {
    try {
      const newCategory = await categoryService.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      // 400 cho lỗi dữ liệu đầu vào không hợp lệ
      res.status(400).json({ message: error.message });
    }
  },

  // PUT: /api/categories/:id
  async update(req, res) {
    try {
      const { categoryID } = req.params; 
      const result = await categoryService.updateCategory(categoryID, req.body);
      res.status(200).json(result);
    } catch (error) {
     res.status(400).json({ message: error.message });
  }
},

  // DELETE: /api/categories/:categoryID
  async delete(req, res) {
    try {
      const { categoryID } = req.params;
      const result = await categoryService.deleteCategory(categoryID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // PATCH: /api/categories/:categoryID/toggle
  async toggleStatus(req, res) {
    try {
      const { categoryID } = req.params;
      const updatedList = await categoryService.toggleCategoryStatus(categoryID);
      res.status(200).json(updatedList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = categoryController;