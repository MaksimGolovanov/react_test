import { makeObservable, observable, action, runInAction } from 'mobx'
import { BaseStore } from '../base/BaseStore'
import IusPtService from '../../services/IusPtService'

export class UserStore extends BaseStore {
    iusUsers = []
    userRoles = []

    constructor() {
        super()
        
        makeObservable(this, {
            iusUsers: observable,
            userRoles: observable,
            fetchIusUsers: action,
            createOrUpdateUser: action,
            deleteUser: action,
            fetchUserRoles: action,
            createUserRole: action,
            deleteUserRole: action,
            addRolesToUser: action,
        })
    }

    // 📌 Методы для пользователей ИУС
    fetchIusUsers = async () => {
        try {
            const response = await super.fetchData(IusPtService.fetchIusUsers, 'iusUsers')
            runInAction(() => {
                this.iusUsers = response
            })
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error)
            throw error
        }
    }

    createOrUpdateUser = async (user) => {
        try {
            const response = await super.createOrUpdateData(
                IusPtService.createOrUpdateUser,
                IusPtService.fetchIusUsers,
                'iusUsers',
                user
            )
            runInAction(() => {
                this.iusUsers = response
            })
        } catch (error) {
            console.error('Ошибка при создании/обновлении пользователя:', error)
            throw error
        }
    }

    deleteUser = async (id) => {
        try {
            const response = await super.deleteData(
                IusPtService.deleteUser,
                IusPtService.fetchIusUsers,
                'iusUsers',
                id
            )
            runInAction(() => {
                this.iusUsers = response
            })
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error)
            throw error
        }
    }

    // 📌 Методы для ролей пользователей
    fetchUserRoles = async (tabNumber) => {
        try {
            const response = await super.fetchData(IusPtService.fetchUserRoles, 'userRoles', tabNumber)
            runInAction(() => {
                this.userRoles = response
            })
        } catch (error) {
            console.error('Ошибка при получении ролей пользователя:', error)
            throw error
        }
    }

    createUserRole = async (userRole) => {
        try {
            const response = await super.createOrUpdateData(
                IusPtService.createUserRole,
                IusPtService.fetchUserRoles,
                'userRoles',
                userRole
            )
            runInAction(() => {
                this.userRoles = response
            })
        } catch (error) {
            console.error('Ошибка при создании роли пользователя:', error)
            throw error
        }
    }

    deleteUserRole = async (tabNumber, roleId) => {
        try {
            const response = await super.deleteData(
                IusPtService.deleteUserRole,
                IusPtService.fetchUserRoles,
                'userRoles',
                tabNumber,
                roleId
            )
            runInAction(() => {
                this.userRoles = response
            })
        } catch (error) {
            console.error('Ошибка при удалении роли пользователя:', error)
            throw error
        }
    }

    // 📌 Специальный метод для добавления нескольких ролей
    addRolesToUser = async (tabNumber, roleIds) => {
        try {
            const response = await IusPtService.addRolesToUser(tabNumber, roleIds)
            runInAction(() => {
                this.fetchUserRoles(tabNumber)
            })
            return response
        } catch (error) {
            console.error('Ошибка при добавлении ролей пользователю:', error)
            throw error
        }
    }
}