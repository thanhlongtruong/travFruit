import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 1000 * 60 * 5,
});

instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;

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
