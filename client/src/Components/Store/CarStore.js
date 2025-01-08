import { makeAutoObservable, action } from 'mobx';
import CarService from '../Car/CarService';

class CarStore {
    cars = [];


    constructor() {
        makeAutoObservable(this);
    }

    fetchCars = action(async () => {
        try {
            
            const responseCars = await CarService.fetchCar();
            
            
            this.cars = responseCars;
           
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            this.loading = false;
        }
    });



    
}

const carStore = new CarStore();
export default carStore;