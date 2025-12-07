import axios from 'axios';

const API_URL = "/api/Brand";

const brandService = {
    // Bütün brendləri gətir
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/getall`);
            return response.data; // SuccessDataResult qaytarır
        } catch (error) {
            console.error("GetAll error:", error);
            throw error;
        }
    },

    // Yeni brend əlavə et
    add: async (brandDto) => {
        try {
            const response = await axios.post(`${API_URL}/addBrand`, brandDto);
            return response.data; // SuccessResult qaytarır
        } catch (error) {
            console.error("Add error:", error);
            throw error;
        }
    }
};

export default brandService;