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

    static async addCar(newCar) {
        try {
            const response = await axios.post('http://localhost:5000/api/car/create', newCar);
            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            return response.data; // Возвращаем данные
        } catch (error) {
            console.error('Ошибка при добавлении автомобиля:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }


}

export default CarService;