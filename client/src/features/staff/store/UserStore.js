import { makeAutoObservable, action } from 'mobx'
import StaffService from '../services/StaffService' // Заменяем AdminService на StaffService

class UserStore {
     users = [] // Список пользователей (сотрудников)
     loading = true // Флаг загрузки
     card = null

     constructor() {
          makeAutoObservable(this)
          this.fetchCardAll()
          this.loadAuthState() // Загружаем состояние аутентификации при инициализации
     }

     // Метод для получения списка сотрудников (пользователей)
     fetchUsers = action(async () => {
          try {
               this.loading = true
               const responseUsers = await StaffService.fetchStaff() // Используем метод из StaffService
               this.users = responseUsers
          } catch (error) {
               console.error('Ошибка при получении данных:', error)
          } finally {
               this.loading = false
          }
     })

     fetchCardAll = action(async () => {
          this.setLoading(true)
          try {
               const response = await StaffService.fetchCard()
               this.card = response
               this.error = null
          } catch (error) {
               this.error = error
               console.error('Ошибка при загрузке Карт:', error)
          } finally {
               this.setLoading(false)
          }
     })
}

const userStore = new UserStore()
export default userStore
