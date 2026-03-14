const User = require('../models/User'); // Thay đổi đường dẫn theo cấu trúc của bạn

const UserService = {
  /**
   * Lấy danh sách tất cả người dùng (Dành cho UserManager / Admin)
   */
  async getAllUsers() {
    try {
      const users = await User.getAll();
      return users;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách người dùng: ' + error.message);
    }
  },

  /**
   * Lấy thông tin user bằng username (Dành cho Login)
   */
  async getUserByUsername(username) {
    try {
      if (!username) {
        throw new Error('Vui lòng cung cấp username');
      }
      const user = await User.getByUsername(username);
      return user; // Sẽ trả về null nếu không tìm thấy (đã xử lý bên Model)
    } catch (error) {
      throw new Error('Lỗi khi tìm kiếm người dùng: ' + error.message);
    }
  },

  /**
   * Tạo tài khoản mới (Dành cho Register)
   */
  async createUser(data) {
    try {
      // 1. Validation dữ liệu đầu vào
      if (!data.username || !data.password || !data.tenhienthi) {
        throw new Error('Username, password và tên hiển thị là bắt buộc');
      }

      // 2. Kiểm tra xem username đã tồn tại chưa
      const existingUser = await User.getByUsername(data.username);
      if (existingUser) {
        throw new Error('Tên đăng nhập này đã được sử dụng');
      }

      // 3. Thực hiện tạo user (Lưu ý: password truyền vào đây nên là password ĐÃ ĐƯỢC HASH từ controller)
      const newUserId = await User.create(data);
      return {
        success: true,
        message: 'Đăng ký tài khoản thành công',
        userid: newUserId
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Ẩn/Hiện tài khoản (Khóa/Mở khóa tài khoản)
   */
  async toggleUserStatus(userid) {
    try {
      if (!userid) throw new Error('Cần cung cấp ID người dùng');
      
      const updatedList = await User.toggleStatus(userid);
      return {
        success: true,
        message: 'Đã thay đổi trạng thái người dùng',
        data: updatedList
      };
    } catch (error) {
      throw new Error('Lỗi khi thay đổi trạng thái: ' + error.message);
    }
  },

  /**
   * Xoá tài khoản vĩnh viễn
   */
  async deleteUser(userid) {
    try {
      if (!userid) throw new Error('Cần cung cấp ID người dùng');

      const updatedList = await User.remove(userid);
      return {
        success: true,
        message: 'Đã xoá người dùng thành công',
        data: updatedList
      };
    } catch (error) {
      throw new Error('Lỗi khi xoá người dùng: ' + error.message);
    }
  },

  /**
   * Cập nhật Profile (Tên hiển thị, Avatar)
   */
  async updateProfile(userid, data) {
    try {
      if (!userid) throw new Error('Cần cung cấp ID người dùng');
      if (!data.tenhienthi) throw new Error('Tên hiển thị không được để trống');

      await User.updateProfile(userid, data);
      return {
        success: true,
        message: 'Cập nhật thông tin cá nhân thành công'
      };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật profile: ' + error.message);
    }
  },

  /**
   * Đổi mật khẩu
   */
  async updatePassword(userid, hashedPassword) {
    try {
      if (!userid || !hashedPassword) {
        throw new Error('Dữ liệu đổi mật khẩu không hợp lệ');
      }

      await User.updatePassword(userid, hashedPassword);
      return {
        success: true,
        message: 'Đổi mật khẩu thành công'
      };
    } catch (error) {
      throw new Error('Lỗi khi đổi mật khẩu: ' + error.message);
    }
  }
};

module.exports = UserService;