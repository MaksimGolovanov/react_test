// src/modules/Naryad/store/NaryadGasHazardWorkStore.js

import { makeAutoObservable, action, runInAction } from 'mobx';
import NaryadGasHazardWorkService from '../services/NaryadGasHazardWorkService';

class NaryadGasHazardWorkStore {
  items = [];
  isLoading = false;
  error = null;
  cacheByService = new Map();

  constructor() {
    makeAutoObservable(this);
    this.loadAll();
  }

  loadAll = action(async () => {
    this.isLoading = true;
    try {
      console.log('🔄 Загрузка данных из БД...');
      const data = await NaryadGasHazardWorkService.fetchAll();
      console.log('📦 Получено записей из БД:', data.length);
      runInAction(() => {
        this.items = data;
        this.buildCache(data);
        this.error = null;
      });
    } catch (err) {
      console.error('❌ Ошибка загрузки из БД:', err);
      runInAction(() => {
        this.error = err;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  });

  buildCache(data) {
    this.cacheByService.clear();
    data.forEach((item) => {
      if (!this.cacheByService.has(item.service)) {
        this.cacheByService.set(item.service, []);
      }
      this.cacheByService.get(item.service).push(item);
    });
    for (const [service, list] of this.cacheByService) {
      list.sort((a, b) =>
        a.code.localeCompare(b.code, undefined, { numeric: true })
      );
    }
  }

  // Синхронное получение по службе (из кэша)
  getByServiceSync(service) {
    return this.cacheByService.get(service) || [];
  }

  // Синхронное получение по службе и коду
  getByServiceAndCode(service, code) {
    const list = this.cacheByService.get(service) || [];
    return list.find((item) => item.code === code);
  }

  create = action(async (data) => {
    try {
      const newItem = await NaryadGasHazardWorkService.create(data);
      runInAction(() => {
        this.items.push(newItem);
        if (this.cacheByService.has(newItem.service)) {
          this.cacheByService.get(newItem.service).push(newItem);
          this.cacheByService
            .get(newItem.service)
            .sort((a, b) =>
              a.code.localeCompare(b.code, undefined, { numeric: true })
            );
        } else {
          this.cacheByService.set(newItem.service, [newItem]);
        }
      });
      return newItem;
    } catch (err) {
      this.error = err;
      throw err;
    }
  });

  update = action(async (id, updates) => {
    try {
      const updated = await NaryadGasHazardWorkService.update(id, updates);
      runInAction(() => {
        const idx = this.items.findIndex((item) => item.id === id);
        if (idx !== -1) this.items[idx] = updated;
        // Обновляем кэш
        for (const [service, list] of this.cacheByService) {
          const itemIdx = list.findIndex((item) => item.id === id);
          if (itemIdx !== -1) {
            list[itemIdx] = updated;
            break;
          }
        }
        if (updates.service && updates.service !== updated.service) {
          this.buildCache(this.items);
        }
      });
      return updated;
    } catch (err) {
      this.error = err;
      throw err;
    }
  });

  delete = action(async (id) => {
    try {
      await NaryadGasHazardWorkService.delete(id);
      runInAction(() => {
        this.items = this.items.filter((item) => item.id !== id);
        for (const [service, list] of this.cacheByService) {
          const filtered = list.filter((item) => item.id !== id);
          if (filtered.length !== list.length) {
            this.cacheByService.set(service, filtered);
            break;
          }
        }
      });
    } catch (err) {
      this.error = err;
      throw err;
    }
  });
}

export default NaryadGasHazardWorkStore;
