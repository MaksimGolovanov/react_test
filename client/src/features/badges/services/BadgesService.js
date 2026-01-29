import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

class BadgesService {
  // Методы для работы с отделами
  static async fetchAllDepartments() {
    try {
      const response = await axios.get(`${API_URL}api/departments`)
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

  // Методы для работы с сотрудниками
  static async fetchStaff() {
    try {
      const response = await axios.get(`${API_URL}api/staff/`)
      return response.data
    } catch (error) {
      console.error('Staff fetch error:', error)
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

  static async fetchAllDolgnost() {
    try {
      const response = await axios.get(`${API_URL}api/staff/dolgnost`)
      return response.data
    } catch (error) {
      console.error('Dolgnost fetch error:', error.response || error)
      throw error
    }
  }
}

export default BadgesService