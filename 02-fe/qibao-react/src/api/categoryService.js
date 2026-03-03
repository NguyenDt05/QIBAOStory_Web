import { delay } from './http';
import { CATEGORIES_LIST } from '../constants/categories';

let _db = CATEGORIES_LIST.map((c, i) => ({
  categoryID: c.categoryID,
  categoryname: c.categoryname,
  slug: c.slug,
  storyCount: [45, 28, 62, 37, 19, 53, 14, 31, 22, 16][i] ?? 0,
  status: 1,
}));

export async function getAllCategories() {
  await delay();
  return _db.map(c => ({ ...c }));
}

export async function addCategory({ categoryname, status }) {
  await delay();
  const newCategory = {
    categoryID: Date.now(),
    categoryname,
    slug: categoryname.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    storyCount: 0,
    status: status ? 1 : 0,
  };
  _db = [..._db, newCategory];
  return _db.map(c => ({ ...c }));
}

export async function updateCategory(categoryID, { categoryname, status }) {
  await delay();
  _db = _db.map(c => c.categoryID === categoryID ? { ...c, categoryname, status: status ? 1 : 0 } : c);
  return _db.map(c => ({ ...c }));
}

export async function toggleCategoryStatus(categoryID) {
  await delay();
  _db = _db.map(c => c.categoryID === categoryID ? { ...c, status: c.status ? 0 : 1 } : c);
  return _db.map(c => ({ ...c }));
}

export async function deleteCategory(categoryID) {
  await delay();
  _db = _db.filter(c => c.categoryID !== categoryID);
  return _db.map(c => ({ ...c }));
}
