import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
class PrintsService {
  static async fetchPrints() {
    try {
      const response = await axios.get(`${API_URL}api/print/`);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async fetchLocation() {
    try {
      const response = await axios.get(`${API_URL}api/print/location`)
      return response.data
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async fetchDepartmens() {
    try {
      const response = await axios.get(`${API_URL}api/print/department`);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async fetchPrintModel() {
    try {
      const response = await axios.get(`${API_URL}api/printmodels`)
      return response.data
    } catch (error) {
      throw error;
    }
  }

  static async fetchPrintStatistic(itemid) {
    
    try {
      const response = await axios.get(`${API_URL}/api/print/statistics/${itemid}`)
      
      return response.data
    } catch (error) {
      throw error;
    }
  }

 static async fetchPrint(id) {
    
     try {
       const response = await axios.get(`${API_URL}api/print/print/${id}`)
      
       return response.data
     } catch (error) {
       throw error;
     }
   }


  static async createPrintModel(formData) {
    try {
      const response = await axios.post(`${API_URL}api/printmodels`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании модели принтера:', error);
      throw error;
    }
  }
  static async createLocation(formData) {
    if (!formData || !formData.location) {
        throw new Error('Отсутствуют данные формы.');
    }

    try {
        const response = await axios.post(
            `${API_URL}api/print/location/`,
            formData
        );

        return response.data;
    } catch (error) {
        console.error('Ошибка при создании локации:', error.message);
        throw new Error(`Не удалось создать локацию: ${error.message}`);
    }
}

  static async deleteLocation(id) {
    try {
      const response = await axios.delete(`${API_URL}api/print/location/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении модели принтера:', error);
      throw error;
    }
  }

  static async deletePrint(id) {
    try {
      const response = await axios.delete(`${API_URL}api/print/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении модели принтера:', error);
      throw error;
    }
  }

  static async deletePrintModel(id) {
    try {
      const response = await axios.delete(`${API_URL}api/printmodels/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при удалении модели принтера:', error);
      throw error;
    }
  }
  // В PrintsService.js добавьте метод:
  static async createPrint(printData) {
    console.log(printData)
    try {
      const response = await axios.post(`${API_URL}api/print/`, {
        print_model: printData.print_model,
        logical_name: printData.logical_name,
        ip: printData.ip, 
        url: printData.url,
        department: printData.department,
        location: printData.location,
        serial_number: printData.serial_number
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании принтера:', error.response?.data || error.message);
      throw error;
    }
  }


  static async updatePrint(printData) {
    
    try {
      const response = await axios.put(`${API_URL}api/print/update`, {
        print_model: printData.print_model,
        logical_name: printData.logical_name,
        ip: printData.ip, 
        url: printData.url,
        department: printData.department,
        location: printData.location,
        serial_number: printData.serial_number,
        id: printData.id,
        status: printData.status
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании принтера:', error.response?.data || error.message);
      throw error;
    }
  }


}

export default PrintsService;