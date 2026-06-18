import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

class PositionAccessService {
  static async fetchAll() {
    const response = await axios.get(`${API_URL}api/position-access`);
    return response.data;
  }

  static async create(data) {
    const response = await axios.post(`${API_URL}api/position-access`, data);
    return response.data;
  }

  static async update(id, data) {
    const response = await axios.put(
      `${API_URL}api/position-access/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/position-access/${id}`);
    return true;
  }

  static async fetchByStaff(departmentCode, dolgnostName) {
    const response = await axios.get(`${API_URL}api/position-access/by-staff`, {
      params: { departmentCode, dolgnostName },
    });
    return response.data;
  }
}

export default PositionAccessService;
