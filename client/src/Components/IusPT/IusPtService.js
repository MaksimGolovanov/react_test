import axios from 'axios';

class IusPtService {

    static async fetchUsers() {
        try {
          const response = await axios.get('http://localhost:5000/api/staff/');
          return response.data;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
}

export default IusPtService