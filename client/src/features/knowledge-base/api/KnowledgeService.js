import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class KnowledgeService {
    static async fetchArticles(params = {}) {
        try {
            const response = await axios.get(`${API_URL}api/knowledge/articles`, { params });
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении статей:', error);
            throw error;
        }
    }

    static async fetchArticle(id) {
        try {
            const response = await axios.get(`${API_URL}api/knowledge/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении статьи:', error);
            throw error;
        }
    }

    static async createArticle(data) {
        try {
            const response = await axios.post(`${API_URL}api/knowledge/articles`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании статьи:', error);
            throw error;
        }
    }

    static async updateArticle(id, data) {
        try {
            const response = await axios.put(`${API_URL}api/knowledge/articles/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении статьи:', error);
            throw error;
        }
    }

    static async deleteArticle(id) {
        try {
            const response = await axios.delete(`${API_URL}api/knowledge/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении статьи:', error);
            throw error;
        }
    }

    static async fetchCategories() {
        try {
            const response = await axios.get(`${API_URL}api/knowledge/categories`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            throw error;
        }
    }

    static async fetchStats() {
        try {
            const response = await axios.get(`${API_URL}api/knowledge/stats`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
            throw error;
        }
    }

    static async searchArticles(query) {
        try {
            const response = await axios.get(`${API_URL}api/knowledge/search`, {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при поиске статей:', error);
            throw error;
        }
    }

    static async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axios.post(`${API_URL}api/knowledge/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            throw error;
        }
    }
}

export default KnowledgeService;