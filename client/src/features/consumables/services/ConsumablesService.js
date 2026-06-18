import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class ConsumablesService {
  static async fetchAll() {
    const response = await axios.get(`${API_URL}api/consumables`);
    return response.data;
  }

  static async getById(id) {
    const response = await axios.get(`${API_URL}api/consumables/${id}`);
    return response.data;
  }

  static async create(data) {
    const response = await axios.post(`${API_URL}api/consumables`, data);
    return response.data;
  }

  static async update(id, data) {
    const response = await axios.put(`${API_URL}api/consumables/${id}`, data);
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/consumables/${id}`);
    return true;
  }

  static async addMovement(id, movement) {
    const response = await axios.post(`${API_URL}api/consumables/${id}/movements`, movement);
    return response.data;
  }

  static async move(id, moveData) {
    const response = await axios.post(`${API_URL}api/consumables/${id}/move`, moveData);
    return response.data;
  }
}

export default ConsumablesService;