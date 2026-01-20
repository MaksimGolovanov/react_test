import { makeAutoObservable, action } from 'mobx'
import AdminService from '../services/AdminService'

class UserStore {
     users = []
     roles = []
     userRoles = []
     userRolesAuth = []
     loading = true
     isAuthenticated = false
     tabNumber = ''
     userName = ''

     constructor() {
          makeAutoObservable(this)

          this.loadAuthState() // Загружаем состояние аутентификации при инициализации
     }

     // Метод для сохранения состояния аутентификации
     saveAuthState = () => {
          try {
               localStorage.setItem('isAuthenticated', JSON.stringify(this.isAuthenticated))
               localStorage.setItem('userRolesAuth', JSON.stringify(this.userRolesAuth || []))
               localStorage.setItem('tabNumber', this.tabNumber || '')
               localStorage.setItem('userName', this.userName || '') // ДОБАВЬТЕ ЭТО
          } catch (error) {
               console.error('Error saving auth state:', error)
          }
     }
     // Метод для загрузки состояния аутентификации
     loadAuthState = () => {
          try {
               const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false')
               const userRolesAuthStr = localStorage.getItem('userRolesAuth')
               const tabNumber = localStorage.getItem('tabNumber') || ''
               const userName = localStorage.getItem('userName') || '' // ДОБАВЬТЕ ЭТО

               let userRolesAuth = []
               if (userRolesAuthStr) {
                    try {
                         userRolesAuth = JSON.parse(userRolesAuthStr)
                    } catch (e) {
                         console.error('Error parsing userRolesAuth:', e)
                    }
               }

               this.isAuthenticated = isAuthenticated
               this.userRolesAuth = Array.isArray(userRolesAuth) ? userRolesAuth : []
               this.tabNumber = tabNumber
               this.userName = userName // ДОБАВЬТЕ ЭТО
          } catch (error) {
               console.error('Error loading auth state:', error)
               this.isAuthenticated = false
               this.userRolesAuth = []
               this.tabNumber = ''
               this.userName = ''
          }
     }

     // Метод для получения пользователей обернут в action
     // Метод для получения пользователей обернут в action
     fetchUsers = action(async () => {
          try {
               this.loading = true
               const responseUsers = await AdminService.fetchUser()
               const responseRoles = await AdminService.fetchRole()
               const responseUserRole = await AdminService.fetchRoleUser()




               

               // Найти текущего пользователя в списке по логину
               const currentUserLogin = this.userName || localStorage.getItem('userName') || ''
               

               let currentUser = null

               // Ищем разными способами
               for (const user of responseUsers) {
                    if (user.login === currentUserLogin) {
                         currentUser = user
                         
                         break
                    }
               }

               // Если не нашли, ищем по другим полям
               if (!currentUser) {
                    for (const user of responseUsers) {
                         if (
                              user.username === currentUserLogin ||
                              user.email === currentUserLogin ||
                              (user.name && user.name.toLowerCase() === currentUserLogin.toLowerCase())
                         ) {
                              currentUser = user
                              
                              break
                         }
                    }
               }

               if (currentUser) {
                    

                    // Обновляем данные ТОЛЬКО если они есть
                    if (currentUser.tabNumber && currentUser.tabNumber !== currentUserLogin) {
                         this.tabNumber = currentUser.tabNumber
                         
                    }

                    if (currentUser.name && currentUser.name !== currentUserLogin) {
                         this.userName = currentUser.name
                         
                    }

                    this.saveAuthState()
               } else {
                    console.log('Current user NOT found in users list')
               }

               this.users = responseUsers
               this.roles = responseRoles
               this.userRoles = responseUserRole
          } catch (error) {
               console.error('Ошибка при получении данных:', error)
          } finally {
               this.loading = false
          }
     })

