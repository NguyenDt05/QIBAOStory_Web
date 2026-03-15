import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// Kiểm tra username tồn tại (Đã có)
export async function checkUsernameExists(username) {
  if (!username) return false;
  try {
    const response = await axios.get(`${API_URL}/check-username/${username.trim()}`);
    return response.data.exists;
  } catch (error) {
    return false;
  }
}

/**
 * HÀM ĐĂNG KÝ MỚI (Cần bổ sung)
 */
export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Trả về { success: true, message: "..." }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
}

// Hàm Login (Giữ nguyên bản cũ của bạn)
export async function login(username, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { username: username.trim(), password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
}