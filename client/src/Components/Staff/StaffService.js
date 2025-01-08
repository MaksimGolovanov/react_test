import axios from 'axios';

class StaffService {
  static async fetchStaff() {
    try {
      const response = await axios.get('http://localhost:5000/api/staff/');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchDepartment() {
    try {
      const response = await axios.get('http://localhost:5000/api/staff/department');
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateStaff(updatedStaff) {
    try {
      await axios.put(`http://localhost:5000/api/staff/${updatedStaff.id}`, updatedStaff);
      
    } catch (error) {
      console.error("Ошибка при изменении данных:", error);
      throw error;
    }
  }


  static async createUser(newUser) {
    try {
      await axios.post('http://localhost:5000/api/user', newUser);
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      throw error;
    }
  }
  static async deleteStaff(id) {
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      throw error;
    }
  }
  static async importStaffData(staffData) {
    try {
      const response = await axios.post('http://localhost:5000/api/staff/import', staffData);
      return response.data;
    } catch (error) {
      console.error("Ошибка при импорте данных:", error);
      throw error;
    }
  }



}

export default StaffService;