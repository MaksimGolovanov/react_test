import { makeAutoObservable, action } from 'mobx'
import IpService from '../services/IpService'

class IpStore {
    ipaddress = null
    error = null
    isLoading = false

    constructor() {
        makeAutoObservable(this)
        this.fetchIpAll()
    }
    
    fetchIpAll = action(async () => {
        this.isLoading = true;
        try {
            const response = await IpService.fetchIp();
            this.ipaddress = response;
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    });

    createIp = action(async (data) => {
        try {
            await IpService.createIp(data);
            await this.fetchIpAll(); // Обновляем список после добавления
        } catch (error) {
            this.error = error;
        }
    });

    updateIp = action(async (id, data) => {
        try {
            await IpService.updateIp(id, data);
            await this.fetchIpAll(); // Обновляем список после изменения
        } catch (error) {
            this.error = error;
        }
    });

    deleteIp = action(async (id) => {
        try {
            await IpService.deleteIp(id);
            await this.fetchIpAll(); // Обновляем список после удаления
        } catch (error) {
            this.error = error;
        }
    });
}

const ipStore = new IpStore();
export default ipStore;