import { makeAutoObservable, action } from 'mobx';
import AdminService from '../Admin/AdminService';

class UserStore {
    users = [];
    roles = [];
    userRoles = [];
    userRolesAuth = [];
    loading = true;
    isAuthenticated = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Метод для получения пользователей обернут в action
    fetchUsers = action(async () => {
        try {
            this.loading = true;
            const responseUsers = await AdminService.fetchUser();
            const responseRoles = await AdminService.fetchRole();
            const responseUserRole = await AdminService.fetchRoleUser();
            
            this.users = responseUsers;
            this.roles = responseRoles;
            this.userRoles = responseUserRole;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            this.loading = false;
        }
    });

    // Метод для аутентификации обернут в action
    login = action(async (login, password) => {
        try {
            const result = await AdminService.login({ login, password });
            this.isAuthenticated = true; // Обновляем статус аутентификации
            this.userRolesAuth = result.user.roleNames; // Сохраняем роли пользователя
            
            return true;
        } catch (error) {
            console.error('Ошибка при входе:', error);
            this.isAuthenticated = false; // Сбрасываем статус аутентификации
            return false;
        }
    });

    // Метод для выхода обернут в action
    logout = action(() => {
        this.isAuthenticated = false; // Сбрасываем статус аутентификации
        this.userRolesAuth = []; // Очищаем роли
    });

    // Метод для создания пользователя обернут в action
    createUser = action(async (login, password, selectedRoles, description) => {
        try {
            console.log('Creating user with data:', {
                login,
                password,
                roles: selectedRoles,
                description
            });

            const result = await AdminService.registration({
                login,
                password,
                roles: selectedRoles,
                description
            });

            console.log('User created successfully:', result);
            await this.fetchUsers();
            return true;
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            let errorMessage = 'Ошибка при создании пользователя';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            alert(errorMessage);
            return false;
        }
    });

    // Метод для обновления пользователя обернут в action
    updateUser = action(async (userId, userData) => {
        try {
            this.loading = true;
            const result = await AdminService.updateUser(userId, {
                login: userData.login,
                password: userData.password,
                description: userData.description,
                roles: userData.roles
            });

            await this.fetchUsers(); // Обновляем список пользователей
            return true;
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            let errorMessage = 'Ошибка при обновлении пользователя';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            alert(errorMessage);
            return false;
        } finally {
            this.loading = false;
        }
    });

    // Метод для удаления пользователя обернут в action
    deleteUser = action(async (userId) => {
        try {
            await AdminService.deleteUser(userId);
            await this.fetchUsers(); // Принудительная перезагрузка списка пользователей
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    });

    // Удаление роли из пользователя обернут в action
    removeRole = action(async (userId, role) => {
        const foundRole = this.roles.find(r => r.role === role);
        if (!foundRole) {
            console.error(`Роль с названием "${role}" не найдена.`);
            return;
        }

        const roleId = foundRole.id;
        if (window.confirm(`Вы уверены, что хотите удалить роль с ID ${roleId} у пользователя с ID ${userId}?`)) {
            try {
                await AdminService.removeRoleFromUser(userId, roleId);
                await this.fetchUsers(); // Обновляем список пользователей
            } catch (error) {
                console.error('Ошибка при удалении роли:', error);
            }
        }
    });

    // Метод для получения ролей обернут в action
    fetchRoles = action(async () => {
        try {
            const responseRoles = await AdminService.fetchRole();
            this.roles = responseRoles; // Обновляем роли
        } catch (error) {
            console.error('Ошибка при получении ролей:', error);
        }
    });

    // Метод для создания роли обернут в action
    createRole = action(async (newRole) => {
        try {
            await AdminService.createRole(newRole);
            await this.fetchRoles(); // Обновляем список ролей
        } catch (error) {
            console.error('Ошибка при создании роли:', error);
        }
    });
}

const userStore = new UserStore();
export default userStore;