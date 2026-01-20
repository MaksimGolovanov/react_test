import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

class StaffService {
     // Методы для работы с отделами
     static async fetchAllDepartments() {
          try {
               const response = await axios.get(`${API_URL}api/departments`)
               console.log('Departments response:', response)
               return response.data
          } catch (error) {
               console.error('Department fetch error:', error.response || error)
               throw error
          }
     }

     static async fetchDepartmentById(id) {
          try {
               const response = await axios.get(`${API_URL}api/departments/${id}`)
               return response.data
          } catch (error) {
               console.error('Ошибка при получении отдела:', error)
               throw error
          }
     }

    

     // Методы для работы с сотрудниками (оставлены, если нужны)
     static async fetchStaff() {
          try {
               const response = await axios.get(`${API_URL}api/staff/`)
               return response.data
          } catch (error) {
               console.error(error)
               throw error
          }
     }

     
     static async importStaffData(staffData) {
          try {
               const response = await axios.post(`${API_URL}api/staff/import`, staffData)
               return response.data
          } catch (error) {
               console.error('Ошибка при импорте данных:', error)
               throw error
          }
     }

     static async fetchAllDolgnost() {
          try {
               const response = await axios.get(`${API_URL}api/staff/dolgnost`)
               console.log('Dolgnost response:', response)
               return response.data
          } catch (error) {
               console.error('Dolgnost fetch error:', error.response || error)
               throw error
          }
     }

     static async fetchDolgnostById(id) {
          try {
               const response = await axios.get(`${API_URL}api/dolgnost/${id}`)
               return response.data
          } catch (error) {
               console.error('Ошибка при получении должности:', error)
               throw error
          }
     }

     

    
}

export default StaffService
