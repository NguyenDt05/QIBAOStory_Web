// storyService.js
// Gọi API BE cho stories: CRUD truyện (Admin) và xem truyện (User)
// Bao gồm hàm normalize() để chuẩn hoá data về định dạng FE dùng

import axiosConfig from './axiosConfig';
import { STORY_STATUS } from '../constants/storyStatus';

const API_BASE = 'http://localhost:8080';

/** Chuẩn hoá 1 story object từ BE về định dạng mà FE dùng chung */
const normalize = (s) => {
  if (!s) return null;
  if (s.statusStyle && s.categories && Array.isArray(s.categories)) return s;

  const st = STORY_STATUS[s.trangthai_rachuong] ?? STORY_STATUS.dangra;

  const coverUrl = s.image
    ? (s.image.startsWith('http') ? s.image : `${API_BASE}/${s.image}`)
    : null;

  return {
    ...s,
    storyid:    s.storyid || s.storyID,
    storyCount: s.storyCount ?? s.story_count ?? 0,
    coverUrl,
    cover: coverUrl,
    categories: Array.isArray(s.categories)
      ? s.categories
      : (typeof s.categories === 'string' ? JSON.parse(s.categories) : []),
    statusLabel: st.label,
    statusStyle: { bg: st.bg, color: st.color },
    updatedat:   s.updatedat || s.updatedAt || '—',
    createdat:   s.createdat ? new Date(s.createdat).toLocaleDateString('vi-VN') : '—',
  };
};

/**
 * Lấy danh sách truyện (GET /stories — public, chỉ status=1)
 * visibleOnly: filter thêm ở FE nếu cần (BE đã lọc status=1 rồi)
 */
export async function getAllStories({ visibleOnly = false } = {}) {
  try {
    const res     = await axiosConfig.get('/stories');
    const rawList = res?.data || res || [];
    const list    = rawList.map(normalize);
    return visibleOnly ? list.filter(s => s.status === 1) : list;
  } catch (error) {
    console.error('Lỗi getAllStories:', error);
    return [];
  }
}

/**
 * Lấy chi tiết truyện kèm danh sách chương (GET /stories/:storyid/detail)
 * Dùng cho trang StoryDetail của User
 * Trả về: { story, chapters }
 */
export async function getStoryDetail(storyid) {
  try {
    const res    = await axiosConfig.get(`/stories/${storyid}/detail`);
    const result = res?.data || res;
    return {
      story:    normalize(result?.story || result),
      chapters: result?.chapters || [],
    };
  } catch (error) {
    console.error('Lỗi getStoryDetail:', error);
    return { story: null, chapters: [] };
  }
}

/**
 * Lấy thông tin 1 truyện theo ID (GET /stories/:storyid)
 * Dùng cho trang Edit truyện của Admin (đổ vào form)
 */
export async function getStoryById(storyid) {
  try {
    const res  = await axiosConfig.get(`/stories/${storyid}`);
    const data = res?.data || res;
    return normalize(data);
  } catch (error) {
    console.error('Lỗi getStoryById:', error);
    return null;
  }
}

/**
 * Tạo truyện mới (POST /stories)
 * formData: FormData (có thể kèm file ảnh)
 */
export async function addStory(formData) {
  const res = await axiosConfig.post('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res;
}

/**
 * Cập nhật truyện (PUT /stories/:storyid)
 * formData: FormData (có thể kèm file ảnh mới)
 */
export async function updateStory(storyid, formData) {
  const res = await axiosConfig.put(`/stories/${storyid}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res;
}

/**
 * Ẩn/hiện truyện nhanh (PATCH /stories/:storyid/toggle)
 * Trả về danh sách truyện mới sau khi toggle
 */
export async function toggleStoryVisibility(storyid) {
  try {
    const res     = await axiosConfig.patch(`/stories/${storyid}/toggle`);
    const rawList = Array.isArray(res) ? res : (res?.data || []);
    return rawList.map(normalize);
  } catch (error) {
    console.error('Lỗi toggleStoryVisibility:', error);
    throw error;
  }
}

/**
 * Xóa truyện (DELETE /stories/:storyid)
 * Sau khi xóa, tự động lấy lại danh sách mới
 */
export async function deleteStory(storyid) {
  try {
    await axiosConfig.delete(`/stories/${storyid}`);
    return await getAllStories();
  } catch (error) {
    console.error('Lỗi deleteStory:', error);
    throw error;
  }
}