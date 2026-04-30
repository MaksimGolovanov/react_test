// src/services/KnowledgeService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class KnowledgeService {
  // ---------- Статьи ----------
  static async fetchArticles(params = {}) {
    try {
      const response = await axios.get(`${API_URL}api/knowledge/articles`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статей:', error);
      throw error;
    }
  }

  static async fetchArticle(id) {
    try {
      const response = await axios.get(
        `${API_URL}api/knowledge/articles/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статьи:', error);
      throw error;
    }
  }

  static async createArticle(data) {
    try {
      const response = await axios.post(
        `${API_URL}api/knowledge/articles`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
      throw error;
    }
  }

  static async updateArticle(id, data) {
    try {
      const response = await axios.put(
        `${API_URL}api/knowledge/articles/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении статьи:', error);
      throw error;
    }
  }

  static async deleteArticle(id) {
    try {
      const response = await axios.delete(
        `${API_URL}api/knowledge/articles/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
      throw error;
    }
  }

  // ---------- Категории ----------
  static async fetchCategories() {
    try {
      const response = await axios.get(`${API_URL}api/knowledge/categories`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении категорий:', error);
      throw error;
    }
  }

  static async createCategory(data) {
    try {
      const response = await axios.post(
        `${API_URL}api/knowledge/categories`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      throw error;
    }
  }

  static async updateCategory(id, data) {
    try {
      const response = await axios.put(
        `${API_URL}api/knowledge/categories/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await axios.delete(
        `${API_URL}api/knowledge/categories/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении категории:', error);
      throw error;
    }
  }

  // ---------- Поиск ----------
  static async searchArticles(query) {
    try {
      const response = await axios.get(`${API_URL}api/knowledge/search`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при поиске статей:', error);
      throw error;
    }
  }

  // ---------- Загрузка файлов (если нужна) ----------
  static async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(
        `${API_URL}api/knowledge/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw error;
    }
  }

  // ---------- Теги ----------
  static async fetchTags() {
    const response = await axios.get(`${API_URL}api/knowledge/tags`);
    return response.data;
  }
}

export default KnowledgeService;
