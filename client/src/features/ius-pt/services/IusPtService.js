import { ApiClient } from './api/ApiClient';
import { SignatureService } from './modules/SignatureService';
import { RoleService } from './modules/RoleService';
import { UserService } from './modules/UserService';
import { StaffService } from './modules/StaffService';
import { StopRoleService } from './modules/StopRoleService';

export class IusPtService {
    constructor(baseURL = process.env.REACT_APP_API_URL) {
        if (!baseURL) {
            throw new Error('Base URL is required');
        }

        const apiClient = new ApiClient(`${baseURL}api`);
        
        // Инициализация конкретных сервисов
        this.signatureService = new SignatureService(apiClient);
        this.roleService = new RoleService(apiClient);
        this.userService = new UserService(apiClient);
        this.staffService = new StaffService(apiClient);
        this.stopRoleService = new StopRoleService(apiClient);
    }

    // ========== Подписи (администраторы) ==========
    fetchSignatures = () => this.signatureService.fetchAll();
    createSignature = (signature) => this.signatureService.create(signature);
    updateSignature = (signature) => this.signatureService.update(signature);
    deleteSignature = (id) => this.signatureService.delete(id);

    // ========== Роли ==========
    fetchRoles = () => this.roleService.fetchAll();
    createRole = (role) => this.roleService.create(role);
    updateRole = (role) => this.roleService.update(role);
    deleteRole = (id) => this.roleService.delete(id);
    bulkCreateRoles = (roles) => this.roleService.bulkCreate(roles);

    // ========== Пользователи ==========
    fetchIusUsers = () => this.userService.fetchAll();
    createOrUpdateUser = (user) => this.userService.createOrUpdate(user);
    deleteUser = (id) => this.userService.delete(id);
    fetchUserRoles = (tabNumber) => this.userService.fetchUserRoles(tabNumber);
    createUserRole = (userRole) => this.userService.createUserRole(userRole);
    deleteUserRole = (tabNumber, roleId) => this.userService.deleteUserRole(tabNumber, roleId);
    addRolesToUser = (tabNumber, roleIds) => this.userService.addRolesToUser(tabNumber, roleIds);

    // ========== Сотрудники ==========
    fetchStaffWithUser = () => this.staffService.fetchWithUser();
    fetchStaffWithIusUser = () => this.staffService.fetchWithIusUser();
    fetchStaffByTabNumber = (tabNumber) => this.staffService.fetchByTabNumber(tabNumber);
    fetchStaffWithIusUserSimple = () => this.staffService.fetchSimple();
    fetchStaffWithIusUserSimpleOver = () => this.staffService.fetchSimpleOver();

    // ========== Стоп-роли ==========
    fetchStopRoles = () => this.stopRoleService.fetchAll();
    createStopRole = (stopRole) => this.stopRoleService.create(stopRole);
    updateStopRole = (id, stopRoleData) => this.stopRoleService.update(id, stopRoleData);
    deleteStopRole = (id) => this.stopRoleService.delete(id);
}

// ✅ Создаем экземпляр и экспортируем его по имени
const iusPtServiceInstance = new IusPtService();

// Экспортируем синглтон как default
export default iusPtServiceInstance;