import axiosConfig from './axiosConfig';
import { STORY_STATUS } from '../constants/storyStatus';

/**
 * 1. HÀM CHUẨN HÓA DỮ LIỆU (Normalize)
 * Chuyển đổi dữ liệu từ DB (SQL) sang định dạng Frontend mong muốn.
 */
const normalize = (s) => {
  if (!s) return null;
  // Tránh normalize lại nếu dữ liệu đã chuẩn
  if (s.statusStyle && s.categories && Array.isArray(s.categories)) return s;

  // Lấy cấu hình màu sắc/label từ constants dựa trên trạng thái ra chương
  const st = STORY_STATUS[s.trangthai_rachuong] ?? STORY_STATUS.dangra;

  return {
    ...s,
    // Ưu tiên các biến từ SQL trả về (ví dụ storyid hoặc storyID)
    storyid: s.storyid || s.storyID,
    
    // Xử lý số chương: DB mới có storyCount, nếu null thì để 0
    storyCount: s.storyCount ?? s.story_count ?? 0,

    // Xử lý Thể loại: DB trả về mảng qua JSON_ARRAYAGG. Nếu null thì để mảng rỗng.
    // Nếu Backend trả về chuỗi JSON (tùy driver SQL), ta cần parse nó.
    categories: typeof s.categories === 'string' 
      ? JSON.parse(s.categories) 
      : (Array.isArray(s.categories) ? s.categories : []),

    // Format ngày tháng cập nhật
    updatedat: s.updatedat || s.updatedAt || '—',
    
    // Gắn label và style để UI render Badge trạng thái nhanh
    statusLabel: st.label,
    statusStyle: { 
      bg: st.bg || st.bgColor, 
      color: st.color || st.textColor 
    },
  };
};

/**
 * 2. LẤY TOÀN BỘ TRUYỆN
 */
export async function getAllStories({ visibleOnly = false } = {}) {
  try {
    const res = await axiosConfig.get('/stories');
    let list = Array.isArray(res) ? res : (res.data || []);
    
    list = list.map(normalize);

    return visibleOnly ? list.filter(s => s.status === 1) : list;
  } catch (error) {
    console.error("Lỗi getAllStories:", error);
    return [];
  }
}

/**
 * 3. ẨN/HIỆN TRUYỆN (PATCH)
 */
export async function toggleStoryVisibility(storyid) {
  try {
    // Backend trả về getAll() sau khi update
    const res = await axiosConfig.patch(`/stories/${storyid}/toggle`);
    const list = Array.isArray(res) ? res : (res.data || []);
    return list.map(normalize);
  } catch (error) {
    console.error("Lỗi toggleStoryVisibility:", error);
    throw error;
  }
}

/**
 * 4. XÓA TRUYỆN (DELETE)
 */
export async function deleteStory(storyid) {
  try {
    const res = await axiosConfig.delete(`/stories/${storyid}`);
    const list = Array.isArray(res) ? res : (res.data || []);
    return list.map(normalize);
  } catch (error) {
    console.error("Lỗi deleteStory:", error);
    throw error;
  }
}

/**
 * 5. CHI TIẾT TRUYỆN (USER VIEW)
 */
export async function getStoryDetail(storyid) {
  try {
    const res = await axiosConfig.get(`/stories/${storyid}/detail`);
    const data = res.data || res;
    return {
      story: normalize(data.story),
      chapters: data.chapters || []
    };
  } catch (error) {
    console.error("Lỗi getStoryDetail:", error);
    return { story: null, chapters: [] };
  }
}

// /**
//  * 6. TRUYỆN LIÊN QUAN
//  */
// export async function getRelatedStories(storyid) {
//   try {
//     const list = await getAllStories({ visibleOnly: true });
//     const others = list.filter(s => String(s.storyid) !== String(storyid));
//     return others.slice(0, 6).map(s => ({
//       ...s,
//       categoryname: s.categories?.[0]?.categoryname || '',
//     }));
//   } catch (error) {
//     return [];
//   }
// }

/**
 * 7. LẤY 1 TRUYỆN (EDIT)
 */
export async function getStoryById(storyid) {
  try {
    const res = await axiosConfig.get(`/stories/${storyid}`);
    return normalize(res.data || res);
  } catch (error) {
    console.error("Lỗi getStoryById:", error);
    return null;
  }
}

/**
 * 8. THÊM TRUYỆN MỚI
 * Gửi payload gồm thông tin truyện + mảng ID thể loại (categoryIDs)
 */
export async function addStory(data) {
  try {
    const res = await axiosConfig.post('/stories', data);
    return res.data || res;
  } catch (error) {
    console.error("Lỗi addStory:", error);
    throw error;
  }
}