const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    ...options
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      payload?.message || payload?.error || "Request failed. Please try again.";
    throw new Error(message);
  }

  return payload;
}

export const api = {
  getVideos(search = "") {
    const query = search ? `?query=${encodeURIComponent(search)}` : "";
    return request(`/videos${query}`);
  },
  getVideoById(videoId) {
    return request(`/videos/getVideo/${videoId}`);
  },
  login(payload) {
    return request("/users/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  register(formData) {
    return request("/users/register", {
      method: "POST",
      body: formData
    });
  },
  uploadVideo(formData) {
    return request("/videos", {
      method: "POST",
      body: formData
    });
  },
  togglePublishStatus(videoId) {
    return request(`/videos/changeisPublish/${videoId}`, {
      method: "POST"
    });
  },
  getCurrentUser() {
    return request("/users/current-user");
  },
  logout() {
    return request("/users/logout", {
      method: "POST"
    });
  },
  getChannel(username) {
    return request(`/users/c/${username}`);
  },
  toggleVideoLike(videoId) {
    return request(`/likes/v/${videoId}`, {
      method: "POST"
    });
  },
  getComments(videoId, { page = 1, limit = 10 } = {}) {
    return request(`/comments/v/${videoId}?page=${page}&limit=${limit}`);
  },
  addComment(videoId, content) {
    return request(`/comments/v/${videoId}`, {
      method: "POST",
      body: JSON.stringify({ content })
    });
  }
};
