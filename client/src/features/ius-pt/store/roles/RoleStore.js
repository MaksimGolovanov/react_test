import { makeObservable, observable, action, runInAction, computed } from 'mobx'
import { BaseStore } from '../base/BaseStore'
import { IusPtService } from '../../services'

export class RoleStore extends BaseStore {
    roles = []
    stopRoles = []

    constructor() {
        super()
        
        // Используем makeObservable вместо makeAutoObservable
        makeObservable(this, {
            // Наблюдаемые свойства
            roles: observable,
            stopRoles: observable,
            
            // Действия (actions)
            fetchRoles: action,
            createRole: action,
            updateRole: action,
            deleteRole: action,
            bulkCreateRoles: action,
            fetchStopRoles: action,
            updateStopRole: action,
            deleteStopRole: action,
            createStopRole: action,
            
            // Вычисляемые свойства (computed)
            rolesTypes: computed,
        })
        
        this.fetchStopRoles()
    }

    // 📌 Методы для обычных ролей
    fetchRoles = async () => {
        try {
            const response = await super.fetchData(IusPtService.fetchRoles, 'roles')
            runInAction(() => {
                this.roles = response
            })
        } catch (error) {
            console.error('Ошибка при получении ролей:', error)
            throw error
        }
    }

    createRole = async (newRole) => {
        try {
            const response = await super.createOrUpdateData(
                IusPtService.createRole,
                IusPtService.fetchRoles,
                'roles',
                newRole
            )
            runInAction(() => {
                this.roles = response
            })
        } catch (error) {
            console.error('Ошибка при создании роли:', error)
            throw error
        }
    }

    updateRole = async (updatedRole) => {
        try {
            const response = await super.createOrUpdateData(
                IusPtService.updateRole,
                IusPtService.fetchRoles,
                'roles',
                updatedRole
            )
            runInAction(() => {
                this.roles = response
            })
        } catch (error) {
            console.error('Ошибка при обновлении роли:', error)
            throw error
        }
    }

    deleteRole = async (id) => {
        try {
            const response = await super.deleteData(
                IusPtService.deleteRole,
                IusPtService.fetchRoles,
                'roles',
                id
            )
            runInAction(() => {
                this.roles = response
            })
        } catch (error) {
            console.error('Ошибка при удалении роли:', error)
            throw error
        }
    }

    // 📌 Специальный метод для массового создания ролей
    bulkCreateRoles = async (roles) => {
        try {
            const response = await IusPtService.bulkCreateRoles(roles)
            runInAction(() => {
                this.roles = [...this.roles, ...response]
            })
            return response
        } catch (error) {
            console.error('Ошибка при массовом создании ролей:', error)
            throw error
        }
    }

    // 📌 Вычисляемое свойство для уникальных типов ролей
    get rolesTypes() {
        const uniqueTypes = [...new Set(this.roles.map((role) => role.typename))]
        return uniqueTypes
    }

    // 📌 Методы для стоп-ролей
    fetchStopRoles = async () => {
        try {
            const response = await super.fetchData(IusPtService.fetchStopRoles, 'stopRoles')
            runInAction(() => {
                this.stopRoles = response
            })
        } catch (error) {
            console.error('Ошибка при получении стоп-ролей:', error)
            throw error
        }
    }

    updateStopRole = async (id, stopRoleData) => {
        try {
            await IusPtService.updateStopRole(id, stopRoleData)
            await this.fetchStopRoles()
        } catch (error) {
            console.error('Ошибка при обновлении стоп-роли:', error)
            throw error
        }
    }

    deleteStopRole = async (id) => {
        try {
            await IusPtService.deleteStopRole(id)
            await this.fetchStopRoles()
        } catch (error) {
            console.error('Ошибка при удалении стоп-роли:', error)
            throw error
        }
    }

    createStopRole = async (stopRoleData) => {
        try {
            await IusPtService.createStopRole(stopRoleData)
            await this.fetchStopRoles()
        } catch (error) {
            console.error('Ошибка при создании стоп-роли:', error)
            throw error
        }
    }
}