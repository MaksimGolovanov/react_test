import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class BackgroundService {
  static async fetchAll() {
    const response = await axios.get(`${API_URL}api/backgrounds`);
    return response.data;
  }

  static async getOne(id) {
    const response = await axios.get(`${API_URL}api/backgrounds/${id}`);
    return response.data;
  }

  static async upload(formData) {
    const response = await axios.post(
      `${API_URL}api/backgrounds/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  }

  static async update(id, data) {
    const response = await axios.put(`${API_URL}api/backgrounds/${id}`, data);
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/backgrounds/${id}`);
    return true;
  }
}

export default BackgroundService;
