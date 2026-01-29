import { SignatureStore } from './signature/SignatureStore'
import { RoleStore } from './roles/RoleStore'
import { UserStore } from './users/UserStore'
import { StaffStore } from './staff/StaffStore'

export class IusPtStore {
    // ✅ Создаем экземпляры всех сторов
    signatureStore = new SignatureStore()
    roleStore = new RoleStore()
    userStore = new UserStore()
    staffStore = new StaffStore()

    // 📌 Геттеры для удобного доступа к данным
    
    // Администраторы (подписи) - ПРАВИЛЬНОЕ ИМЯ
    get signatures() { return this.signatureStore.signatures }
    get signature() { return this.signatureStore.signatures } // Альтернативный геттер для совместимости
    
    // Роли
    get roles() { return this.roleStore.roles }
    get stopRoles() { return this.roleStore.stopRoles }
    get rolesTypes() { return this.roleStore.rolesTypes }
    
    // Пользователи
    get iusUsers() { return this.userStore.iusUsers }
    get userRoles() { return this.userStore.userRoles }
    
    // Сотрудники
    get staffWithIusUsers() { return this.staffStore.staffWithIusUsers }
    get staffWithIusUsersSimple() { return this.staffStore.staffWithIusUsersSimple }
    get staffWithIusUsersSimpleOver() { return this.staffStore.staffWithIusUsersSimpleOver }

    // ========== МЕТОДЫ ДЛЯ АДМИНИСТРАТОРОВ ==========
    
    fetchSignatures = () => this.signatureStore.fetchSignatures()
    createSignature = (signature) => this.signatureStore.createSignature(signature)
    updateSignature = (signature) => this.signatureStore.updateSignature(signature)
    deleteSignature = (id) => this.signatureStore.deleteSignature(id)

    // ========== МЕТОДЫ ДЛЯ РОЛЕЙ ==========
    
    fetchRoles = () => this.roleStore.fetchRoles()
    createRole = (role) => this.roleStore.createRole(role)
    updateRole = (role) => this.roleStore.updateRole(role)
    deleteRole = (id) => this.roleStore.deleteRole(id)
    bulkCreateRoles = (roles) => this.roleStore.bulkCreateRoles(roles)

    // ========== МЕТОДЫ ДЛЯ СТОП-РОЛЕЙ ==========
    
    fetchStopRoles = () => this.roleStore.fetchStopRoles()
    updateStopRole = (id, stopRoleData) => this.roleStore.updateStopRole(id, stopRoleData)
    deleteStopRole = (id) => this.roleStore.deleteStopRole(id)
    createStopRole = (stopRoleData) => this.roleStore.createStopRole(stopRoleData)

    // ========== МЕТОДЫ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ ==========
    
    fetchIusUsers = () => this.userStore.fetchIusUsers()
    createOrUpdateUser = (user) => this.userStore.createOrUpdateUser(user)
    deleteUser = (id) => this.userStore.deleteUser(id)
    fetchUserRoles = (tabNumber) => this.userStore.fetchUserRoles(tabNumber)
    createUserRole = (userRole) => this.userStore.createUserRole(userRole)
    deleteUserRole = (tabNumber, roleId) => this.userStore.deleteUserRole(tabNumber, roleId)
    addRolesToUser = (tabNumber, roleIds) => this.userStore.addRolesToUser(tabNumber, roleIds)

    // ========== МЕТОДЫ ДЛЯ СОТРУДНИКОВ ==========
    
    fetchStaffWithIusUsers = () => this.staffStore.fetchStaffWithIusUsers()
    fetchStaffByTabNumber = (tabNumber) => this.staffStore.fetchStaffByTabNumber(tabNumber)
    fetchStaffWithIusUserSimple = () => this.staffStore.fetchStaffWithIusUserSimple()
    fetchStaffWithIusUserSimpleOver = () => this.staffStore.fetchStaffWithIusUserSimpleOver()
}

// ✅ Создаем и экспортируем единственный экземпляр
const iusPtStore = new IusPtStore()
export default iusPtStore