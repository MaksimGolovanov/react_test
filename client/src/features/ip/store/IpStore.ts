// src/modules/IpAddress/store/IpStore.ts
import { makeAutoObservable, action } from 'mobx';
import IpService from '../services/IpService';
import { IpAddress, IpAddressInput } from '../types/ip.types';

class IpStore {
  ipaddress: IpAddress[] | null = null;
  error: Error | null = null;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchIpAll();
  }

  fetchIpAll = action(async () => {
    this.isLoading = true;
    try {
      const response = await IpService.fetchIp();
      this.ipaddress = response;
      this.error = null;
    } catch (error) {
      this.error = error as Error;
    } finally {
      this.isLoading = false;
    }
  });

  createIp = action(async (data: IpAddressInput) => {
    try {
      await IpService.createIp(data);
      await this.fetchIpAll();
    } catch (error) {
      this.error = error as Error;
    }
  });

  updateIp = action(async (id: number, data: IpAddressInput) => {
    try {
      await IpService.updateIp(id, data);
      await this.fetchIpAll();
    } catch (error) {
      this.error = error as Error;
    }
  });

  deleteIp = action(async (id: number) => {
    try {
      await IpService.deleteIp(id);
      await this.fetchIpAll();
    } catch (error) {
      this.error = error as Error;
    }
  });
}

const ipStore = new IpStore();
export default ipStore;