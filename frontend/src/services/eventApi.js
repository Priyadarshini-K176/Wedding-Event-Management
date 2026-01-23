import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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

export const fetchEventsApi = () => API.get("/events");
export const createEventApi = (data) => API.post("/events", data);
export const updateEventApi = (id, data) => API.put(`/events/${id}`, data);
export const deleteEventApi = (id) => API.delete(`/events/${id}`);
