import axiosConfig from './axiosConfig';
import { STORY_STATUS } from '../constants/storyStatus';

const API_BASE = "http://localhost:8080";

/**
 * 1. HÀM CHUẨN HÓA DỮ LIỆU (Normalize)
 */
const normalize = (s) => {
  if (!s) return null;
  if (s.statusStyle && s.categories && Array.isArray(s.categories)) return s;

  const st = STORY_STATUS[s.trangthai_rachuong] ?? STORY_STATUS.dangra;
  
  // Xử lý URL ảnh bìa
  const coverUrl = s.image 
    ? (s.image.startsWith('http') ? s.image : `${API_BASE}/${s.image}`) 
    : null;

  return {
    ...s,
    storyid: s.storyid || s.storyID,
    storyCount: s.storyCount ?? s.story_count ?? 0,
    coverUrl: coverUrl,
    categories: Array.isArray(s.categories) 
      ? s.categories 
      : (typeof s.categories === 'string' ? JSON.parse(s.categories) : []),
    statusLabel: st.label,
    statusStyle: { bg: st.bg, color: st.color },
    updatedat: s.updatedat || s.updatedAt || '—',
  };
};

/**
 * 2. LẤY TOÀN BỘ TRUYỆN (ADMIN/USER)
 */
export async function getAllStories({ visibleOnly = false } = {}) {
  try {
    const res = await axiosConfig.get('/stories');
    const rawList = res.data?.data || res.data || [];
    const list = rawList.map(normalize);
    return visibleOnly ? list.filter(s => s.status === 1) : list;
  } catch (error) {
    console.error("Lỗi getAllStories:", error);
    return [];
  }
}

/**
 * 3. CHI TIẾT TRUYỆN (DÀNH CHO NGƯỜI ĐỌC - USER VIEW)
 * Hàm này dùng ở StoryDetail.jsx
 */
export async function getStoryDetail(storyid) {
  try {
    const res = await axiosConfig.get(`/stories/${storyid}/detail`);
    const result = res.data?.data || res.data;
    // Backend trả về story + chapters
    return {
      story: normalize(result),
      chapters: result.chapters || []
    };
  } catch (error) {
    console.error("Lỗi getStoryDetail:", error);
    return { story: null, chapters: [] };
  }
}

/**
 * 4. LẤY 1 TRUYỆN THEO ID (DÀNH CHO TRANG EDIT)
 */
export async function getStoryById(storyid) {
  try {
    const res = await axiosConfig.get(`/stories/${storyid}`);
    const data = res.data?.data || res.data;
    return normalize(data);
  } catch (error) {
    console.error("Lỗi getStoryById:", error);
    return null;
  }
}

/**
 * 5. THÊM TRUYỆN MỚI
 */
export async function addStory(formData) {
  try {
    const res = await axiosConfig.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res;
  } catch (error) {
    console.error("Lỗi addStory:", error);
    throw error;
  }
}

/**
 * 6. CẬP NHẬT TRUYỆN
 */
export async function updateStory(storyid, formData) {
  try {
    const res = await axiosConfig.put(`/stories/${storyid}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res;
  } catch (error) {
    console.error("Lỗi updateStory:", error);
    throw error;
  }
}

/**
/**
 * 7. ẨN/HIỆN TRUYỆN nhanh
 */
export async function toggleStoryVisibility(storyid) {
  try {
    const res = await axiosConfig.patch(`/stories/${storyid}/toggle`);  
    const rawList = Array.isArray(res) ? res : (res?.data || []);
    return rawList.map(normalize);
  } catch (error) {
    console.error("Lỗi toggleStoryVisibility:", error);
    throw error;
  }
}
/**
 * 8. XÓA TRUYỆN
 */
export async function deleteStory(storyid) {
  try {
    await axiosConfig.delete(`/stories/${storyid}`);
    // Sau khi xóa, lấy lại danh sách mới để cập nhật UI
    return await getAllStories();
  } catch (error) {
    console.error("Lỗi deleteStory:", error);
    throw error;
  }
}