import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (formData) =>
  api.post("/api/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginUser = (email, password) =>
  api.post("/api/auth/login", { email, password });

export const updateProfile = (formData) =>
  api.put("/api/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePassword = (current, next) =>
  api.put("/api/auth/password", { current_password: current, new_password: next });

// ── Predictions ───────────────────────────────────────────────────────────────
export const predictBloodGroup = (imageFile) => {
  const fd = new FormData();
  fd.append("image", imageFile);

  const token = localStorage.getItem("token");  // 🔑 get token

  return api.post("/api/predict", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`,   // ✅ ADD THIS
    },
  });
};

export const getHistory = () => api.get("/api/history");

export default api;
