import { makeAutoObservable, action, runInAction, reaction } from 'mobx'
import IusPtService from '../services/IusPtService'

class IusPtStore {
     users = [] // Пользователи
     admins = [] // Администраторы
     roles = [] // Роли
     iusUsers = [] // Пользователи ИУС
     userRoles = [] // Роли пользователей
     staffWithIusUsers = [] // Сотрудники и их связи с пользователями ИУС
     stopRoles = []
     staffWithIusUsersSimple = []
     staffWithIusUsersSimpleOver = []

     constructor() {
          makeAutoObservable(this)
          this.fetchAdmins()
          this.fetchStopRoles()
     }

     // Общий метод для загрузки данных
     fetchData = action(async (fetchFunction, stateProperty, ...args) => {
          try {
               const response = await fetchFunction(...args)
               runInAction(() => {
                    this[stateProperty] = response // Изменение состояния внутри runInAction
               })
          } catch (error) {
               console.error(`Ошибка при получении данных (${stateProperty}):`, error)
          }
     })

     // Общий метод для создания/обновления данных
     createOrUpdateData = action(async (serviceFunction, fetchFunction, stateProperty, data) => {
          try {
               await serviceFunction(data)
               await this.fetchData(fetchFunction, stateProperty)
          } catch (error) {
               console.error(`Ошибка при создании/обновлении данных (${stateProperty}):`, error)
               throw error
          }
     })

     // Общий метод для удаления данных
     deleteData = action(async (serviceFunction, fetchFunction, stateProperty, tabNumber, ...args) => {
          try {
               await serviceFunction(tabNumber, ...args)
               await this.fetchData(fetchFunction, stateProperty)
          } catch (error) {
               console.error(`Ошибка при удалении данных (${stateProperty}):`, error)
               throw error
          }
     })

     addRolesToUser = action(async (tabNumber, roleIds) => {
          try {
               const response = await IusPtService.addRolesToUser(tabNumber, roleIds)
               runInAction(() => {
                    this.fetchUserRoles(tabNumber) // Перезагружаем роли пользователя
               })
               return response
          } catch (error) {
               console.error('Ошибка при добавлении ролей пользователю:', error)
               throw error
          }
     })

     // Методы для работы с администраторами
     fetchAdmins = () => this.fetchData(IusPtService.fetchAdmins, 'admins')
     createAdmin = (newAdmin) =>
          this.createOrUpdateData(IusPtService.createAdmin, IusPtService.fetchAdmins, 'admins', newAdmin)
     updateAdmin = (updatedAdmin) =>
          this.createOrUpdateData(IusPtService.updateAdmin, IusPtService.fetchAdmins, 'admins', updatedAdmin)
     deleteAdmin = (id) => this.deleteData(IusPtService.deleteAdmin, IusPtService.fetchAdmins, 'admins', id)

     // Методы для работы с ролями
     fetchRoles = () => this.fetchData(IusPtService.fetchRoles, 'roles')
     createRole = (newRole) =>
          this.createOrUpdateData(IusPtService.createRole, IusPtService.fetchRoles, 'roles', newRole)
     updateRole = (updatedRole) =>
          this.createOrUpdateData(IusPtService.updateRole, IusPtService.fetchRoles, 'roles', updatedRole)
     deleteRole = (id) => this.deleteData(IusPtService.deleteRole, IusPtService.fetchRoles, 'roles', id)
     bulkCreateRoles = action(async (roles) => {
          try {
               const response = await IusPtService.bulkCreateRoles(roles) // Отправляем данные на сервер
               runInAction(() => {
                    this.roles = [...this.roles, ...response] // Обновляем локальное состояние
               })
               return response
          } catch (error) {
               console.error('Ошибка при массовом создании ролей:', error)
               throw error
          }
     })
     // Методы для работы с пользователями ИУС
     fetchIusUsers = () => this.fetchData(IusPtService.fetchIusUsers, 'iusUsers')
     createOrUpdateUser = (user) =>
          this.createOrUpdateData(IusPtService.createOrUpdateUser, IusPtService.fetchIusUsers, 'iusUsers', user)
     deleteUser = (id) => this.deleteData(IusPtService.deleteUser, IusPtService.fetchIusUsers, 'iusUsers', id)

     // Методы для работы с ролями пользователей
     fetchUserRoles = (tabNumber) => this.fetchData(IusPtService.fetchUserRoles, 'userRoles', tabNumber)
     createUserRole = (userRole) =>
          this.createOrUpdateData(IusPtService.createUserRole, IusPtService.fetchUserRoles, 'userRoles', userRole)
     deleteUserRole = (tabNumber, roleId) =>
          this.deleteData(IusPtService.deleteUserRole, IusPtService.fetchUserRoles, 'userRoles', tabNumber, roleId)

     // Метод для загрузки сотрудников и их связей с пользователями ИУС
     fetchStaffWithIusUsers = () => this.fetchData(IusPtService.fetchStaffWithIusUser, 'staffWithIusUsers')

     fetchStaffByTabNumber = action(async (tabNumber) => {
          try {
               const response = await IusPtService.fetchStaffByTabNumber(tabNumber)

               // Всегда сохраняем как массив (даже если пришёл один объект)
               const resultData = Array.isArray(response) ? response : [response].filter(Boolean)

               runInAction(() => {
                    this.staffWithIusUsers = resultData
               })

               return resultData[0] || null // Возвращаем первый элемент или null
          } catch (error) {
               console.error('Ошибка при получении сотрудника:', error)
               throw error
          }
     })

     fetchStaffWithIusUserSimple = () =>
          this.fetchData(IusPtService.fetchStaffWithIusUserSimple, 'staffWithIusUsersSimple')
     fetchStaffWithIusUserSimpleOver = () =>
          this.fetchData(IusPtService.fetchStaffWithIusUserSimpleOver, 'staffWithIusUsersSimpleOver')
     fetchStopRoles = () => this.fetchData(IusPtService.fetchStopRoles, 'stopRoles')

     updateStopRole = action(async (id, stopRoleData) => {
          try {
               await IusPtService.updateStopRole(id, stopRoleData)
               await this.fetchStopRoles() // Обновляем список после изменения
          } catch (error) {
               console.error('Ошибка при обновлении стоп-роли:', error)
               throw error
          }
     })

     deleteStopRole = action(async (id) => {
          try {
               await IusPtService.deleteStopRole(id)
               await this.fetchStopRoles() // Обновляем список после удаления
          } catch (error) {
               console.error('Ошибка при удалении стоп-роли:', error)
               throw error
          }
     })
     createStopRole = action(async (stopRoleData) => {
          try {
               await IusPtService.createStopRole(stopRoleData)
               await this.fetchStopRoles() // Обновляем список после добавления
          } catch (error) {
               console.error('Ошибка при создании стоп-роли:', error)
               throw error
          }
     })

     // Вычисляемое свойство для получения уникальных значений `typename`
     get rolesTypes() {
          const uniqueTypes = [...new Set(this.roles.map((role) => role.typename))]
          return uniqueTypes
     }
}

const iusPtStore = new IusPtStore()
export default iusPtStore
