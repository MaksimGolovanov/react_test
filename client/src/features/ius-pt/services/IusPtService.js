import axios from 'axios';

// Настройка axios
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000, // Таймаут 5 секунд
});

class IusPtService {
  // Вспомогательный метод для выполнения запросов
  static request = async (method, url, data = null) => {
    try {
      const response = await instance({ method, url, data });
      return response.data;
    } catch (error) {
      console.error(`Ошибка при выполнении запроса ${method.toUpperCase()} ${url}:`, error);
      throw error;
    }
  }

  // Методы для работы с администраторами (IusSpravAdm)
  static fetchAdmins = async () => {
    return this.request('get', '/iuspt/adm');
  }

  static createAdmin = async (admin) => {
    return this.request('post', '/iuspt/adm', admin);
  }

  static updateAdmin = async (admin) => {
    return this.request('put', '/iuspt/adm', admin);
  }

  static deleteAdmin = async (id) => {
    return this.request('delete', `/iuspt/adm/${id}`);
  }

  // Методы для работы с ролями (IusSpravRoles)
  static fetchRoles = async () => {
    return this.request('get', '/iuspt/roles');
  }

  static createRole = async (role) => {
    return this.request('post', '/iuspt/roles', role);
  }

  static updateRole = async (role) => {
    return this.request('put', '/iuspt/roles', role);
  }

  static deleteRole = async (id) => {
    return this.request('delete', `/iuspt/roles/${id}`);
  }

  // Методы для работы с пользователями ИУС (IusUser)
  static fetchIusUsers = async () => {
    return this.request('get', '/iuspt/users');
  }

  static createOrUpdateUser = async (user) => {
    return this.request('post', '/iuspt/users', user);
  }

  static deleteUser = async (id) => {
    return this.request('delete', `/iuspt/users/${id}`);
  }

  // Методы для работы со связями пользователей и ролей (IusUserRoles)
  static fetchUserRoles = async (tabNumber) => {
    
    return this.request('get', `/iuspt/user-roles/${tabNumber}`);
  }

  static createUserRole = async (userRole) => {
    return this.request('post', '/iuspt/user-roles', userRole);
  }

  static deleteUserRole = async (tabNumber, roleId) => {
    return this.request('delete', `/iuspt/user-roles/${tabNumber}/${roleId}`);
  }

  static addRolesToUser = async (tabNumber, roleIds) => {
    return this.request('post', '/iuspt/user-roles/bulk', { tabNumber, roleIds });
  }

  // Методы для работы с сотрудниками и их связями с пользователями ИУС (Staff)
  static fetchStaffWithIusUser = async () => {
    return this.request('get', '/iuspt/staff-with-iususer');
  }
}

export default IusPtService;