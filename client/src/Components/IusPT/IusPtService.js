import axios from 'axios';

// Настройка axios
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000, // Таймаут 5 секунд
});

class IusPtService {
  static async fetchUsers() {
    try {
      const response = await instance.get('/staff/');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      throw error;
    }
  }

  static async fetchIusAdm() {
    try {
      const response = await instance.get('/iuspt/');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusAdm:', error);
      throw error;
    }
  }

  static async createAdm(adm) {
    try {
      const response = await instance.post('/iuspt/create/adm', adm);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
      throw error;
    }
  }

  static async updateAdm(adm) {
    try {
      // Используем PUT или PATCH для обновления данных
      const response = await instance.put('/iuspt/update/adm', adm); // или PATCH
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении администратора:', error);
      throw error;
    }
  }
}

export default IusPtService;