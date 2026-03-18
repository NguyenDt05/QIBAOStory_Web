// statsService.js
// Gọi API BE để lấy thống kê Dashboard Admin

import axiosConfig from './axiosConfig';

/**
 * Lấy 4 thẻ thống kê Dashboard
 * GET /api/stats/dashboard — trả về { success, data: [...] }
 * Mỗi item: { title, count, description, icon, link, bgColor, textColor }
 */
export async function getDashboardStats() {
  const res = await axiosConfig.get('/stats/dashboard');
  return res?.data || res || [];
}
