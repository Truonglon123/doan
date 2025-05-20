import axios from 'axios';
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:81/wordpress/wp-json/';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Thêm token mặc định vào mọi request
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token'); // Lấy từ cookie hoặc localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý lỗi phản hồi
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Token hết hạn hoặc không hợp lệ
            if (error.response.status === 401) {
                console.error("Unauthorized, logging out...");
                Cookies.remove('token');
                localStorage.removeItem('token');
                window.location.href = '/login'; // Redirect về trang login
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
