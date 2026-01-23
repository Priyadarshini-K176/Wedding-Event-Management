import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/notes",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotesApi = () => API.get("/");
export const createNoteApi = (data) => API.post("/", data);
export const updateNoteApi = (id, data) => API.put(`/${id}`, data);
export const deleteNoteApi = (id) => API.delete(`/${id}`);
