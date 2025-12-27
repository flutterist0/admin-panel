import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/Cart`;
// const API_URL = "/api/Cart"; 

// Token interceptor qalsın...
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const promocodeService = {
    // ... (Əvvəlki CRUD metodları qalsın: getAll, add, delete, check)

    // --- YENİ STATİSTİKA METODLARI ---

    // 1. Bütün istifadə tarixçəsi (Log)
    getAllUsages: async () => {
        const response = await axios.get(`${API_URL}/admin/all-promocode-usages`);
        return response.data;
    },

    // 2. Ümumi Statistika (Hansı kod neçə dəfə işlənib)
    getStatistics: async () => {
        const response = await axios.get(`${API_URL}/admin/promocode-statistics`);
        return response.data;
    },

    // 3. Konkret Promokodun istifadələri (Drill-down)
    getUsagesByCode: async (promocodeId) => {
        const response = await axios.get(`${API_URL}/admin/promocode-usages/${promocodeId}`);
        return response.data;
    },

    // 4. Konkret Userin istifadələri
    getUserHistory: async (userId) => {
        const response = await axios.get(`${API_URL}/admin/user-promocode-history/${userId}`);
        return response.data;
    }
};

export default promocodeService;