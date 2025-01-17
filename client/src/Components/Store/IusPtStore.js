import { makeAutoObservable, action, observable, computed } from 'mobx';
import IusPtService from '../IusPT/IusPtService';

class IusPtStore {
    users=[]
    admin=[]

    constructor() {
        makeAutoObservable(this);
    }

    fetchUsers = action(async () => {
        try {
            
            const responseUsers = await IusPtService.fetchUsers();
                        
            this.users = responseUsers;
            
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } 
    });

    fetchAdmin = action(async () => {
        try {
            const responseUsers = await IusPtService.fetchIusAdm();
                        
            this.admin = responseUsers;
            
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }

    })

    createAdm = action(async (newAdm) => {
        try {
            await IusPtService.createAdm(newAdm);
            await this.fetchAdmin(); // Обновляем список ролей
        } catch (error) {
            console.error('Ошибка при создании роли:', error);
        }
    });

    updateAdm = action(async (updatedAdm) => {
        try {
            await IusPtService.updateAdm(updatedAdm); // Используем метод updateAdm из сервиса
            await this.fetchAdmin(); // Обновляем список администраторов
        } catch (error) {
            console.error('Ошибка при обновлении администратора:', error);
            throw error; // Пробрасываем ошибку для обработки в компоненте
        }
    });



}


const iusPtStore = new IusPtStore();
export default iusPtStore;