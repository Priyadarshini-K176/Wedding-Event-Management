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
  api.post("/categories", { name });

/**
 * Add new item
 * payload = { title, plannedCost }
 */
export const addItem = ( payload) =>
  api.post("/item", payload);

/**
 * Update item (autosave)
 * payload = { title?, actualCost?, plannedCost? }
 */
export const updateItem = (itemId, payload) =>
  api.patch(`/item/${itemId}`, payload);

/**
 * Update category planned budget
 */
export const updateCategoryBudget = (categoryId, plannedBudget) =>
  api.patch(`/categories/${categoryId}/budget`, { plannedBudget });


