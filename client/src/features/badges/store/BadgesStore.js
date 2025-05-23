import { makeAutoObservable, action } from 'mobx';
import BadgesService from '../services/BadgesService'; // Заменяем AdminService на StaffService

class BadgesStore {
    users = []; // Список пользователей (сотрудников)
    loading = true; // Флаг загрузки
   

    constructor() {
        makeAutoObservable(this);
        this.loadAuthState(); // Загружаем состояние аутентификации при инициализации
    }

    // Метод для получения списка сотрудников (пользователей)
    fetchUsers = action(async () => {
        try {
            this.loading = true;
            const responseUsers = await BadgesService.fetchStaff(); // Используем метод из StaffService
            this.users = responseUsers;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        } finally {
            this.loading = false;
        }
    });


}

const userStore = new BadgesStore();
export default userStore;