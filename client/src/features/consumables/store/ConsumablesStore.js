import { makeAutoObservable } from 'mobx';
import ConsumablesService from '../services/ConsumablesService';

class ConsumablesStore {
  items = [];
  loading = false;
  initialized = false;
  error = null;
  selectedItem = null;
  locations = ['СЭБ', 'Склад', 'АБК'];

  constructor() {
    makeAutoObservable(this);
  }

  fetchItems = async () => {
    if (this.loading) return;
    this.loading = true;
    this.error = null;
    try {
      const data = await ConsumablesService.fetchAll();
      this.items = data;
      this.initialized = true;
    } catch (error) {
      this.error = error.message || 'Ошибка загрузки картриджей';
      this.initialized = true;
    } finally {
      this.loading = false;
    }
  };

  getById = async (id) => {
    this.loading = true;
    try {
      const data = await ConsumablesService.getById(id);
      this.selectedItem = data;
      return data;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  };

  createItem = async (data) => {
    try {
      await ConsumablesService.create(data);
      await this.fetchItems();
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  };

  updateItem = async (id, data) => {
    try {
      await ConsumablesService.update(id, data);
      await this.fetchItems();
      if (this.selectedItem?.id === id) {
        const updated = this.items.find(i => i.id === id);
        this.selectedItem = updated || null;
      }
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  };

  deleteItem = async (id) => {
    try {
      await ConsumablesService.delete(id);
      await this.fetchItems();
      if (this.selectedItem?.id === id) this.selectedItem = null;
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  };

  addMovement = async (id, movement) => {
    try {
      await ConsumablesService.addMovement(id, movement);
      await this.fetchItems();
      if (this.selectedItem?.id === id) {
        const updated = this.items.find(i => i.id === id);
        this.selectedItem = updated || null;
      }
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  };

  moveItem = async (sourceId, targetLocation, quantity, comment) => {
    try {
      await ConsumablesService.move(sourceId, { targetLocation, quantity, comment });
      await this.fetchItems();
    } catch (error) {
      this.error = error.message;
      throw error;
    }
  };

  clearSelected = () => {
    this.selectedItem = null;
  };
}

const consumablesStore = new ConsumablesStore();
export default consumablesStore;