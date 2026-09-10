import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class FloorPlanService {
  static async fetchAll() {
    const response = await axios.get(`${API_URL}api/floorplans`);
    return response.data;
  }

  static async fetchWithDevices(id) {
    const response = await axios.get(
      `${API_URL}api/floorplans/${id}/placements`
    );
    return response.data; // { plan, placements: [{ id, device, x, y, rotation, scale }] }
  }

  static async create(data, imageFile) {
    const formData = new FormData();
    formData.append('buildingName', data.buildingName);
    formData.append('floor', data.floor);
    if (imageFile) formData.append('image', imageFile);
    const response = await axios.post(`${API_URL}api/floorplans`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  static async update(id, data, imageFile) {
    const formData = new FormData();
    if (data.buildingName) formData.append('buildingName', data.buildingName);
    if (data.floor) formData.append('floor', data.floor);
    if (imageFile) formData.append('image', imageFile);
    const response = await axios.put(
      `${API_URL}api/floorplans/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  }

  static async delete(id) {
    await axios.delete(`${API_URL}api/floorplans/${id}`);
    return true;
  }
}

export default FloorPlanService;
