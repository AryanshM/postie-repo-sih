import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useNavigateToLogin } from "@/components/NavigateToLogin";

const api = axios.create({
  baseURL: "https://post.rootski.live",
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            "https://post.rootski.live/employee/access_byrefresh/",
            { refresh: refreshToken },
          );
          const newAccessToken = refreshResponse.data.access;
          await SecureStore.setItemAsync("accessToken", newAccessToken);

          // Retry original request with new token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios.request(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          useNavigateToLogin();
        }
      } else {
        console.error("Refresh token missing");
        useNavigateToLogin();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
