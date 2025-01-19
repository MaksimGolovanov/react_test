import { makeAutoObservable, action, observable, computed } from 'mobx';
import CarService from '../services/CarService';

class CarStore {
    cars = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            cars: observable,
            loading: observable,
            error: observable,
            fetchCars: action.bound,
            createCar: action.bound,
        });
    }

    get isLoading() {
        return this.loading;
    }

    get hasError() {
        return !!this.error;
    }

    fetchCars = action(async () => {
        this.loading = true;
        this.error = null;
    
        try {
            const response = await CarService.fetchCar();
            if (!response) {
                throw new Error('Ответ пустой'); // Проверка на пустой ответ
            }
            this.cars = response; // Сохраняем данные
        } catch (error) {
            this.error = error.message || 'Что-то пошло не так.';
        } finally {
            this.loading = false;
        }
    });

    createCar = action(async (newCar) => {
        this.loading = true;
        this.error = null;
     
        try {
            const response = await CarService.addCar(newCar);
            this.cars.push(response); // Добавляем новый автомобиль в список
        } catch (error) {
            this.error = error.message || 'Что-то пошло не так.';
        } finally {
            this.loading = false;
        }
    });
}

const carStore = new CarStore();
export default carStore;