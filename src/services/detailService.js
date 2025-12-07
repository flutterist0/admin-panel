import axios from 'axios';

// const API_URL = "/api/Detail";
const API_URL = `${import.meta.env.VITE_API_URL}/api/Detail`;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const detailService = {
    // 3-lü əlaqəyə görə hissələri gətir
    // getDetails: async (modelId, yearGroupId, detailGroupId) => {
    //     try {
    //         const response = await axios.get(`${API_URL}/details?modelId=${modelId}&yearGroupId=${yearGroupId}&detailGroupId=${detailGroupId}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error("GetDetails error:", error);
    //         throw error;
    //     }
    // },
    // Bütün hissələri gətir (əgər belə metod varsa, yoxdursa özünə uyğunlaşdır)
    getAll: async () => {
        try {
            // Əgər backenddə GetAll varsa
            const response = await axios.get(`${API_URL}/getall`); 
            return response.data;
        } catch (error) {
            return { success: false, message: "GetAll metodu yoxdur" };
        }
    },
    add: async (dto) => {
        const response = await axios.post(`${API_URL}/addDetail`, dto);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/delete?id=${id}`);
        return response.data;
    }
};

export default detailService;