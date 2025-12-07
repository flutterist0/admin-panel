import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/api/Auth`;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const authService = {
    login: async (loginDto) => {
        const response = await axios.post(`${API_URL}/admin/login`, loginDto);
        
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
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
        } catch {
            return null;
        }
    }
};

export default authService;
