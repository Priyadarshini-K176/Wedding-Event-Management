import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/guests",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchGuestsApi = () => API.get("/");
export const addGuestApi = (guest) => API.post("/", guest);
export const updateGuestRsvpApi = (id, rsvp) => API.patch(`/${id}/rsvp`, { rsvp });