import { delay } from './http';
import { COMMENTS_MOCK } from '../constants/mockData';

let _db = COMMENTS_MOCK.map(c => ({ ...c }));

export async function getAllComments() {
  await delay();
  return _db.map(c => ({ ...c }));
}

export async function getCommentsByStory(storyid) {
  await delay(200);
  return _db
    .filter(c => c.storyid === storyid && c.visible)
    .map(c => ({ ...c }));
}

export async function submitComment({ storyid, username, tenhienthi, content }) {
  await delay(300);
  const newComment = {
    cmtid: 'CM' + Date.now(),
    content,
    username,
    tenhienthi,
    storyTitle: '',
    storyid,
    createdat: new Date().toLocaleString('vi-VN'),
    visible: true,
  };
  _db = [newComment, ..._db];
  return _db
    .filter(c => c.storyid === storyid && c.visible)
    .map(c => ({ ...c }));
}

export async function toggleCommentVisibility(cmtid) {
  await delay(150);
  _db = _db.map(c => c.cmtid === cmtid ? { ...c, visible: !c.visible } : c);
  return _db.map(c => ({ ...c }));
}

export async function deleteComment(cmtid) {
  await delay(150);
  _db = _db.filter(c => c.cmtid !== cmtid);
  return _db.map(c => ({ ...c }));
}
