import axios from 'axios';

const API_URL = "/api/Model"; // Portu özünə uyğun yoxla

// Axios interceptor (Token üçün - əgər authService-də qlobal yazmamısansa burda da olmalıdır)
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const modelService = {
    // Bütün modelləri gətir
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/getModels`);
            return response.data;
        } catch (error) {
            console.error("Model GetAll error:", error);
            throw error;
        }
    },

    // Yeni model əlavə et
    add: async (modelDto) => {
        // modelDto: { name, imageUrl, brandId }
        try {
            const response = await axios.post(`${API_URL}/addModel`, modelDto);
            return response.data;
        } catch (error) {
            console.error("Model Add error:", error);
            throw error;
        }
    },

    // Modeli sil (C# kodunda Delete id qəbul edir)
    // Diqqət: Backend-də Delete metodu Post-dur yoxsa Delete? 
    // Adətən: [HttpPost("delete")] olur. Aşağıdakı kimi yazıram:
    delete: async (id) => {
        try {
            // Əgər backenddə query string kimi qəbul edirsə: ?id=5
            const response = await axios.delete(`${API_URL}/delete?id=${id}`);
            return response.data;
        } catch (error) {
            console.error("Model Delete error:", error);
            throw error;
        }
    }
};

export default modelService;