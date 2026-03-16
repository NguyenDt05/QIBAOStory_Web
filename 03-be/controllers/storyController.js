const StoryService = require('../services/StoryService');

const StoryController = {
  // ── USER CONTROLLERS (Public) ──────────────────────────────────────

  /** Lấy danh sách truyện công khai */
  async getPublicStories(req, res) {
    try {
      const stories = await StoryService.getAllStories({ visibleOnly: true });
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** Xem chi tiết truyện cho người đọc */
  async getDetailForUser(req, res) {
    try {
      const { storyid } = req.params;
      const story = await StoryService.getStoryDetailForUser(storyid);
      
      if (!story) {
        return res.status(404).json({ success: false, message: 'Truyện không tồn tại hoặc đã bị ẩn' });
      }

      return res.status(200).json({ success: true, data: story });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ── ADMIN CONTROLLERS (Quản trị) ────────────────────────────────────

  /** Lấy tất cả truyện (Bao gồm cả truyện ẩn) */
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
      // 1. Thu thập dữ liệu text
      const storyData = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        storyCount: req.body.storyCount || "0",
        trangthai_rachuong: req.body.trangthai_rachuong,
        status: (req.body.status === 'true' || req.body.status === '1' || req.body.status === 1) ? 1 : 0
      };
      
      // 2. Xử lý ảnh (Multer)
      if (req.file) {
        storyData.image = `uploads/covers/${req.file.filename}`;
      } else {
        storyData.image = req.body.image || null; // Hỗ trợ gán path thủ công nếu cần
      }

      // 3. Xử lý categoryIDs an toàn
      let categoryIDs = [];
      const rawIDs = req.body.categoryIDs;
      if (rawIDs) {
        if (typeof rawIDs === 'string') {
          categoryIDs = rawIDs.split(',').map(Number).filter(id => !isNaN(id));
        } else if (Array.isArray(rawIDs)) {
          categoryIDs = rawIDs.map(Number).filter(id => !isNaN(id));
        }
      }

      const result = await StoryService.createStory(storyData, categoryIDs);
      
      return res.status(201).json({
        success: true,
        message: 'Tạo truyện mới thành công',
        storyid: result
      });
    } catch (error) {
      console.error("Lỗi tại Controller Create:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** Cập nhật truyện */
  
  async update(req, res) {
    try {
      const { storyid } = req.params;
      
      const storyData = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        storyCount: req.body.storyCount,
        trangthai_rachuong: req.body.trangthai_rachuong,
        status: (req.body.status === 'true' || req.body.status === '1' || req.body.status === 1) ? 1 : 0
      };

      if (req.file) {
        storyData.image = `uploads/covers/${req.file.filename}`;
      }

      let categoryIDs = [];
      const rawIDs = req.body.categoryIDs;
      if (rawIDs) {
        if (typeof rawIDs === 'string') {
          categoryIDs = rawIDs.split(',').map(Number).filter(id => !isNaN(id));
        } else if (Array.isArray(rawIDs)) {
          categoryIDs = rawIDs.map(Number).filter(id => !isNaN(id));
        }
      }

      await StoryService.updateStory(storyid, storyData, categoryIDs);
      
      return res.status(200).json({ success: true, message: 'Cập nhật truyện thành công' });
    } catch (error) {
      console.error("Lỗi tại Controller Update:", error);
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

  /** Đổi trạng thái hiển thị nhanh */
  async toggleVisibility(req, res) {
    try {
      const { storyid } = req.params;
      
      // 1. Thực hiện đảo ngược status trong DB
      await StoryService.toggleStoryVisibility(storyid);
      
      // 2. Lấy lại toàn bộ danh sách truyện mới để FE cập nhật lại State
      // Điều này giúp giao diện mượt mà, không cần F5
      const updatedList = await StoryService.getAllStories(); 
      
      return res.status(200).json(updatedList); 
    } catch (error) {
      console.error("Lỗi toggleVisibility:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};
module.exports = StoryController;