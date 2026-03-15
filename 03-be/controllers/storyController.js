const StoryService = require('../services/StoryService');

const StoryController = {
  // ── USER CONTROLLERS ────────────────────────────────────────────────
  
  /** Lấy danh sách truyện cho User (Chỉ truyện đang hiện) */
  async getPublicStories(req, res) {
    try {
      const stories = await StoryService.getAllStories({ visibleOnly: true });
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** Xem chi tiết truyện cho User */
  async getDetailForUser(req, res) {
    try {
      const { storyid } = req.params;
      const story = await StoryService.getStoryDetailForUser(storyid);
      
      if (!story) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy truyện hoặc truyện đã bị ẩn' });
      }

      return res.status(200).json({ success: true, data: story });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ── ADMIN CONTROLLERS ───────────────────────────────────────────────

  /** Lấy tất cả truyện cho Admin (Bao gồm cả truyện ẩn) */
  async getAdminStories(req, res) {
    try {
      const stories = await StoryService.getAllStories({ visibleOnly: false });
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** Lấy chi tiết đầy đủ cho Admin (Để đổ vào form Edit) */
  async getDetailForAdmin(req, res) {
    try {
      const { storyid } = req.params;
      const story = await StoryService.getStoryDetailForAdmin(storyid);
      
      if (!story) {
        return res.status(404).json({ success: false, message: 'Truyện không tồn tại' });
      }

      return res.status(200).json({ success: true, data: story });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** Tạo truyện mới */
  async create(req, res) {
    try {
      const storyData = req.body;
      
      // Nếu có upload ảnh, lấy đường dẫn ảnh từ req.file
      if (req.file) {
        storyData.image = `/uploads/covers/${req.file.filename}`;
      }

      const result = await StoryService.createStory(storyData);
      return res.status(201).json({
        success: true,
        message: 'Tạo truyện mới thành công',
        storyid: result
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** Cập nhật truyện */
  async update(req, res) {
    try {
      const { storyid } = req.params;
      const storyData = req.body;

      // Cập nhật ảnh mới nếu có upload
      if (req.file) {
        storyData.image = `/uploads/covers/${req.file.filename}`;
      }

      await StoryService.updateStory(storyid, storyData);
      return res.status(200).json({ success: true, message: 'Cập nhật truyện thành công' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** Xóa truyện */
  async remove(req, res) {
    try {
      const { storyid } = req.params;
      await StoryService.deleteStory(storyid);
      return res.status(200).json({ success: true, message: 'Xóa truyện thành công' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** Ẩn/Hiện truyện */
  async toggleVisibility(req, res) {
    try {
      const { storyid } = req.params;
      await StoryService.toggleStoryVisibility(storyid);
      return res.status(200).json({ success: true, message: 'Đã thay đổi trạng thái hiển thị' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = StoryController;