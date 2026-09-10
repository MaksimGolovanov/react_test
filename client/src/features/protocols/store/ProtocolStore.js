// src/features/protocols/store/ProtocolStore.js
import { makeAutoObservable, action } from 'mobx';
import ProtocolService from '../services/ProtocolService';

class ProtocolStore {
  protocols = null;
  error = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchProtocolsAll();
  }

  setLoading = action((state) => {
    this.isLoading = state;
  });

  fetchProtocolsAll = action(async () => {
    this.setLoading(true);
    try {
      const response = await ProtocolService.fetchProtocols();
      this.protocols = response;
      this.error = null;
    } catch (error) {
      this.error = error;
      console.error('Ошибка загрузки протоколов:', error);
    } finally {
      this.setLoading(false);
    }
  });

  createProtocol = action(async (data) => {
    try {
      await ProtocolService.createProtocol(data);
      await this.fetchProtocolsAll();
      return true;
    } catch (error) {
      this.error = error;
      return false;
    }
  });

  updateProtocol = action(async (id, data) => {
    try {
      await ProtocolService.updateProtocol(id, data);
      await this.fetchProtocolsAll();
      return true;
    } catch (error) {
      this.error = error;
      return false;
    }
  });

  deleteProtocol = action(async (id) => {
    try {
      await ProtocolService.deleteProtocol(id);
      await this.fetchProtocolsAll();
      return true;
    } catch (error) {
      this.error = error;
      return false;
    }
  });
}

const protocolStore = new ProtocolStore();
export default protocolStore;
