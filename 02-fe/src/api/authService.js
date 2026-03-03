import { delay } from './http';
import { USERS_MOCK, EXISTING_USERNAMES } from '../constants/mockData';

export async function checkUsernameExists(username) {
  await delay(200);
  const normalized = username.trim().toLowerCase();
  return USERS_MOCK.some(u => u.username.toLowerCase() === normalized) ||
    EXISTING_USERNAMES.some(u => u.toLowerCase() === normalized);
}

export async function login(username, password) {
  await delay(400);
  const user = USERS_MOCK.find(
    u => u.username.toLowerCase() === username.trim().toLowerCase(),
  );
  if (!user) throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
  if (!user.status) throw new Error('Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.');
  return { role: user.role, tenhienthi: user.tenhienthi, username: user.username.trim() };
}
