import { delay } from './http';
import { STORIES_MOCK, CHAPTERS_MOCK } from '../constants/mockData';
import { STORY_STATUS } from '../constants/storyStatus';

const normalize = (s) => {
  if (s.statusStyle) return s;
  const st = STORY_STATUS[s.trangthai_rachuong] ?? STORY_STATUS.dangra;
  return {
    ...s,
    categories: s.categories ?? s.genres ?? [],
    updatedat: s.updatedAt ?? s.updatedat ?? '—',
    statusLabel: st.label,
    statusStyle: { bg: st.bgColor, color: st.textColor },
  };
};

let _db = STORIES_MOCK.map(normalize);

export async function getAllStories({ visibleOnly = false } = {}) {
  await delay();
  const list = visibleOnly ? _db.filter(s => s.status === 1) : _db;
  return list.map(s => ({ ...s }));
}

export async function toggleStoryVisibility(storyid) {
  await delay(150);
  _db = _db.map(s => s.storyid === storyid ? { ...s, status: s.status ? 0 : 1 } : s);
  return _db.map(s => ({ ...s }));
}

export async function deleteStory(storyid) {
  await delay(150);
  _db = _db.filter(s => s.storyid !== storyid);
  return _db.map(s => ({ ...s }));
}

export async function getStoryDetail(storyid) {
  await delay();
  const story = _db.find(s => String(s.storyid) === String(storyid)) ?? _db[0];
  const chapters = CHAPTERS_MOCK();
  return { story, chapters };
}

export async function getStoryById(storyid) {
  await delay(100);
  return _db.find(s => String(s.storyid) === String(storyid)) ?? null;
}

export async function getRelatedStories(storyid) {
  await delay();
  // Lấy từ _db (STORIES_MOCK đã normalize), loại trừ truyện đang xem, lấy 6 cái
  const others = _db.filter(s => String(s.storyid) !== String(storyid));
  return others.slice(0, 6).map(s => ({
    ...s,
    categoryname: s.categories?.[0]?.categoryname ?? s.genres?.[0]?.categoryname ?? '',
    chapters: (typeof s.chapters === 'string' && !s.chapters.includes('chương'))
      ? s.chapters + ' chương'
      : s.chapters,
  }));
}
