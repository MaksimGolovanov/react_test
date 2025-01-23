import axios from 'axios';

// Настройка axios
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000, // Таймаут 5 секунд
});

class IusPtService {
  // Метод для получения пользователей
  static async fetchUsers() {
    try {
      const response = await instance.get('/staff/');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      throw error;
    }
  }

  // Метод для получения администраторов
  static async fetchIusAdm() {
    try {
      const response = await instance.get('/iuspt/adm');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusAdm:', error);
      throw error;
    }
  }

  // Метод для создания администратора
  static async createAdm(adm) {
    try {
      const response = await instance.post('/iuspt/adm/create', adm);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
      throw error;
    }
  }

  // Метод для обновления администратора
  static async updateAdm(adm) {
    try {
      const response = await instance.put(`/iuspt/adm/update/${adm.id}`, adm);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении администратора:', error);
      throw error;
    }
  }

  // Метод для получения ролей
  static async fetchIusRoles() {
    try {
      const response = await instance.get('/iuspt/roles');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusRoles:', error);
      throw error;
    }
  }

  // Метод для создания роли
  static async createRole(role) {
    try {
      const response = await instance.post('/iuspt/role/create', role);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании роли:', error);
      throw error;
    }
  }

  // Метод для обновления роли
  static async updateRole(role) {
    try {
      const response = await instance.put(`/iuspt/role/update/${role.id}`, role);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении роли:', error);
      throw error;
    }
  }

  // Метод для получения пользователей ИУС
  static async fetchIusUsers() {
    try {
      const response = await instance.get('/iuspt/user');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных IusUser:', error);
      throw error;
    }
  }

  // Метод для создания пользователя ИУС
  static async createUser(user) {
    try {
      const response = await instance.post('/iuspt/user/create', user);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании пользователя ИУС:', error);
      throw error;
    }
  }

  // Метод для обновления пользователя ИУС
  static async updateUser(user) {
    try {
      const response = await instance.put(`/iuspt/user/update/${user.id}`, user);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении пользователя ИУС:', error);
      throw error;
    }
  }

  // Метод для создания или обновления пользователя ИУС
  static async createOrUpdateUser(user) {
    try {
      const response = await instance.post('/iuspt/user/create-or-update', user);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании/обновлении пользователя ИУС:', error);
      throw error;
    }
  }

  // Метод для получения ролей пользователей
  static async fetchUsersRoles() {
    try {
      const response = await instance.get('/iuspt/user/usersroles');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении ролей пользователей:', error);
      throw error;
    }
  }
  static async fetchStaffUsers() {
    try {
      const response = await instance.get('/iuspt/userall');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении ролей пользователей:', error);
      throw error;
    }
  }


}

export default IusPtService;