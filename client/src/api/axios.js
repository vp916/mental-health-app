import axios from "axios";

// Use this everywhere instead of plain axios:
//   import api from "../api/axios";
//   const { data } = await api.get("/mood");
const api = axios.create({ baseURL: "/api" });

// Attach the login token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns an axios error into a message you can show to the user.
export function errorMessage(err) {
  return err.response?.data?.message || "Couldn't reach the server. Check that it's running.";
}

export default api;
