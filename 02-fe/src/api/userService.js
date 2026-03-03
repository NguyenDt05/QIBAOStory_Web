import { delay } from './http';
import { USERS_MOCK } from '../constants/mockData';

let _db = USERS_MOCK.map(u => ({ ...u }));

export async function getAllUsers() {
  await delay();
  return _db.map(u => ({ ...u }));
}

export async function toggleUserStatus(userid) {
  await delay(150);
  _db = _db.map(u => u.userid === userid ? { ...u, status: u.status ? 0 : 1 } : u);
  return _db.map(u => ({ ...u }));
}

export async function deleteUser(userid) {
  await delay(150);
  _db = _db.filter(u => u.userid !== userid);
  return _db.map(u => ({ ...u }));
}
