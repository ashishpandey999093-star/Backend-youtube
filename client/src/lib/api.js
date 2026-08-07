import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true
});

export const api = {
  register(formData) {
    return apiClient.post("/users/register", formData);
  },
  login(payload) {
    return apiClient.post("/users/login", payload);
  },
  logout() {
    return apiClient.post("/users/logout");
  },
  getCurrentUser() {
    return apiClient.get("/users/current-user");
  },
  getVideos(search = "") {
    const query = search ? `?query=${encodeURIComponent(search)}` : "";
    return apiClient.get(`/videos${query}`);
  },
  getVideoById(videoId) {
    return apiClient.get(`/videos/getVideo/${videoId}`);
  }
};