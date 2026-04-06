import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Đính kèm token vào mọi request nếu đã đăng nhập
axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap response.data và xử lý lỗi 401
axiosConfig.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('qibao_user');
      }
      console.error('Lỗi API:', error.response.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;