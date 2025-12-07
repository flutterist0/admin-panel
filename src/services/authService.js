import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Tokeni oxumaq üçün

const API_URL = "/api/Auth"; // Senin portun

// Axios interceptor: Hər sorğuya Tokeni əlavə edir
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const authService = {
    login: async (loginDto) => {
        // Backend: [HttpPost("admin/login")]
        const response = await axios.post(`${API_URL}/admin/login`, loginDto);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token); // Tokeni yaddaşa yazırıq
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    },

    getCurrentUser: () => {
        try {
            const token = localStorage.getItem("token");
            return token ? jwtDecode(token) : null;
        } catch (error) {
            return null;
        }
    }
};

export default authService;