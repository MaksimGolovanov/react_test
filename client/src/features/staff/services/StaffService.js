import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL

class StaffService {
     // Методы для работы с отделами
     static async fetchAllDepartments() {
          try {
               const response = await axios.get(`${API_URL}api/staff/departments`)
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

     static async createDepartment(newDepartment) {
          try {
              const response = await axios.post(`${API_URL}api/staff/departments`, newDepartment, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
              return response.data;
          } catch (error) {
              console.error('Create department error:', error.response?.data || error.message);
              throw error;
          }
      }

      static async updateDepartment(id, updatedData) {
          try {
              const response = await axios.put(
                  `${API_URL}api/staff/departments/${id}`,
                  updatedData,
                  {
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  }
              );
              return response.data;
          } catch (error) {
              console.error('Update department error:', error.response?.data || error.message);
              throw error;
          }
      }

     static async deleteDepartment(id) {
          try {
               await axios.delete(`${API_URL}api/staff/departments/${id}`)
               return true
          } catch (error) {
               console.error('Ошибка при удалении отдела:', error)
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

     static async createStaff(newStaff) {
          try {
               const response = await axios.post(`${API_URL}api/staff/`, newStaff)
               return response.data
          } catch (error) {
               console.error('Ошибка при создании сотрудника:', error)
               throw error
          }
     }

     static async updateStaff(updatedStaff) {
          try {
               await axios.put(`${API_URL}api/staff/${updatedStaff.tabNumber}`, updatedStaff)
          } catch (error) {
               console.error('Ошибка при изменении данных:', error)
               throw error
          }
     }

     static async deleteStaff(tabNumber) {
          try {
               await axios.delete(`${API_URL}api/staff/${tabNumber}`)
               return true
          } catch (error) {
               console.error('Ошибка при удалении сотрудника:', error)
               throw error
          }
     }
     static async importStaffData(staffData) {
          try {
            const response = await axios.post(`${API_URL}api/staff/import`, staffData);
            return response.data;
          } catch (error) {
            console.error("Ошибка при импорте данных:", error);
            throw error;
          }
        }
}

export default StaffService
