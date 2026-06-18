// features/admin/store/UserStore.js
import { makeAutoObservable, action, runInAction } from 'mobx'
import AdminService from '../services/AdminService'

class UserStore {
  users = []
  roles = []
  userRoles = []
  userRolesAuth = []
  loading = true
  initialized = false
  isAuthenticated = false
  tabNumber = ''
  userName = ''
  error = null

  constructor() {
    makeAutoObservable(this)
    this.initAuth()
  }

  initAuth = async () => {
    this.loading = true
    try {
      // Загружаем сохраненное состояние
      const savedAuth = localStorage.getItem('auth_data')
      if (savedAuth) {
        const data = JSON.parse(savedAuth)
        this.isAuthenticated = data.isAuthenticated || false
        this.userRolesAuth = data.userRolesAuth || []
        this.tabNumber = data.tabNumber || ''
        this.userName = data.userName || ''
      }

      // Если есть данные пользователя в localStorage, загружаем полные данные
      if (this.isAuthenticated && this.userName) {
        await this.fetchUsers()
      } else {
        runInAction(() => {
          this.initialized = true
          this.loading = false
        })
      }
    } catch (error) {
      console.error('Init auth error:', error)
      runInAction(() => {
        this.error = error.message
        this.initialized = true
        this.loading = false
      })
    }
  }

  saveAuthState = () => {
    try {
      const authData = {
        isAuthenticated: this.isAuthenticated,
        userRolesAuth: this.userRolesAuth || [],
        tabNumber: this.tabNumber || '',
        userName: this.userName || ''
      }
      localStorage.setItem('auth_data', JSON.stringify(authData))
    } catch (error) {
      console.error('Error saving auth state:', error)
    }
  }

  fetchUsers = action(async () => {
    try {
      this.loading = true
      this.error = null
      
      const responseUsers = await AdminService.fetchUser()
      const responseRoles = await AdminService.fetchRole()
      const responseUserRole = await AdminService.fetchRoleUser()

      // Найти текущего пользователя
      const currentUserLogin = this.userName || localStorage.getItem('userName') || ''
      let currentUser = null

      for (const user of responseUsers) {
        if (user.login === currentUserLogin || user.tabNumber === currentUserLogin) {
          currentUser = user
          break
        }
      }

      if (currentUser) {
        if (currentUser.tabNumber) this.tabNumber = currentUser.tabNumber
        if (currentUser.name) this.userName = currentUser.name
        if (currentUser.roles) {
          this.userRolesAuth = currentUser.roles.map(r => r.role || r)
        }
        this.saveAuthState()
      }

      runInAction(() => {
        this.users = responseUsers
        this.roles = responseRoles
        this.userRoles = responseUserRole
        this.initialized = true
      })
    } catch (error) {
      console.error('Ошибка при получении данных:', error)
      runInAction(() => {
        this.error = error.message || 'Ошибка загрузки данных'
        this.initialized = true
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  })

  login = action(async (login, password) => {
    try {
      const result = await AdminService.login({ login, password })

      if (result.user) {
        this.isAuthenticated = true

        // Получаем роли
        if (result.user.roleNames) {
          this.userRolesAuth = result.user.roleNames
        } else if (result.user.roles) {
          this.userRolesAuth = result.user.roles.map(r => r.role || r)
        } else if (result.roleNames) {
          this.userRolesAuth = result.roleNames
        } else {
          this.userRolesAuth = []
        }

        this.tabNumber = result.user.tabNumber || login
        this.userName = result.user.name || result.user.userName || login
        
        this.saveAuthState()

        // Загружаем полные данные пользователей
        await this.fetchUsers()

        return true
      }
      return false
    } catch (error) {
      console.error('Ошибка при входе:', error)
      this.isAuthenticated = false
      this.userRolesAuth = []
      this.tabNumber = ''
      this.userName = ''
      this.saveAuthState()
      return false
    }
  })

  logout = action(() => {
    this.isAuthenticated = false
    this.userRolesAuth = []
    this.tabNumber = ''
    this.userName = ''
    this.initialized = false
    this.users = []
    this.roles = []
    this.userRoles = []
    this.error = null
    localStorage.removeItem('auth_data')
  })

  createUser = action(async (login, password, selectedRoles, description, tabNumber) => {
    try {
      await AdminService.registration({
        login,
        password,
        roles: selectedRoles,
        description,
        tabNumber,
      })
      await this.fetchUsers()
      return true
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error)
      let errorMessage = 'Ошибка при создании пользователя'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      alert(errorMessage)
      return false
    }
  })

  updateUser = action(async (userId, userData) => {
    try {
      this.loading = true
      await AdminService.updateUser(userId, {
        login: userData.login,
        password: userData.password,
        description: userData.description,
        roles: userData.roles,
        tabNumber: userData.tabNumber,
      })
      await this.fetchUsers()
      return true
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error)
      let errorMessage = 'Ошибка при обновлении пользователя'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      alert(errorMessage)
      return false
    } finally {
      this.loading = false
    }
  })

  deleteUser = action(async (userId) => {
    try {
      await AdminService.deleteUser(userId)
      await this.fetchUsers()
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error)
    }
  })

  removeRole = action(async (userId, role) => {
    const foundRole = this.roles.find((r) => r.role === role)
    if (!foundRole) {
      console.error(`Роль с названием "${role}" не найдена.`)
      return
    }
    const roleId = foundRole.id
    if (window.confirm(`Вы уверены, что хотите удалить роль с ID ${roleId} у пользователя с ID ${userId}?`)) {
      try {
        await AdminService.removeRoleFromUser(userId, roleId)
        await this.fetchUsers()
      } catch (error) {
        console.error('Ошибка при удалении роли:', error)
      }
    }
  })

  fetchRoles = action(async () => {
    try {
      const responseRoles = await AdminService.fetchRole()
      this.roles = responseRoles
    } catch (error) {
      console.error('Ошибка при получении ролей:', error)
    }
  })

  createRole = action(async (newRole) => {
    try {
      await AdminService.createRole(newRole)
      await this.fetchRoles()
      return true
    } catch (error) {
      console.error('Ошибка при создании роли:', error)
      return false
    }
  })
}

const userStore = new UserStore()
export default userStore