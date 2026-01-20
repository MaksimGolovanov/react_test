import { makeAutoObservable, action } from 'mobx'
import StaffService from '../api/StaffService' 

class UserStore {
     staff = [] // Список пользователей (сотрудников)
     

     constructor() {
          makeAutoObservable(this)
          this.fetchStaff()
          
     }

     // Метод для получения списка сотрудников (пользователей)
     fetchStaff = action(async () => {
          try {
               const responseUsers = await StaffService.fetchStaff() // Используем метод из StaffService
               this.staff = responseUsers
          } catch (error) {
               console.error('Ошибка при получении данных:', error)
          } 
     })

     
}

const userStore = new UserStore()
export default userStore
