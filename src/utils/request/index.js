import Vue from "vue";
import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// 请求拦截
request.interceptors.request.use(
  (config) => {
    // 这里会携带前台的参数

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code !== 200) {
      const msg = res.message || "未知错误，请联系管理员查看";

      Vue.$toast.error(msg);

      console.error("[api]", msg);

      return Promise.reject(msg);
    }
    return res.data;
  },
  (error) => {
    const { response } = error;
    if (response && response.data) {
      return Promise.reject(error);
    } else {
      const { message } = error;
      console.error("[api]", message);
      return Promise.reject(error);
    }
  },
);

export default request;
