import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

class VacationService {
  static async fetchAll(year) {
    const url = year
      ? `${API_URL}api/staff/vacation?year=${year}`
      : `${API_URL}api/staff/vacation`;
    const response = await axios.get(url);
    return response.data;
  }

  static async create(data) {
    const response = await axios.post(`${API_URL}api/staff/vacation`, data);
    return response.data;
  }

  static async update(id, data) {
    const response = await axios.put(
      `${API_URL}api/staff/vacation/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/staff/vacation/${id}`);
    return true;
  }
}

export default VacationService;
