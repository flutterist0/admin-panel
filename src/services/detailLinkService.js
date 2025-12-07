import axios from 'axios';

// const API_URL = "/api/ModelYearGroupDetailGroup";
const API_URL = `${import.meta.env.VITE_API_URL}/api/ModelYearGroupDetailGroup`;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const detailLinkService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/getall`);
        return response.data;
    },
    // Backend: Add(int modelId, int yearGroupId, int detailGroupId)
    add: async (modelId, yearGroupId, detailGroupId) => {
        const response = await axios.post(
            `${API_URL}/add?modelId=${modelId}&yearGroupId=${yearGroupId}&detailGroupId=${detailGroupId}`
        );
        return response.data;
    }
};

export default detailLinkService;