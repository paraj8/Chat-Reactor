import axios from "axios";
import { API_URL } from "../utils/config";
import { getToken } from "../utils/storage";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  console.log("➡️ URL:", config.baseURL + config.url);
  console.log("➡️ TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ AXIOS ERROR");
    console.log("Message:", error.message);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;