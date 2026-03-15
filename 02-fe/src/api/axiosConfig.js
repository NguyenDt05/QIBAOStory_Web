import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Can thiệp trước khi gửi request: Tự động đính kèm Token "xịn"
axiosConfig.interceptors.request.use(
  (config) => {
    // Đổi từ accessToken -> token cho khớp với file login của bạn
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Can thiệp Response: Giúp bạn gọi API ở Service chỉ cần trả về data luôn
axiosConfig.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data; // Trả về { success: true, data: ... }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Phiên đăng nhập hết hạn. Đang đăng xuất...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // window.location.href = '/login'; 
      }
      console.error('Lỗi API:', error.response.data.message || error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;