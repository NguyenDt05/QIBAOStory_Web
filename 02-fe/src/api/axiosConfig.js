import axios from 'axios';

const axiosConfig = axios.create({
  
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },

});

// 2. Cấu hình Request Interceptor (Can thiệp trước khi gửi request lên BE)
axiosConfig.interceptors.request.use(
  (config) => {
    // Nếu bạn lưu token đăng nhập trong localStorage, hãy lấy ra và gắn vào header
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý khi có lỗi cấu hình request
    return Promise.reject(error);
  }
);

// 3. Cấu hình Response Interceptor (Can thiệp trước khi trả data về cho Component)
axiosConfig.interceptors.response.use(
  (response) => {
    // Trả về thẳng dữ liệu (data) bên trong response
    // Giúp code ở phần Service ngắn gọn hơn, không cần phải gọi response.data.data nữa
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi chung cho toàn bộ dự án
    // Ví dụ: Bắt mã 401 (Hết hạn token) để ép người dùng đăng nhập lại
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        // window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
      }
      
      // Có thể log lỗi ra hoặc quăng lỗi kèm message từ Backend
      console.error('API Error:', error.response.data.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;