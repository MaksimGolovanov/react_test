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

  //Type
  static async fetchIusType() {
    try {
      const response = await instance.get('/iuspt/type');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusAdm:', error);
      throw error;
    }
  }

  static async createType(type) {
    try {
      const response = await instance.post('/iuspt/type/create', type);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании типа ИУС:', error);
      throw error;
    }
  }

  static async updateType(type) {
    try {
      // Используем PUT или PATCH для обновления данных
      const response = await instance.put('/iuspt/type/update', type); // или PATCH
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении типа ИУС:', error);
      throw error;
    }
  }
   //Roles
   static async fetchIusRoles() {
    try {
      const response = await instance.get('/iuspt/roles');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusRoles:', error);
      throw error;
    }
  }

  static async createRole(role) {
    try {
      const response = await instance.post('/iuspt/role/create', role);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании типа ИУС:', error);
      throw error;
    }
  }

  static async updateRole(role) {
    try {
      // Используем PUT или PATCH для обновления данных
      const response = await instance.put('/iuspt/role/update', role); // или PATCH
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении типа ИУС:', error);
      throw error;
    }
  }
   //Users
   static async fetchIusUsers() {
    try {
      const response = await instance.get('/iuspt/user');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusUser:', error);
      throw error;
    }
  }

  static async createUser(user) {
    try {
      const response = await instance.post('/iuspt/user/create', user);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании пользователя ИУС:', error);
      throw error;
    }
  }

  static async updateUser(user) {
    try {
      // Используем PUT или PATCH для обновления данных
      const response = await instance.put('/iuspt/user/update', user); // или PATCH
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении пользователя ИУС:', error);
      throw error;
    }
  }
  static async createOrUpdateUser(user) {
    try {
        const response = await instance.post('/iuspt/user/create-or-update', user);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании/обновлении пользователя ИУС:', error);
        throw error;
    }
}
}

export default IusPtService;