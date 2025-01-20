import { makeAutoObservable, action, observable } from 'mobx';
import IusPtService from '../services/IusPtService';
import * as XLSX from 'xlsx'; // Импортируем библиотеку для работы с Excel

class IusPtStore {
    users = [];
    admin = [];
    types = [];
    roles = [];
    iususers = [];

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
            const responseUsers = await IusPtService.fetchIusAdm();
            this.admin = responseUsers;
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

    // Метод для загрузки типов
    fetchType = action(async () => {
        try {
            const responseUsers = await IusPtService.fetchIusType();
            this.types = responseUsers;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    });

    // Метод для создания типа
    createType = action(async (newType) => {
        try {
            await IusPtService.createType(newType);
            await this.fetchType(); // Обновляем список типов
        } catch (error) {
            console.error('Ошибка при создании типа ИУС:', error);
        }
    });

    // Метод для обновления типа
    updateType = action(async (updatedType) => {
        try {
            await IusPtService.updateType(updatedType);
            await this.fetchType(); // Обновляем список типов
        } catch (error) {
            console.error('Ошибка при обновлении типа ИУС:', error);
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

    createRole = action(async (newRole) => {
        try {
            await IusPtService.createRole(newRole);
            await this.fetchRole();
        } catch (error) {
            console.error('Ошибка при создании роли:', error);
        }
    });

    updateRole = action(async (updatedRole) => {
        try {
            await IusPtService.updateRole(updatedRole);
            await this.fetchRole();
        } catch (error) {
            console.error('Ошибка при обновлении роли:', error);
            throw error;
        }
    });

    uploadRolesFromExcel = action(async (roles) => {
        const batchSize = 10;
        for (let i = 0; i < roles.length; i += batchSize) {
            const batch = roles.slice(i, i + batchSize);
            try {
                await Promise.all(batch.map(role => this.createRole(role)));
            } catch (error) {
                console.error('Ошибка при создании ролей из Excel:', error);
            }
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

    createUser = action(async (newUser) => {
        try {
            await IusPtService.createUser(newUser);
            await this.fetchIusUsers();
        } catch (error) {
            console.error('Ошибка при создании роли:', error);
        }
    });

    updateUser = action(async (updatedUser) => {
        try {
            await IusPtService.updateUser(updatedUser);
            await this.fetchIusUsers();
        } catch (error) {
            console.error('Ошибка при обновлении роли:', error);
            throw error;
        }
    });
    createOrUpdateUser = action(async (user) => {
        try {
            await IusPtService.createOrUpdateUser(user);
            await this.fetchIusUsers(); // Обновляем список пользователей
        } catch (error) {
            console.error('Ошибка при создании/обновлении пользователя:', error);
            throw error;
        }
    });
}

const iusPtStore = new IusPtStore();
export default iusPtStore;