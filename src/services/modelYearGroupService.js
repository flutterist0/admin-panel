import axios from 'axios';

// const API_URL = "/api/ModelYearGroup";
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/ModelYearGroup`;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const modelYearGroupService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    },
    // Backend metodun: Add(int modelId, int yearGroupId)
    // Bu metod DTO yox, birbaşa parametr qəbul etdiyi üçün query string istifadə edirik:
    add: async (modelId, yearGroupId) => {
        const response = await axios.post(`${API_URL}?modelId=${modelId}&yearGroupId=${yearGroupId}`);
        return response.data;
    },
    // Delete metodu varsa bura əlavə edərsən, hazırda backend kodunda görmədim.
};

export default modelYearGroupService;