// services/ConfidentialService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class ConfidentialService {
  static async fetchAll() {
    try {
      const response = await axios.get(`${API_URL}api/confidential`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке конфиденциальной информации:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const response = await axios.post(`${API_URL}api/confidential`, data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании записи:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await axios.put(
        `${API_URL}api/confidential/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении записи:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await axios.delete(`${API_URL}api/confidential/${id}`);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      throw error;
    }
  }
}

export default ConfidentialService;
