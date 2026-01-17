import { apiClient } from "./client";

export const authApi = {
  register: async (email: string, password: string) => {
    return apiClient.fetch("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string) => {
    const data = await apiClient.fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // 로그인 성공 시 토큰 저장
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};
