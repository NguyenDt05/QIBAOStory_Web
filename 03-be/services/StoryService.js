const Story = require('../models/Story');

const StoryService = {
  /** * Lấy danh sách truyện (Hỗ trợ visibleOnly cho User)
   */
  async getAllStories(options = {}) {
    try {
      return await Story.getAll(options);
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách truyện: ' + error.message);
    }
  },

  /** * Lấy chi tiết truyện cho USER (Chỉ xem được nếu status = 1)
   */
  async getStoryDetailForUser(storyid) {
    try {
      if (!storyid) throw new Error('Yêu cầu cung cấp ID truyện');
      return await Story.getDetailForUser(storyid);
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin truyện: ' + error.message);
    }
  },

  /** * Lấy chi tiết truyện cho ADMIN (Lấy hết mọi thông tin để Edit)
   */
  async getStoryDetailForAdmin(storyid) {
    try {
      if (!storyid) throw new Error('Yêu cầu cung cấp ID truyện');
      return await Story.getDetailForAdmin(storyid);
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin quản trị: ' + error.message);
    }
  },

  /** * Thêm mới truyện
   * @param {Object} data - Thông tin truyện (bao gồm cả image path và storyCount)
   * @param {Array} categoryIDs - Mảng các ID thể loại [1, 2, 20]
   */
  async createStory(data, categoryIDs) {
    try {
      if (!data.title || !data.author) {
        throw new Error('Tiêu đề và tên tác giả là bắt buộc');
      }
      
      // Truyền cả 2 tham số xuống Model để thực hiện Transaction
      const newId = await Story.create(data, categoryIDs);
      return newId;
    } catch (error) {
      throw new Error('Lỗi khi tạo truyện mới: ' + error.message);
    }
  },

  /** * Cập nhật thông tin truyện
   */
  async updateStory(storyid, data, categoryIDs) {
    try {
      const existingStory = await Story.getDetailForAdmin(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại hoặc đã bị xoá');
      }

      // Cập nhật cả thông tin truyện và danh sách thể loại mới
      await Story.update(storyid, data, categoryIDs);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /** * Xoá truyện
   */
  async deleteStory(storyid) {
    try {
      const existingStory = await Story.getDetailForAdmin(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại để xoá');
      }

      await Story.remove(storyid);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /** * Đổi trạng thái ẩn/hiện
   */
  async toggleStoryVisibility(storyid) {
    try {
      const existingStory = await Story.getDetailForAdmin(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại để đổi trạng thái');
      }

      await Story.toggleVisibility(storyid);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = StoryService;