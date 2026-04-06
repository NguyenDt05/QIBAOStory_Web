// storyService.js
// Gọi API BE cho stories: CRUD truyện (Admin) và xem truyện (User)
// Bao gồm hàm normalize() để chuẩn hoá data về định dạng FE dùng

import axiosConfig from './axiosConfig';
import { STORY_STATUS } from '../constants/storyStatus';
import { formatDate } from '../utils/helpers';

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
    storyid: s.storyid || s.storyID,
    storyCount: s.storyCount ?? s.story_count ?? 0,
    coverUrl,
    cover: coverUrl,
    categories: Array.isArray(s.categories)
      ? s.categories
      : (typeof s.categories === 'string' ? JSON.parse(s.categories) : []),
    statusLabel: st.label,
    statusStyle: { bg: st.bg, color: st.color },
    updatedat: (s.updatedat && !s.updatedat.includes('0000-00-00') ? formatDate(s.updatedat) : null) || (s.updatedAt && !s.updatedAt.includes('0000-00-00') ? formatDate(s.updatedAt) : null) || (s.createdat ? formatDate(s.createdat) : '—'),
    createdat: s.createdat ? formatDate(s.createdat) : '—',
  };
};

/**
 * Lấy danh sách truyện (GET /stories — public, chỉ status=1)
 */
export async function getAllStories() {
  try {
    const res = await axiosConfig.get('/stories');
    const rawList = res?.data || res || [];
    const list = rawList.map(normalize);
    return list;
  } catch (error) {
    console.error('Lỗi getAllStories:', error);
    return [];
  }
}

/**
 * Tìm kiếm truyện tương đối theo từ khóa (GET /stories/search?q=...)
 * BE dùng LIKE '%q%' — case-insensitive, tìm trong title/author/description
 */
export async function searchStories(query) {
  try {
    const res = await axiosConfig.get('/stories/search', { params: { q: query } });
    const rawList = res?.data || res || [];
    return rawList.map(normalize);
  } catch (error) {
    console.error('Lỗi searchStories:', error);
    return [];
  }
}

/**
 * Lấy danh sách TẤT CẢ truyện cho Admin (GET /stories/admin/all)
 * (Kể cả status=0)
 */
export async function getAdminStories() {
  try {
    const res = await axiosConfig.get('/stories/admin/all');
    const rawList = res?.data || res || [];
    return rawList.map(normalize);
  } catch (error) {
    console.error('Lỗi getAdminStories:', error);
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
    const res = await axiosConfig.get(`/stories/${storyid}/detail`);
    const result = res?.data || res;
    return {
      story: normalize(result?.story || result),
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
    const res = await axiosConfig.get(`/stories/${storyid}`);
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
    const res = await axiosConfig.patch(`/stories/${storyid}/toggle`);
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
    return await getAdminStories();
  } catch (error) {
    console.error('Lỗi deleteStory:', error);
    throw error;
  }
}

/**
 * Tăng lượt xem truyện (POST /stories/:storyid/increment-view)
 * Chỉ gọi khi FE xác nhận đủ điều kiện (chống spam qua localStorage đã xử lý ở component)
 */
export async function incrementStoryView(storyid) {
  try {
    await axiosConfig.post(`/stories/${storyid}/increment-view`);
  } catch (error) {
    // Silent fail — lỗi view không nên block trải nghiệm đọc truyện của user
    console.warn('Không thể cộng lượt xem:', error?.message ?? error);
  }
}