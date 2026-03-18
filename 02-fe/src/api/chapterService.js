// chapterService.js
// Gọi API BE cho chapter: CRUD chương, lấy chi tiết chương kèm prev/next

import axiosConfig from './axiosConfig';

/**
 * Lấy danh sách chương của một truyện (GET /stories/:storyid/chapters)
 * Trả về mảng chapter: { chapterid, storyid, chaptername, status, createdat }
 */
export async function getChaptersByStory(storyid) {
  const res = await axiosConfig.get(`/stories/${storyid}/chapters`);
  return res?.data || res || [];
}

/**
 * Lấy chi tiết 1 chương kèm prev/next (GET /stories/:storyid/chapters/:chapterid)
 * Hỗ trợ chapterid = 'first' | 'last' | số
 * Trả về: { chapter, prevChapter, nextChapter, storyTitle, storyCover, storyid, totalChapters, chapterIndex }
 */
export async function getChapterDetail(storyid, chapterid) {
  // Bước 1: Lấy toàn bộ danh sách chương để tính prev/next và resolve 'first'/'last'
  const [listRes, storyRes] = await Promise.all([
    axiosConfig.get(`/stories/${storyid}/chapters`),
    axiosConfig.get(`/stories/${storyid}`),
  ]);

  // Bỏ filter status !== 0 ở FE vì Admin cần thấy chương ẩn.
  // Việc ẩn chương đối với User bình thường sẽ do Backend xử lý ở API getDetailForUser
  const list  = listRes?.data || listRes || [];
  const story = storyRes?.data || storyRes || {};

  // Bước 2: Resolve chapterid
  let idx;
  if (chapterid === 'first') {
    idx = 0;
  } else if (chapterid === 'last') {
    idx = list.length - 1;
  } else {
    idx = list.findIndex(c => String(c.chapterid) === String(chapterid));
    if (idx === -1) idx = 0;
  }

  const targetChapter = list[idx];
  if (!targetChapter) {
    return null;
  }

  // Bước 3: Lấy nội dung đầy đủ chương (có field content)
  const detailRes = await axiosConfig.get(`/stories/${storyid}/chapters/${targetChapter.chapterid}`);
  const chapter   = detailRes?.data || detailRes || targetChapter;

  return {
    chapter,
    prevChapter:   idx > 0               ? list[idx - 1] : null,
    nextChapter:   idx < list.length - 1 ? list[idx + 1] : null,
    storyTitle:    story.title  ?? '',
    storyCover:    story.image  ?? null,
    storyid,
    totalChapters: list.length,
    chapterIndex:  idx,
  };
}

/**
 * Ẩn/hiện chương (PATCH /stories/:storyid/chapters/:chapterid/toggle)
 * Trả về danh sách chương mới sau khi toggle
 */
export async function toggleChapterVisibility(storyid, chapterid) {
  const res = await axiosConfig.patch(`/stories/${storyid}/chapters/${chapterid}/toggle`);
  return res?.data || res || [];
}

/**
 * Xóa chương (DELETE /stories/:storyid/chapters/:chapterid)
 * Sau khi xóa, gọi lại getByStory để cập nhật danh sách
 */
export async function deleteChapter(storyid, chapterid) {
  await axiosConfig.delete(`/stories/${storyid}/chapters/${chapterid}`);
  return await getChaptersByStory(storyid);
}

/**
 * Cập nhật chương (PUT /stories/:storyid/chapters/:chapterid)
 */
export async function updateChapter(storyid, chapterid, data) {
  const res = await axiosConfig.put(`/stories/${storyid}/chapters/${chapterid}`, data);
  return res?.data || res;
}
