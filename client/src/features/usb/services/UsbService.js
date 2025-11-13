import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

class UsbService {
     static async fetchUsb() {
          try {
               const response = await axios.get(`${API_URL}api/usb`)
               return response.data
          } catch (error) {
               console.error('Ошибка при получении', error)
               throw error
          }
     }

     static async sendReminders() {
          try {
               const response = await axios.post(`${API_URL}api/usb/send-reminders`)
               return response
          } catch (error) {
               console.error('Ошибка при отправке уведомлений', error)
               throw error
          }
     }

     static async createUsb(data) {
          try {
               const response = await axios.post(`${API_URL}api/usb`, data)
               return response.data
          } catch (error) {
               console.error('Ошибка при создании', error)
               throw error
          }
     }

     static async updateUsb(id, data) {
          try {
               const response = await axios.put(`${API_URL}api/usb/${id}`, data)
               return response.data
          } catch (error) {
               console.error('Ошибка при обновлении', error)
               throw error
          }
     }

     static async deleteUsb(id) {
          try {
               const response = await axios.delete(`${API_URL}api/usb/${id}`)
               return response.data
          } catch (error) {
               console.error('Ошибка при удалении', error)
               throw error
          }
     }
          static async fetchStaff() {
          try {
               const response = await axios.get(`${API_URL}api/staff/`)
               return response.data
          } catch (error) {
               console.error(error)
               throw error
          }
     }
}

export default UsbService
