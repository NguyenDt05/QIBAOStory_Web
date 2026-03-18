// historyService.js
// Gọi API BE cho lịch sử đọc (reading_history)

import axiosConfig from './axiosConfig';

/**
 * Lấy lịch sử đọc của user (chuỗi truyện đã đọc gần đây, mỗi truyện 1 chương gần nhất)
 * GET /api/users/:userid/history
 * Trả về array: [{ storyid, chapterid, storyTitle, storyCover, chaptername, read_at }]
 */
export async function getHistory(userid) {
  const res = await axiosConfig.get(`/users/${userid}/history`);
  return res?.data || res || [];
}

/**
 * Ghi lịch sử đọc khi user mở 1 chương (upsert: ghi đè chapter mới nhất cùng truyện)
 * POST /api/users/:userid/history — body: { storyid, chapterid }
 */
export async function saveHistory(userid, { storyid, chapterid }) {
  await axiosConfig.post(`/users/${userid}/history`, { storyid, chapterid });
}

/**
 * Xóa 1 truyện khỏi lịch sử đọc
 * DELETE /api/users/:userid/history/:storyid
 * Trả về danh sách lịch sử đọc sau khi xóa
 */
export async function removeFromHistory(userid, storyid) {
  const res = await axiosConfig.delete(`/users/${userid}/history/${storyid}`);
  return res?.data || res || [];
}
