// userService.js
// Gọi API BE cho users: quản lý user (Admin) và profile (User)
// Lưu ý: axiosConfig interceptor đã unwrap response.data của axios → 
//   res = { success, data: [...] } nên dùng res.data nếu cần array, hoặc dùng res trực tiếp nếu BE trả về array

import axiosConfig from './axiosConfig';

// ── ADMIN ──────────────────────────────────────────────────────────

/** Lấy danh sách tất cả người dùng (Admin) */
export async function getAllUsers() {
  const res = await axiosConfig.get('/users');
  return res?.data || res || [];
}

/** Khóa / Mở khóa user (Admin) */
export async function toggleUserStatus(userid) {
  const res = await axiosConfig.patch(`/users/${userid}/toggle`);
  return res?.data || res || [];
}

/** Xóa user (Admin) */
export async function deleteUser(userid) {
  await axiosConfig.delete(`/users/${userid}`);
  return await getAllUsers();
}

// ── USER PROFILE ───────────────────────────────────────────────────

/** Lấy thông tin cá nhân */
export async function getProfile(userid) {
  const res = await axiosConfig.get(`/users/${userid}`);
  return res?.data || res;
}

/** Cập nhật thông tin cá nhân — nhận FormData (có image) hoặc object JSON */
export async function updateProfile(userid, data) {
  const isFormData = data instanceof FormData;
  const res = await axiosConfig.put(
    `/users/${userid}/profile`,
    data,
    isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
  );
  return res?.data || res;
}

/** Đổi mật khẩu — gửi cả currentPassword để server verify */
export async function changePassword(userid, { currentPassword, newPassword }) {
  const res = await axiosConfig.patch(`/users/${userid}/password`, { currentPassword, newPassword });
  return res?.data || res;
}

// ── LIBRARY ────────────────────────────────────────────────────────

/** Lấy danh sách tủ sách */
export async function getLibrary(userid) {
  const res = await axiosConfig.get(`/users/${userid}/library`);
  return res?.data || res || [];
}

/** Thêm truyện vào tủ sách */
export async function addToLibraryAPI(userid, storyid) {
  const res = await axiosConfig.post(`/users/${userid}/library/${storyid}`);
  return res?.data || res;
}

/** Xóa truyện khỏi tủ sách */
export async function removeFromLibraryAPI(userid, storyid) {
  const res = await axiosConfig.delete(`/users/${userid}/library/${storyid}`);
  return res?.data || res;
}
