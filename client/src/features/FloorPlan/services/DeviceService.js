import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class DeviceService {
  static async fetchAll() {
    const response = await axios.get(`${API_URL}api/devices`);
    return response.data;
  }

  static async create(data) {
    const response = await axios.post(`${API_URL}api/devices`, data);
    return response.data;
  }

  static async update(id, data) {
    const response = await axios.put(`${API_URL}api/devices/${id}`, data);
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/devices/${id}`);
    return true;
  }
}

export default DeviceService;
