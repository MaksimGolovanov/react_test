import { makeAutoObservable, action } from 'mobx'
import CardService from '../services/CardService'

class CardStore {
     card = null
     error = null
     staff = null
     isLoading = false
   

     constructor() {
          makeAutoObservable(this)
          this.fetchCardAll()
          this.fetchStaffAll()
     }

     // Устанавливаем loading состояние
     setLoading = action((state) => {
          this.isLoading = state
     })

     // Устанавливаем sending состояние
     setSending = action((state) => {
          this.isSending = state
     })

     // Загрузка всех USB-накопителей
     fetchCardAll = action(async () => {
          this.setLoading(true)
          try {
               const response = await CardService.fetchCard()
               this.card = response
               this.error = null
          } catch (error) {
               this.error = error
               console.error('Ошибка при загрузке Карт:', error)
          } finally {
               this.setLoading(false)
          }
     })

     fetchStaffAll = action(async () => {
          this.setLoading(true)
          try {
               const response = await CardService.fetchStaff()
               this.staff = response
               this.error = null
          } catch (error) {
               this.error = error
               console.error('Ошибка при загрузке списка карт:', error)
          } finally {
               this.setLoading(false)
          }
     })

     // Создание нового USB-накопителя
     createCard = action(async (data) => {
          try {
               await CardService.createCard(data)
               await this.fetchCardAll()
               return true
          } catch (error) {
               this.error = error
               console.error('Ошибка при создании карты:', error)
               return false
          }
     })

     // Обновление USB-накопителя
     updateCard = action(async (id, data) => {
          try {
               await CardService.updateCard(id, data)
               await this.fetchCardAll()
               return true
          } catch (error) {
               this.error = error
               console.error('Ошибка при обновлении карты доступа:', error)
               return false
          }
     })

     // Удаление USB-накопителя
     deleteCard = action(async (id) => {
          try {
               await CardService.deleteCard(id)
               await this.fetchCardAll()
               return true
          } catch (error) {
               this.error = error
               console.error('Ошибка при удалении карты доступа:', error)
               return false
          }
     })

    
}

const cardStore = new CardStore()
export default cardStore
