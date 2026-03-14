const Story = require('../models/Story'); // Thay đổi đường dẫn tuỳ theo cấu trúc thư mục của bạn

const StoryService = {
  /** * Lấy danh sách truyện 
   */
  async getAllStories(options = {}) {
    try {
      const stories = await Story.getAll(options);
      return stories;
    } catch (error) {
      // Bạn có thể log lỗi ra hệ thống ở đây
      throw new Error('Lỗi khi lấy danh sách truyện: ' + error.message);
    }
  },

  /** * Lấy chi tiết 1 truyện theo ID 
   */
  async getStoryById(storyid) {
    try {
      if (!storyid) throw new Error('Yêu cầu cung cấp ID truyện');
      
      const story = await Story.getById(storyid);
      if (!story) {
        throw new Error('Không tìm thấy truyện này trong hệ thống');
      }
      return story;
    } catch (error) {
      throw error;
    }
  },

  /** * Thêm mới truyện 
   */
  async createStory(data) {
    try {
      // Validation cơ bản (Nghiệp vụ)
      if (!data.title || !data.author) {
        throw new Error('Tiêu đề và tên tác giả là bắt buộc');
      }

      // Có thể thêm logic xử lý default cho data ở đây nếu cần
      const newId = await Story.create(data);
      return { 
        success: true, 
        message: 'Tạo truyện thành công', 
        storyid: newId 
      };
    } catch (error) {
      throw new Error('Lỗi khi tạo truyện mới: ' + error.message);
    }
  },

  /** * Cập nhật thông tin truyện 
   */
  async updateStory(storyid, data) {
    try {
      // Kiểm tra xem truyện có tồn tại không trước khi update
      const existingStory = await Story.getById(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại hoặc đã bị xoá');
      }

      await Story.update(storyid, data);
      return { 
        success: true, 
        message: 'Cập nhật thông tin truyện thành công' 
      };
    } catch (error) {
      throw error;
    }
  },

  /** * Xoá truyện 
   */
  async deleteStory(storyid) {
    try {
      // Kiểm tra truyện có tồn tại không
      const existingStory = await Story.getById(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại để xoá');
      }

      await Story.remove(storyid);
      return { 
        success: true, 
        message: 'Xoá truyện thành công' 
      };
    } catch (error) {
      throw error;
    }
  },

  /** * Đổi trạng thái ẩn/hiện của truyện 
   */
  async toggleStoryVisibility(storyid) {
    try {
      const existingStory = await Story.getById(storyid);
      if (!existingStory) {
        throw new Error('Truyện không tồn tại để đổi trạng thái');
      }

      // Trả về danh sách mới dựa theo logic model của bạn
      const updatedList = await Story.toggleVisibility(storyid);
      return updatedList; 
    } catch (error) {
      throw error;
    }
  }
};

module.exports = StoryService;