// authService.js
// Xác thực người dùng: đăng ký, đăng nhập, kiểm tra username

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const TOKEN_KEY    = 'token';        // JWT token — axiosConfig đọc key này
const USER_KEY     = 'qibao_user';  // User object — AuthContext đọc key này

// Kiểm tra username tồn tại
export async function checkUsernameExists(username) {
  if (!username) return false;
  try {
    const response = await axios.get(`${API_URL}/check-username/${username.trim()}`);
    return response.data.exists;
  } catch {
    return false;
  }
}

/**
 * Đăng ký tài khoản mới
 * POST /api/auth/register — body: { username, password, tenhienthi }
 */
export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // { success: true, message: "..." }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
}

/**
 * Đăng nhập
 * POST /api/auth/login — body: { username, password }
 * Lưu token vào localStorage['token'] để axiosConfig tự đính kèm vào header
 * Lưu user object vào localStorage['qibao_user'] để AuthContext restore khi refresh
 * Trả về user object để caller gọi AuthContext.login(user)
 */
export async function login(username, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username: username.trim(),
      password,
    });

    if (response.data.success) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    }

    throw new Error('Đăng nhập thất bại');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
}

/**
 * Đăng xuất — xóa token và user khỏi localStorage
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}