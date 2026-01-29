import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL
// Настройка axios
const instance = axios.create({
     baseURL: `${API_URL}api`,
     timeout: 5000, // Таймаут 5 секунд
})

class IusPtService {
     // Вспомогательный метод для выполнения запросов
     static request = async (method, url, data = null) => {
          try {
               const response = await instance({ method, url, data })
               return response.data
          } catch (error) {
               console.error(`Ошибка при выполнении запроса ${method.toUpperCase()} ${url}:`, error)
               throw error
          }
     }

     // Методы для работы с администраторами (IusSpravAdm)
     static fetchSignatures = async () => {
          return this.request('get', '/iuspt/adm')
     }

     static createSignatures = async (signatures) => {
          return this.request('post', '/iuspt/adm', signatures)
     }

     static updateSignatures = async (signatures) => {
          return this.request('put', '/iuspt/adm', signatures)
     }

     static deleteSignatures = async (id) => {
          return this.request('delete', `/iuspt/adm/${id}`)
     }

     // Методы для работы с ролями (IusSpravRoles)
     static fetchRoles = async () => {
          return this.request('get', '/iuspt/roles')
     }

     static createRole = async (role) => {
          return this.request('post', '/iuspt/roles', role)
     }

     static updateRole = async (role) => {
          return this.request('put', '/iuspt/roles', role)
     }

     static deleteRole = async (id) => {
          return this.request('delete', `/iuspt/roles/${id}`)
     }
     static bulkCreateRoles = async (roles) => {
          return this.request('post', '/iuspt/roles/bulk', roles)
     }

     // Методы для работы с пользователями ИУС (IusUser)
     static fetchIusUsers = async () => {
          return this.request('get', '/iuspt/users')
     }

     static createOrUpdateUser = async (user) => {
          return this.request('post', '/iuspt/users', user)
     }

     static deleteUser = async (id) => {
          return this.request('delete', `/iuspt/users/${id}`)
     }

     // Методы для работы со связями пользователей и ролей (IusUserRoles)
     static fetchUserRoles = async (tabNumber) => {
          return this.request('get', `/iuspt/user-roles/${tabNumber}`)
     }

     static createUserRole = async (userRole) => {
          return this.request('post', '/iuspt/user-roles', userRole)
     }

     static deleteUserRole = async (tabNumber, roleId) => {
          if (!tabNumber || !roleId) {
               throw new Error('Не указаны tabNumber или roleId')
          }
          return this.request('delete', `/iuspt/user-roles/${tabNumber}/${roleId}`)
     }

     static addRolesToUser = async (tabNumber, roleIds) => {
          return this.request('post', '/iuspt/user-roles/bulk', { tabNumber, roleIds })
     }

     // Методы для работы с сотрудниками и их связями с пользователями ИУС (Staff)
     static fetchStaffWithIusUser = async () => {
          return this.request('get', '/iuspt/staff-with-iususer')
     }
     static fetchStaffByTabNumber = async (tabNumber) => {
          return this.request('get', `/iuspt/staff-with-iususer-tabnumber/${tabNumber}`)
     }
     static fetchStaffWithIusUserSimple = async () => {
          return this.request('get', '/iuspt/staff-with-iususer-simple')
     }
     static fetchStaffWithIusUserSimpleOver = async () => {
          return this.request('get', '/iuspt/staff-with-iususer-simple-over')
     }

     static fetchStopRoles = async () => {
          return this.request('get', '/iuspt/stoproles')
     }
     static updateStopRole = async (id, stopRoleData) => {
          return this.request('put', `/iuspt/stoproles/${id}`, stopRoleData)
     }

     static deleteStopRole = async (id) => {
          return this.request('delete', `/iuspt/stoproles/${id}`)
     }
     static createStopRole = async (stopRoleData) => {
      return this.request('post', '/iuspt/stoproles', stopRoleData);
  }
}

export default IusPtService
