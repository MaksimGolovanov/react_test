import { makeAutoObservable, action } from 'mobx';
import IusPtService from '../services/IusPtService';

class IusPtStore {
  users = []; // Пользователи
  admins = []; // Администраторы
  roles = []; // Роли
  iusUsers = []; // Пользователи ИУС
  userRoles = []; // Роли пользователей
  staffWithIusUsers = []; // Сотрудники и их связи с пользователями ИУС

  constructor() {
    makeAutoObservable(this);
  }

  // Общий метод для загрузки данных
  fetchData = action(async (fetchFunction, stateProperty) => {
    try {
      const response = await fetchFunction();
      this[stateProperty] = response;
    } catch (error) {
      console.error(`Ошибка при получении данных (${stateProperty}):`, error);
    }
  });

  // Общий метод для создания/обновления данных
  createOrUpdateData = action(async (serviceFunction, fetchFunction, stateProperty, data) => {
    try {
      await serviceFunction(data);
      await this.fetchData(fetchFunction, stateProperty);
    } catch (error) {
      console.error(`Ошибка при создании/обновлении данных (${stateProperty}):`, error);
      throw error;
    }
  });

  // Общий метод для удаления данных
  deleteData = action(async (serviceFunction, fetchFunction, stateProperty, id) => {
    try {
      await serviceFunction(id);
      await this.fetchData(fetchFunction, stateProperty);
    } catch (error) {
      console.error(`Ошибка при удалении данных (${stateProperty}):`, error);
      throw error;
    }
  });

  // Методы для работы с администраторами
  fetchAdmins = () => this.fetchData(IusPtService.fetchAdmins, 'admins');
  createAdmin = (newAdmin) => this.createOrUpdateData(IusPtService.createAdmin, IusPtService.fetchAdmins, 'admins', newAdmin);
  updateAdmin = (updatedAdmin) => this.createOrUpdateData(IusPtService.updateAdmin, IusPtService.fetchAdmins, 'admins', updatedAdmin);
  deleteAdmin = (id) => this.deleteData(IusPtService.deleteAdmin, IusPtService.fetchAdmins, 'admins', id);

  // Методы для работы с ролями
  fetchRoles = () => this.fetchData(IusPtService.fetchRoles, 'roles');
  createRole = (newRole) => this.createOrUpdateData(IusPtService.createRole, IusPtService.fetchRoles, 'roles', newRole);
  updateRole = (updatedRole) => this.createOrUpdateData(IusPtService.updateRole, IusPtService.fetchRoles, 'roles', updatedRole);
  deleteRole = (id) => this.deleteData(IusPtService.deleteRole, IusPtService.fetchRoles, 'roles', id);

  // Методы для работы с пользователями ИУС
  fetchIusUsers = () => this.fetchData(IusPtService.fetchIusUsers, 'iusUsers');
  createOrUpdateUser = (user) => this.createOrUpdateData(IusPtService.createOrUpdateUser, IusPtService.fetchIusUsers, 'iusUsers', user);
  deleteUser = (id) => this.deleteData(IusPtService.deleteUser, IusPtService.fetchIusUsers, 'iusUsers', id);

  // Методы для работы с ролями пользователей
  fetchUserRoles = () => this.fetchData(IusPtService.fetchUserRoles, 'userRoles');
  createUserRole = (userRole) => this.createOrUpdateData(IusPtService.createUserRole, IusPtService.fetchUserRoles, 'userRoles', userRole);
  deleteUserRole = (id) => this.deleteData(IusPtService.deleteUserRole, IusPtService.fetchUserRoles, 'userRoles', id);

  // Метод для загрузки сотрудников и их связей с пользователями ИУС
  fetchStaffWithIusUsers = () => this.fetchData(IusPtService.fetchStaffWithIusUser, 'staffWithIusUsers');
}

const iusPtStore = new IusPtStore();
export default iusPtStore;