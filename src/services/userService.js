import axios from 'axios';

// Backend Controller adını yoxla: AuthController-dirsə "api/Auth", UsersController-dirsə "api/Users" yaz.
const API_URL = `${import.meta.env.VITE_API_URL}/api/Auth`;
// const API_URL = "/api/Auth"; // Portu özünə uyğun yoxla

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const userService = {
    getAllUsers: async () => {
        try {
            // Backend metodun: [HttpGet("users")]
            const response = await axios.get(`${API_URL}/users`);
            return response.data;
        } catch (error) {
            console.error("Users GetAll error:", error);
            throw error;
        }
    }
};

export default userService;