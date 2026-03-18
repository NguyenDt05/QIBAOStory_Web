// gui yc den BE cung cap cac API lien quan den Category, 
// de ManageCategories.jsx goi de thao tac voi Category
import axiosConfig from './axiosConfig';

export async function getAllCategories(all = false) {
  const url = all ? '/categories?all=true' : '/categories';
  const response = await axiosConfig.get(url);
  return response;
}

export async function addCategory(categoryData) {
  const response = await axiosConfig.post('/categories', categoryData);
  return response;
}

export async function updateCategory(categoryID, categoryData) {
  const response = await axiosConfig.put(`/categories/${categoryID}`, categoryData);
  return response;
}

export async function deleteCategory(categoryID) {
  const response = await axiosConfig.delete(`/categories/${categoryID}`);
  return response;
}

export async function toggleCategoryStatus(categoryID) {
  const response = await axiosConfig.patch(`/categories/${categoryID}/toggle`);
  return response;
}

