const Story = require('../models/Story');

const StoryService = {
  /** * Lấy danh sách truyện (Hỗ trợ visibleOnly cho User)
   */
  async getAllStories(options = {}) {
    try {
      // options sẽ chứa { visibleOnly: true/false } truyền từ Controller
      const stories = await Story.getAll(options);
      return stories;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách truyện: ' + error.message);
    }
  },

  /** * Lấy chi tiết truyện cho USER (Chỉ xem được nếu status = 1)
   */
  async getStoryDetailForUser(storyid) {
    try {
      if (!storyid) throw new Error('Yêu cầu cung cấp ID truyện');
      
      const story = await Story.getDetailForUser(storyid);
      return story; // Sẽ trả về null nếu truyện bị ẩn (do logic trong Model)
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin truyện: ' + error.message);
    }
  },

  /** * Lấy chi tiết truyện cho ADMIN (Lấy hết mọi thông tin để Edit)
   */
  async getStoryDetailForAdmin(storyid) {
    try {
      if (!storyid) throw new Error('Yêu cầu cung cấp ID truyện');
      
      const story = await Story.getDetailForAdmin(storyid);
      return story;
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin quản trị: ' + error.message);
    }
  },

  /** * Thêm mới truyện (Nhận data chứa storyCount từ Controller)
   */
  async createStory(data) {
    try {
      if (!data.title || !data.author) {
        throw new Error('Tiêu đề và tên tác giả là bắt buộc');
      }
      // storyCount sẽ nằm trong object data
      const newId = await Story.create(data);
      return newId;
    } catch (error) {
      throw new Error('Lỗi khi tạo truyện mới: ' + error.message);
    }
  },

  /** * Cập nhật thông tin truyện
   */
  async updateStory(storyid, data) {
    try {
      // Dùng hàm Admin để kiểm tra tồn tại (vì truyện ẩn vẫn phải update được)
      const existingStory = await Story.getDetailForAdmin(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại hoặc đã bị xoá');
      }

      await Story.update(storyid, data);
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