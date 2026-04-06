// storyController.js
// Xử lý logic nghiệp vụ cho Stories: CRUD truyện (Admin) và xem truyện (User)

const StoryService = require('../services/StoryService');
const Chapter = require('../models/Chapter');

/**
 * Trim tất cả key và value string trong req.body.
 * Tránh lỗi khi Postman/FE gửi key có dấu cách thừa (vd: 'title ' thay vì 'title')
 */
function sanitizeBody(body) {
  const result = {};
  for (const [key, value] of Object.entries(body)) {
    result[key.trim()] = typeof value === 'string' ? value.trim() : value;
  }
  return result;
}

const StoryController = {
  // ── USER CONTROLLERS (Public) ──────────────────────────────────────

  /** GET /api/stories — Danh sách truyện công khai (status = 1) */
  async getPublicStories(req, res) {
    try {
      const stories = await StoryService.getAllStories({ visibleOnly: true });
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** ==========================================
   *  CÁC API TRANG CHỦ (PUBLIC) - TRẢ VỀ RẤT NHANH
   *  ========================================== */

  async getHotHome(req, res) {
    try {
      const Story = require('../models/Story');
      const stories = await Story.getHotStories(8);
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getNewestHome(req, res) {
    try {
      const Story = require('../models/Story');
      const stories = await Story.getNewestStories(8);
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getCompletedHome(req, res) {
    try {
      const Story = require('../models/Story');
      const stories = await Story.getCompletedStories(8);
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getUpdatedHome(req, res) {
    try {
      const Story = require('../models/Story');
      const stories = await Story.getRecentlyUpdated(8);
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /api/stories/search?q=... — Tìm kiếm tương đối theo từ khóa */
  async search(req, res) {
    try {
      const q = (req.query.q ?? '').trim();
      if (!q) {
        return res.status(200).json({ success: true, data: [] });
      }
      const stories = await StoryService.searchStories(q);
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /api/stories/category/:categoryid — Danh sách truyện theo thể loại */
  async getByCategory(req, res) {
    try {
      const { categoryid } = req.params;
      const Story = require('../models/Story');
      const stories = await Story.getByCategory(categoryid);
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /api/stories/:storyid — Lấy thông tin cơ bản của truyện (dành cho User) */
  async getBasicForUser(req, res) {
    try {
      const { storyid } = req.params;
      const story = await StoryService.getStoryDetailForUser(storyid);

      if (!story) {
        return res.status(404).json({ success: false, message: 'Truyện không tồn tại hoặc đã bị ẩn' });
      }

      return res.status(200).json({
        success: true,
        data: story
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /api/stories/:storyid/detail — Chi tiết truyện kèm danh sách chương (dành cho User) */
  async getDetailForUser(req, res) {
    try {
      const { storyid } = req.params;
      const story = await StoryService.getStoryDetailForUser(storyid);

      if (!story) {
        return res.status(404).json({ success: false, message: 'Truyện không tồn tại hoặc đã bị ẩn' });
      }

      const chapters = await Chapter.getByStory(storyid);

      return res.status(200).json({
        success: true,
        data: { story, chapters }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // ── ADMIN CONTROLLERS (Quản trị) ────────────────────────────────────

  /** GET /api/stories/admin/all — Tất cả truyện kể cả ẩn */
  async getAdminStories(req, res) {
    try {
      const stories = await StoryService.getAllStories({ visibleOnly: false });
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /api/stories/:storyid — Chi tiết truyện để Admin đổ vào form Edit */
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

  /** POST /api/stories — Tạo truyện mới */
  async create(req, res) {
    try {
      const body = sanitizeBody(req.body);

      const storyData = {
        title: body.title || null,
        author: body.author || null,
        description: body.description || null,
        storyCount: body.storyCount || '0',
        trangthai_rachuong: body.trangthai_rachuong || null,
        status: (body.status === 'true' || body.status === '1' || body.status === 1) ? 1 : 0,
      };

      if (req.file) {
        storyData.image = `uploads/covers/${req.file.filename}`;
      } else {
        storyData.image = body.image || null;
      }

      let categoryIDs = [];
      const rawIDs = body.categoryIDs;
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
        storyid: result,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** PUT /api/stories/:storyid — Cập nhật truyện */
  async update(req, res) {
    try {
      const { storyid } = req.params;
      const body = sanitizeBody(req.body);

      const storyData = {
        title: body.title || null,
        author: body.author || null,
        description: body.description || null,
        storyCount: body.storyCount !== undefined && body.storyCount !== ''
          ? String(body.storyCount)
          : '0',
        trangthai_rachuong: body.trangthai_rachuong || null,
        status: (
          body.status === 'true' ||
          body.status === '1' ||
          body.status === 1 ||
          body.status === true
        ) ? 1 : 0,
      };

      if (req.file) {
        storyData.image = `uploads/covers/${req.file.filename}`;
      } else if (body.image) {
        storyData.image = body.image;
      }

      // undefined = không gửi categoryIDs → giữ nguyên thể loại cũ
      let categoryIDs = undefined;
      const rawIDs = body.categoryIDs;
      if (rawIDs !== undefined && rawIDs !== '') {
        if (typeof rawIDs === 'string') {
          try {
            const parsed = JSON.parse(rawIDs);
            categoryIDs = Array.isArray(parsed) ? parsed.map(Number).filter(id => !isNaN(id)) : [];
          } catch {
            categoryIDs = rawIDs.split(',').map(Number).filter(id => !isNaN(id));
          }
        } else if (Array.isArray(rawIDs)) {
          categoryIDs = rawIDs.map(Number).filter(id => !isNaN(id));
        }
      }

      await StoryService.updateStory(storyid, storyData, categoryIDs);

      return res.status(200).json({ success: true, message: 'Cập nhật truyện thành công' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** DELETE /api/stories/:storyid — Xóa truyện */
  async remove(req, res) {
    try {
      const { storyid } = req.params;
      await StoryService.deleteStory(storyid);
      return res.status(200).json({ success: true, message: 'Xóa truyện thành công' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  /** PATCH /api/stories/:storyid/toggle — Ẩn/hiện truyện nhanh */
  async toggleVisibility(req, res) {
    try {
      const { storyid } = req.params;
      await StoryService.toggleStoryVisibility(storyid);
      const updatedList = await StoryService.getAllStories();
      return res.status(200).json(updatedList);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
};

module.exports = StoryController;