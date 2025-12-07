import axios from 'axios';

// const API_URL = "/api/ModelYearGroupDetailGroupDetail";
const API_URL = `${import.meta.env.VITE_API_URL}/api/ModelYearGroupDetailGroupDetail`;


axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const finalLinkService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/getall`);
        return response.data;
    },
    // Backend: Add(int modelId, int yearGroupId, int detailGroupId, int detailId)
    add: async (modelId, yearGroupId, detailGroupId, detailId) => {
        const response = await axios.post(
            `${API_URL}/add?modelId=${modelId}&yearGroupId=${yearGroupId}&detailGroupId=${detailGroupId}&detailId=${detailId}`
        );
        return response.data;   
    }
};

export default finalLinkService;