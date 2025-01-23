import { makeAutoObservable, action } from 'mobx';
import IusPtService from '../services/IusPtService';

class IusPtStore {
  users = []; // Пользователи
  admin = []; // Администраторы
  roles = []; // Роли
  iususers = []; // Пользователи ИУС
  usersroles = []; // Роли пользователей
  iusstaffusers=[]



  constructor() {
    makeAutoObservable(this);
  }

  // Метод для загрузки пользователей
  fetchUsers = action(async () => {
    try {
      const responseUsers = await IusPtService.fetchUsers();
      this.users = responseUsers;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  });

  // Метод для загрузки администраторов
  fetchAdmin = action(async () => {
    try {
      const responseAdmin = await IusPtService.fetchIusAdm();
      this.admin = responseAdmin;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  });

  // Метод для создания администратора
  createAdm = action(async (newAdm) => {
    try {
      await IusPtService.createAdm(newAdm);
      await this.fetchAdmin(); // Обновляем список администраторов
    } catch (error) {
      console.error('Ошибка при создании администратора:', error);
    }
  });

  // Метод для обновления администратора
  updateAdm = action(async (updatedAdm) => {
    try {
      await IusPtService.updateAdm(updatedAdm);
      await this.fetchAdmin(); // Обновляем список администраторов
    } catch (error) {
      console.error('Ошибка при обновлении администратора:', error);
      throw error;
    }
  });

  // Метод для загрузки ролей
  fetchRole = action(async () => {
    try {
      const responseRoles = await IusPtService.fetchIusRoles();
      this.roles = responseRoles;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  });

  // Метод для создания роли
  createRole = action(async (newRole) => {
    try {
      await IusPtService.createRole(newRole);
      await this.fetchRole();
    } catch (error) {
      console.error('Ошибка при создании роли:', error);
    }
  });

  // Метод для обновления роли
  updateRole = action(async (updatedRole) => {
    try {
      await IusPtService.updateRole(updatedRole);
      await this.fetchRole();
    } catch (error) {
      console.error('Ошибка при обновлении роли:', error);
      throw error;
    }
  });

  // Метод для загрузки пользователей ИУС
  fetchIusUsers = action(async () => {
    try {
      const responseUsers = await IusPtService.fetchIusUsers();
      this.iususers = responseUsers;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  });

  // Метод для создания пользователя ИУС
  createUser = action(async (newUser) => {
    try {
      await IusPtService.createUser(newUser);
      await this.fetchIusUsers();
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  });

  // Метод для обновления пользователя ИУС
  updateUser = action(async (updatedUser) => {
    try {
      await IusPtService.updateUser(updatedUser);
      await this.fetchIusUsers();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      throw error;
    }
  });

  // Метод для создания или обновления пользователя ИУС
  createOrUpdateUser = action(async (user) => {
    try {
      await IusPtService.createOrUpdateUser(user);
      await this.fetchIusUsers(); // Обновляем список пользователей
    } catch (error) {
      console.error('Ошибка при создании/обновлении пользователя:', error);
      throw error;
    }
  });

  // Метод для получения ролей пользователей
  fetchUsersRoles = action(async () => {
    try {
      const responseUsersRoles = await IusPtService.fetchUsersRoles();
      this.usersroles = responseUsersRoles;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  });
  fetchStaffUsers = action(async () => {
    try {
      const responseStaffUsers = await IusPtService.fetchStaffUsers();
      
      this.iusstaffusers = responseStaffUsers;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  });





}

const iusPtStore = new IusPtStore();
export default iusPtStore;