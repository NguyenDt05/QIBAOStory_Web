const StoryService = require('../services/StoryService'); 

const StoryController = {
  /**
   * Lấy danh sách truyện
   * Route: GET /api/stories?visibleOnly=true
   */
  async getAll(req, res) {
    try {
      // Ép kiểu query param visibleOnly từ string sang boolean
      const visibleOnly = req.query.visibleOnly === 'true'; 
      
      const stories = await StoryService.getAllStories({ visibleOnly });
      return res.status(200).json({
        success: true,
        data: stories
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Lấy chi tiết 1 truyện
   * Route: GET /api/stories/:id
   */
  async getById(req, res) {
    try {
      const storyId = req.params.id;
      const story = await StoryService.getStoryById(storyId);
      
      return res.status(200).json({
        success: true,
        data: story
      });
    } catch (error) {
      // Phân loại lỗi cơ bản: 404 nếu không tìm thấy, 400 hoặc 500 cho các lỗi khác
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Tạo truyện mới
   * Route: POST /api/stories
   */
  async create(req, res) {
    try {
      const storyData = req.body;
      const result = await StoryService.createStory(storyData);
      
      return res.status(201).json({
        success: true,
        message: result.message,
        data: { storyid: result.storyid }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Cập nhật thông tin truyện
   * Route: PUT /api/stories/:id
   */
  async update(req, res) {
    try {
      const storyId = req.params.id;
      const storyData = req.body;
      
      const result = await StoryService.updateStory(storyId, storyData);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('không tồn tại') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Xoá truyện
   * Route: DELETE /api/stories/:id
   */
  async delete(req, res) {
    try {
      const storyId = req.params.id;
      const result = await StoryService.deleteStory(storyId);
      
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('không tồn tại') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * Đổi trạng thái ẩn/hiện của truyện
   * Route: PATCH /api/stories/:id/toggle-visibility
   */
  async toggleVisibility(req, res) {
    try {
      const storyId = req.params.id;
      const updatedList = await StoryService.toggleStoryVisibility(storyId);
      
      return res.status(200).json({
        success: true,
        message: 'Đổi trạng thái truyện thành công',
        data: updatedList
      });
    } catch (error) {
      const statusCode = error.message.includes('không tồn tại') ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = StoryController;