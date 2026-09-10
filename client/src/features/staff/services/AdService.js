// services/AdService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class AdService {
  static async checkPasswordExpiry(
    adminUsername,
    adminPassword,
    targetUsername
  ) {
    const response = await axios.post(`${API_URL}api/ad/check-password`, {
      adminUsername,
      adminPassword,
      targetUsername,
    });
    return response.data;
  }
}

export default AdService;
