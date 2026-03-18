// commentService.js
// Gọi API BE cho comments: Admin quản lý, User xem & gửi bình luận

import axiosConfig from './axiosConfig';

/**
 * Admin: Lấy tất cả bình luận kèm thông tin user và tên truyện
 * GET /api/comments — trả về { success, data: [...] }
 * Mỗi item: { commentid, storyid, content, status, created_at, username, tenhienthi, avatar, storyTitle }
 */
export async function getAllComments() {
  const res = await axiosConfig.get('/comments');
  return res?.data || res || [];
}

/**
 * Public: Lấy bình luận visible (status=1) theo truyện
 * GET /api/comments/story/:storyid
 * Mỗi item: { commentid, storyid, content, status, created_at, username, tenhienthi, avatar }
 */
export async function getCommentsByStory(storyid) {
  const res = await axiosConfig.get(`/comments/story/${storyid}`);
  return res?.data || res || [];
}

/**
 * User: Gửi bình luận mới (cần JWT trong header)
 * POST /api/comments — body: { storyid, content }
 * Sau khi submit, tự load lại danh sách mới nhất từ server
 */
export async function submitComment({ storyid, content }) {
  await axiosConfig.post('/comments', { storyid, content });
  return await getCommentsByStory(storyid);
}

/**
 * Admin: Toggle ẩn/hiện bình luận
 * PATCH /api/comments/:commentid/toggle — trả về { success, data: [...] }
 */
export async function toggleCommentVisibility(commentid) {
  const res = await axiosConfig.patch(`/comments/${commentid}/toggle`);
  return res?.data || res || [];
}

/**
 * Admin: Xóa bình luận
 * DELETE /api/comments/:commentid — trả về { success, data: [...] }
 */
export async function deleteComment(commentid) {
  const res = await axiosConfig.delete(`/comments/${commentid}`);
  return res?.data || res || [];
}

/**
 * User: Xóa bình luận của chính mình
 * DELETE /api/comments/my/:cmtid
 */
export async function deleteMyComment(cmtid) {
  await axiosConfig.delete(`/comments/my/${cmtid}`);
}
