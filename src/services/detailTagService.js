import axios from 'axios';

// const API_URL = "/api/DetailTag"; 
const API_URL = `${import.meta.env.VITE_API_URL}/api/DetailTag`;
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const detailTagService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/getDetailTags`);
        return response.data;
    },
    // Backend: Add(int tagId, int detailId)
    add: async (tagId, detailId) => {
        const response = await axios.post(`${API_URL}/addDetailTag?tagId=${tagId}&detailId=${detailId}`);
        return response.data;
    }
};

export default detailTagService;