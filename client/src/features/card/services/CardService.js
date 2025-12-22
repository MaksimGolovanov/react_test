import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

class CardService {
     static async fetchCard() {
          try {
               const response = await axios.get(`${API_URL}api/card`)
               return response.data
          } catch (error) {
               console.error('Ошибка при получении', error)
               throw error
          }
     }



     static async createCard(data) {
          try {
               const response = await axios.post(`${API_URL}api/card`, data)
               return response.data
          } catch (error) {
               console.error('Ошибка при создании', error)
               throw error
          }
     }

     static async updateCard(id, data) {
          try {
               const response = await axios.put(`${API_URL}api/card/${id}`, data)
               return response.data
          } catch (error) {
               console.error('Ошибка при обновлении', error)
               throw error
          }
     }

     static async deleteCard(id) {
          try {
               const response = await axios.delete(`${API_URL}api/card/${id}`)
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

export default CardService
