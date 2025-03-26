import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
class StaffService {
  static async fetchStaff() {
    try {
      const response = await axios.get(`${API_URL}api/staff/`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchDepartment() {
    try {
      const response = await axios.get(`${API_URL}api/staff/department`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateStaff(updatedStaff) {
    try {
      await axios.put(`${API_URL}api/staff/${updatedStaff.tabNumber}`, updatedStaff);
      
    } catch (error) {
      console.error("Ошибка при изменении данных:", error);
      throw error;
    }
  }


  static async createUser(newUser) {
    try {
      await axios.post(`${API_URL}api/user`, newUser);
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      throw error;
    }
  }
  static async deleteStaff(tabNumber) {
    try {
      await axios.delete(`${API_URL}api/staff/${tabNumber}`);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      throw error;
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

export default StaffService;