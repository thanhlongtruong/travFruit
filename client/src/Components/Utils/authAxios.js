import axios from "axios";
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
  // baseURL: process.env.REACT_APP_BACKEND_URL,
  baseURL: "https://travfruitv3-server.vercel.app",
  // baseURL: "http://localhost:4001",
  timeout: 1000 * 60 * 5,
});

const EXCLUDED_ENDPOINTS = ["/user/login", "/user/register", "/user/logout"];

instance.interceptors.request.use(
  function (config) {
    if (EXCLUDED_ENDPOINTS.some((endpoint) => config.url.includes(endpoint))) {
      return config;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      // Kiểm tra token đã hết hạn chưa
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("payment");
        window.location.href = "/";
        return;
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("payment");
      localStorage.removeItem("user");
    }
    config.headers["Cache-Control"] = "no-cache";
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
