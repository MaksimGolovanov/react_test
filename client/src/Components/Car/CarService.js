import axios from 'axios';

class CarService {

    static async fetchCar() {
        try {
            const response = await axios.get('http://localhost:5000/api/car');
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


}

export default CarService;