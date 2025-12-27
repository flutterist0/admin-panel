import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/DiscountPromocode`;
// const API_URL = "/api/DiscountPromocode";

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const promocodeService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/getall`);
            return response.data;
        } catch (error) {
            console.error("Promocode GetAll error:", error);
            throw error;
        }
    },
    add: async (dto) => {
        const response = await axios.post(`${API_URL}/add`, dto);
        return response.data;
    },
    // Əgər Delete metodun varsa:
    delete: async (id) => {
        const response = await axios.post(`${API_URL}/delete?id=${id}`);
        return response.data;
    },
    // Promokodun statusunu dəyişmək üçün (varsa)
    toggleStatus: async (id) => {
        // Bu metod backend-də yoxdursa, sadəcə delete istifadə et
        return { success: false, message: "Not implemented" };
    }
};

export default promocodeService;