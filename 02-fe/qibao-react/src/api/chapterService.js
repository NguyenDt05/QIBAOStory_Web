import { delay } from './http';
import { CHAPTERS_MOCK, CHAPTER_CONTENT_MOCK, STORIES_MOCK } from '../constants/mockData';

export async function getChaptersByStory(storyid) {
  await delay();
  return CHAPTERS_MOCK();
}

export async function getChapterDetail(storyid, chapterid) {
  await delay(200);
  const list = CHAPTERS_MOCK();

  let idx;
  if (chapterid === 'first') {
    idx = 0;
  } else if (chapterid === 'last') {
    idx = list.length - 1;
  } else {
    idx = list.findIndex(c => String(c.chapterid) === String(chapterid));
    if (idx === -1) idx = 0;
  }

  const chapter = {
    ...list[idx],
    content: CHAPTER_CONTENT_MOCK,
    author: 'Đồng Uyên',
    createdat: '2019-09-15 23:09:48',
  };

  return {
    chapter,
    prevChapter: idx > 0 ? list[idx - 1] : null,
    nextChapter: idx < list.length - 1 ? list[idx + 1] : null,
    storyTitle: 'Đánh Dấu Thành Thành: Phát Hiện Lão Bà Càng Là Ma Đạo Nữ Đế',
    storyCover: STORIES_MOCK.find(s => String(s.storyid) === String(storyid))?.cover ?? null,
    storyid,
    totalChapters: list.length,
    chapterIndex: idx,
  };
}

export async function toggleChapterVisibility(storyid, chapterid, currentList) {
  await delay(150);
  return currentList.map(c => c.chapterid === chapterid ? { ...c, status: c.status ? 0 : 1 } : c);
}

export async function deleteChapter(storyid, chapterid, currentList) {
  await delay(150);
  return currentList.filter(c => c.chapterid !== chapterid);
}
