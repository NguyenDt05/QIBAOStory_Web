import { delay } from './http';
import { CATEGORIES_LIST } from '../constants/categories';

let _db = CATEGORIES_LIST.map((c, i) => ({
  categoryID: c.categoryID,
  categoryname: c.categoryname,
  slug: c.slug,
  storyCount: [45, 28, 62, 37, 19, 53, 14, 31, 22, 16][i] ?? 0,
  visible: true,
}));

export async function getAllCategories() {
  await delay();
  return _db.map(c => ({ ...c }));
}

export async function addCategory({ categoryname, visible }) {
  await delay();
  const newCategory = {
    categoryID: Date.now(),
    categoryname,
    slug: categoryname.toLowerCase().replace(/\s+/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    storyCount: 0,
    visible: visible !== false,
  };
  _db = [..._db, newCategory];
  return newCategory;
}

export async function updateCategory(categoryID, { categoryname, visible }) {
  await delay();
  _db = _db.map(c => c.categoryID === categoryID ? { ...c, categoryname, visible: visible !== false } : c);
  return _db.find(c => c.categoryID === categoryID);
}

export async function toggleCategoryStatus(categoryID) {
  await delay();
  _db = _db.map(c => c.categoryID === categoryID ? { ...c, visible: !c.visible } : c);
  return _db.map(c => ({ ...c }));
}

export async function deleteCategory(categoryID) {
  await delay();
  _db = _db.filter(c => c.categoryID !== categoryID);
  return _db.map(c => ({ ...c }));
}
