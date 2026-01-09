import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchEventsApi = () => API.get("/events");
export const createEventApi = (data) => API.post("/events", data);
export const deleteEventApi = (id) => API.delete(`/events/${id}`);
