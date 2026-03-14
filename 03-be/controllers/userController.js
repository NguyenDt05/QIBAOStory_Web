const UserService = require('../services/UserService'); 
const bcrypt = require('bcrypt'); 

const UserController = {
  /**
   * [GET] Lấy danh sách tất cả người dùng (Dành cho Admin)
   * Route: GET /api/users
   */
  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * [POST] Đăng ký tài khoản (Register)
   * Route: POST /api/users/register
   */
  async register(req, res) {
    try {
      const { username, password, tenhienthi } = req.body;

      // 1. Kiểm tra đầu vào cơ bản ở Controller
      if (!username || !password || !tenhienthi) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ username, password và tên hiển thị'
        });
      }

      // 2. Mã hóa mật khẩu (Hashing) trước khi gọi Service
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 3. Gửi dữ liệu xuống Service (đã thay thế password gốc bằng password đã mã hóa)
      const userData = { 
        username, 
        password: hashedPassword, 
        tenhienthi 
      };
      
      const result = await UserService.createUser(userData);
      
      return res.status(201).json(result);
    } catch (error) {
      // Bắt lỗi trùng username từ Service ném lên
      const statusCode = error.message.includes('đã được sử dụng') ? 409 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * [POST] Đăng nhập (Login)
   * Route: POST /api/users/login
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp username và password'
        });
      }

      // 1. Lấy user từ database thông qua Service
      const user = await UserService.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản không tồn tại'
        });
      }

      // 2. So sánh mật khẩu người dùng nhập vào với mật khẩu đã băm trong DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu không chính xác'
        });
      }

      // 3. Kiểm tra xem tài khoản có bị khóa không (status = 0)
      if (user.status === 0) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản của bạn đã bị khóa'
        });
      }

      // TODO: Ở đây bạn có thể tạo và trả về JWT Token cho Frontend
      // const token = jwt.sign({ userid: user.userid, role: user.role }, 'SECRET_KEY', { expiresIn: '1h' });

      // Tạm thời chỉ trả về thông tin user (nhớ xóa password trước khi trả về client)
      delete user.password;
      
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        data: user
        // token: token
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập: ' + error.message
      });
    }
  },

  /**
   * [PATCH] Đổi trạng thái tài khoản (Khóa/Mở khóa)
   * Route: PATCH /api/users/:id/toggle-status
   */
  async toggleStatus(req, res) {
    try {
      const userId = req.params.id;
      const result = await UserService.toggleUserStatus(userId);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * [DELETE] Xóa tài khoản
   * Route: DELETE /api/users/:id
   */
  async delete(req, res) {
    try {
      const userId = req.params.id;
      const result = await UserService.deleteUser(userId);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * [PUT] Cập nhật Profile (Tên hiển thị, Avatar)
   * Route: PUT /api/users/:id/profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.params.id;
      const { tenhienthi, avatar } = req.body; // Lấy data từ form
      
      const result = await UserService.updateProfile(userId, { tenhienthi, avatar });
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  /**
   * [PATCH] Đổi mật khẩu
   * Route: PATCH /api/users/:id/password
   */
  async changePassword(req, res) {
    try {
      const userId = req.params.id;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
        });
      }

      // Mã hóa mật khẩu mới trước khi lưu
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      const result = await UserService.updatePassword(userId, hashedPassword);
      
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = UserController;