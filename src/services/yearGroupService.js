import axios from 'axios';

// const API_URL = "/api/YearGroup"; // Portu özünə uyğun yoxla
const API_URL = `${import.meta.env.VITE_API_URL}/api/YearGroup`;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const yearGroupService = {
    getAll: async () => {
        try {
            // Backend-də GetAll metodun varsa:
            const response = await axios.get(`${API_URL}`); 
            return response.data;
        } catch (error) {
            console.error("YearGroup GetAll error:", error);
            throw error;
        }
    },
    getByModelId: async (modelId) => {
        try {
            // Backend endpointin: api/YearGroup/getByModelId?modelId=1
            const response = await axios.get(`${API_URL}/yearGroups/${modelId}`);
            return response.data;
        } catch (error) {
            console.error("GetByModelId error:", error);
            throw error;
        }
    },
    add: async (dto) => {
        // dto: { from: "2010", to: "2015" }
        const response = await axios.post(`${API_URL}`, dto);
        return response.data;
    },
    delete: async (id) => {
        // Senin backend stiline uyğun: delete?id=...
        const response = await axios.post(`${API_URL}/delete?id=${id}`);
        return response.data;
    }
};

export default yearGroupService;