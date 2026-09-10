import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class PlacementService {
  static async create(data) {
    const response = await axios.post(`${API_URL}api/placements`, data);
    return response.data;
  }

  static async updateBatch(placements) {
    const response = await axios.put(
      `${API_URL}api/placements/batch`,
      placements
    );
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/placements/${id}`);
    return true;
  }
}

export default PlacementService;
