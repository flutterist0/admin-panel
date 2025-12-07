import axios from 'axios';

const API_URL = "/api/DetailGroup";

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const detailGroupService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/getall`);
            return response.data;
        } catch (error) {
            console.error("DetailGroup GetAll error:", error);
            throw error;
        }
    },
    getByModelAndYear: async (modelId, yearId) => {
    // Backend endpointinə uyğun olaraq:
    const response = await axios.get(`${API_URL}/getByModelIdAndYearGroupId?modelId=${modelId}&yearGroupId=${yearId}`);
    return response.data;
},  
    add: async (dto) => {
        // dto: { name, imageUrl }
        const response = await axios.post(`${API_URL}/addDetailGroup`, dto);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.post(`${API_URL}/delete?id=${id}`);
        return response.data;
    }
};

export default detailGroupService;