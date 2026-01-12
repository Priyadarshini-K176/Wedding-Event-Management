import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginApi = (email, password) =>
  API.post("/login", { email, password });

export const registerApi = (name, email, password, weddingName) =>
  API.post("/register", { name, email, password, weddingName });
