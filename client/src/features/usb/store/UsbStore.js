import { makeAutoObservable, action } from 'mobx'
import UsbService from '../services/UsbService'

class UsbStore {
     usb = null
     error = null
     staff = null
     isLoading = false
     isSending = false // Добавляем отдельное состояние для отправки уведомлений

     constructor() {
          makeAutoObservable(this)
          this.fetchUsbAll()
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
     fetchUsbAll = action(async () => {
          this.setLoading(true)
          try {
               const response = await UsbService.fetchUsb()
               this.usb = response
               this.error = null
          } catch (error) {
               this.error = error
               console.error('Ошибка при загрузке USB-накопителей:', error)
          } finally {
               this.setLoading(false)
          }
     })

     fetchStaffAll = action(async () => {
          this.setLoading(true)
          try {
               const response = await UsbService.fetchStaff()
               this.staff = response
               this.error = null
          } catch (error) {
               this.error = error
               console.error('Ошибка при загрузке USB-накопителей:', error)
          } finally {
               this.setLoading(false)
          }
     })

     // Создание нового USB-накопителя
     createUsb = action(async (data) => {
          try {
               await UsbService.createUsb(data)
               await this.fetchUsbAll()
               return true
          } catch (error) {
               this.error = error
               console.error('Ошибка при создании USB-накопителя:', error)
               return false
          }
     })

     // Обновление USB-накопителя
     updateUsb = action(async (id, data) => {
          try {
               await UsbService.updateUsb(id, data)
               await this.fetchUsbAll()
               return true
          } catch (error) {
               this.error = error
               console.error('Ошибка при обновлении USB-накопителя:', error)
               return false
          }
     })

     // Удаление USB-накопителя
     deleteUsb = action(async (id) => {
          try {
               await UsbService.deleteUsb(id)
               await this.fetchUsbAll()
               return true
          } catch (error) {
               this.error = error
               console.error('Ошибка при удалении USB-накопителя:', error)
               return false
          }
     })

     // Отправка уведомлений
     sendReminders = action(async () => {
          this.setSending(true)
          try {
               const response = await UsbService.sendReminders()
               this.error = null
               return response.data // Убедитесь, что это response.data
          } catch (error) {
               this.error = error.response?.data || error
               console.error('Ошибка при отправке уведомлений:', error)
               throw error
          } finally {
               this.setSending(false)
          }
     })
}

const usbStore = new UsbStore()
export default usbStore
