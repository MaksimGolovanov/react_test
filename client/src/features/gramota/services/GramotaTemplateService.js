import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class GramotaTemplateService {
  static async fetchAll() {
    const response = await axios.get(`${API_URL}api/gramota-templates`);
    return response.data;
  }

  static async getOne(id) {
    const response = await axios.get(`${API_URL}api/gramota-templates/${id}`);
    return response.data;
  }

  static async create(data) {
    const response = await axios.post(`${API_URL}api/gramota-templates`, data);
    return response.data;
  }

  static async update(id, data) {
    const response = await axios.put(`${API_URL}api/gramota-templates/${id}`, data);
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/gramota-templates/${id}`);
    return true;
  }

  static async setActive(id) {
    const response = await axios.patch(`${API_URL}api/gramota-templates/${id}/activate`);
    return response.data;
  }
}

export default GramotaTemplateService;