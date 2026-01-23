import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/budget",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getOverview = () => api.get("/overview");

export const addCategory = (name) =>
  api.post("/category", { name });

/**
 * Add new item
 * payload = { categoryId, title, plannedCost }
 */
export const addItem = (payload) =>
  api.post("/item", payload);

/**
 * Update item (autosave)
 * payload = { title?, actualCost?, plannedCost? }
 */
export const updateItem = (itemId, payload) =>
  api.patch(`/item/${itemId}`, payload);

/**
 * Delete item
 */
export const deleteItem = (itemId) =>
  api.delete(`/item/${itemId}`);

/**
 * Update category planned budget
 */
export const updateCategoryBudget = (categoryId, plannedBudget) =>
  api.patch(`/category/${categoryId}`, { plannedBudget });

/**
 * Delete category
 */
export const deleteCategory = (categoryId) =>
  api.delete(`/category/${categoryId}`);


