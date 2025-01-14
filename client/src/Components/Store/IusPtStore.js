import { makeAutoObservable, action, observable, computed } from 'mobx';
import IusPtService from '../IusPT/IusPtService';

class IusPtStore {
    users=[]

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


}


const iusPtStore = new IusPtStore();
export default iusPtStore;