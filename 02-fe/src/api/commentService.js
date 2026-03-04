import { delay } from './http';
import { COMMENTS_MOCK } from '../constants/mockData';
import { getAllUsers } from './userService';

let _db = COMMENTS_MOCK.map(c => ({ ...c }));

export async function getAllComments() {
  await delay();
  return _db.map(c => ({ ...c }));
}

export async function getCommentsByStory(storyid) {
  await delay(200);
  const users = await getAllUsers();
  const activeUsernames = new Set(users.filter(u => u.status === 1).map(u => u.username));
  return _db
    .filter(c => c.storyid === storyid && c.visible && activeUsernames.has(c.username))
    .map(c => ({ ...c }));
}

export async function submitComment({ storyid, username, tenhienthi, avatar, content }) {
  await delay(300);
  const newComment = {
    cmtid: 'CM' + Date.now(),
    content,
    username,
    tenhienthi,
    avatar: avatar ?? null,
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