     // Метод для аутентификации обернут в action
     // Метод для аутентификации обернут в action
     // Метод для аутентификации обернут в action
     login = action(async (login, password) => {
          try {
               const result = await AdminService.login({ login, password })


               if (result.user) {


                    // Проверяем ВСЕ поля объекта user
                    for (const [key, value] of Object.entries(result.user)) {
                         console.log(`User field "${key}":`, value, `(type: ${typeof value})`)
                    }
               } else {
                    console.log('No user object in response')
                    console.log('Available data:', result)
               }


               this.isAuthenticated = true

               // Получаем роли (проверяем разные варианты)
               if (result.user?.roleNames) {
                    this.userRolesAuth = result.user.roleNames
               } else if (result.user?.roles) {
                    this.userRolesAuth = result.user.roles
               } else if (result.roleNames) {
                    this.userRolesAuth = result.roleNames
               } else if (result.roles) {
                    this.userRolesAuth = result.roles
               } else {
                    this.userRolesAuth = []
               }

               // КРИТИЧНОЕ ИСПРАВЛЕНИЕ: Проверяем данные пользователя из ответа сервера
               // Используем данные из ответа сервера в приоритете
               let tabNumberValue = ''
               let userNameValue = login // По умолчанию используем логин

               // Проверяем tabNumber
               if (result.user?.tabNumber) {
                    tabNumberValue = result.user.tabNumber
                   
               } else if (result.tabNumber) {
                    tabNumberValue = result.tabNumber
                    
               } else {
                    // Если в ответе сервера нет tabNumber, пробуем использовать логин
                    tabNumberValue = login
                    
               }

               // Проверяем userName/name
               if (result.user?.name) {
                    userNameValue = result.user.name
                   
               } else if (result.user?.userName) {
                    userNameValue = result.user.userName
                    
               } else if (result.name) {
                    userNameValue = result.name
                   
               } else if (result.userName) {
                    userNameValue = result.userName
                   
               }

               this.tabNumber = tabNumberValue
               this.userName = userNameValue



               this.saveAuthState()

               // Вызываем fetchUsers для получения полного списка пользователей
               // (опционально, можно отложить до необходимости)
               // await this.fetchUsers()

               return true
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

     // Метод для выхода обернут в action
     logout = action(() => {
          this.isAuthenticated = false
          this.userRolesAuth = []
          this.tabNumber = ''
          this.userName = ''

          // Полная очистка localStorage
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('userRolesAuth')
          localStorage.removeItem('tabNumber')
          localStorage.removeItem('userName')
     })

     // Метод для создания пользователя обернут в action
     createUser = action(async (login, password, selectedRoles, description, tabNumber) => {
          try {


               const result = await AdminService.registration({
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

     // Метод для обновления пользователя обернут в action
     updateUser = action(async (userId, userData) => {
          try {
               this.loading = true
               await AdminService.updateUser(userId, {
                    // Убрали переменную result, так как она не используется
                    login: userData.login,
                    password: userData.password,
                    description: userData.description,
                    roles: userData.roles,
                    tabNumber: userData.tabNumber,
               })

               await this.fetchUsers() // Обновляем список пользователей
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

     // Метод для удаления пользователя обернут в action
     deleteUser = action(async (userId) => {
          try {
               await AdminService.deleteUser(userId)
               await this.fetchUsers() // Принудительная перезагрузка списка пользователей
          } catch (error) {
               console.error('Ошибка при удалении пользователя:', error)
          }
     })

     // Удаление роли из пользователя обернут в action
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
                    await this.fetchUsers() // Обновляем список пользователей
               } catch (error) {
                    console.error('Ошибка при удалении роли:', error)
               }
          }
     })

     // Метод для получения ролей обернут в action
     fetchRoles = action(async () => {
          try {
               const responseRoles = await AdminService.fetchRole()
               this.roles = responseRoles // Обновляем роли
          } catch (error) {
               console.error('Ошибка при получении ролей:', error)
          }
     })

     // Метод для создания роли обернут в action
     createRole = action(async (newRole) => {
          try {
               await AdminService.createRole(newRole)
               await this.fetchRoles() // Обновляем список ролей
          } catch (error) {
               console.error('Ошибка при создании роли:', error)
          }
     })
}

const userStore = new UserStore()
export default userStore
