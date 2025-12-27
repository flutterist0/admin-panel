import axios from 'axios';

// const API_URL = "/api/Tag"; 
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/Tag`;
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const tagService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/getTags`);
            return response.data;
        } catch (error) {
            console.error("Tag GetAll error:", error);
            throw error;
        }
    },
    add: async (dto) => {
        // dto: { name: "..." }
        const response = await axios.post(`${API_URL}/addTag`, dto);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/delete?id=${id}`);
        return response.data;
    }
};

export default tagService;