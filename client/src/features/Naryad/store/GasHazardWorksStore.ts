// src/modules/Naryad/store/GasHazardWorksStore.ts

import { makeAutoObservable, runInAction } from 'mobx';
import { GasHazardWorkItem } from '../types/order.types';
import gasHazardWorksService from '../services/GasHazardWorksService';

class GasHazardWorksStore {
    items: GasHazardWorkItem[] = [];
    isLoading: boolean = false;
    error: Error | null = null;

    constructor() {
        makeAutoObservable(this);
        this.load();
    }

    async load() {
        this.isLoading = true;
        try {
            const data = await gasHazardWorksService.fetchAll();
            runInAction(() => {
                this.items = data;
                this.error = null;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err as Error;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async create(item: Omit<GasHazardWorkItem, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const newItem = await gasHazardWorksService.create(item);
            runInAction(() => {
                this.items.push(newItem);
            });
            return newItem;
        } catch (err) {
            runInAction(() => {
                this.error = err as Error;
            });
            throw err;
        }
    }

    async update(id: string, updates: Partial<GasHazardWorkItem>) {
        try {
            const updated = await gasHazardWorksService.update(id, updates);
            runInAction(() => {
                const idx = this.items.findIndex(item => item.id === id);
                if (idx !== -1) this.items[idx] = updated;
            });
            return updated;
        } catch (err) {
            runInAction(() => {
                this.error = err as Error;
            });
            throw err;
        }
    }

    async delete(id: string) {
        try {
            await gasHazardWorksService.delete(id);
            runInAction(() => {
                this.items = this.items.filter(item => item.id !== id);
            });
        } catch (err) {
            runInAction(() => {
                this.error = err as Error;
            });
            throw err;
        }
    }

    // Методы для получения данных по службе и коду
    getByService(service: string): GasHazardWorkItem[] {
        return this.items.filter(item => item.service === service);
    }

    getByServiceAndCode(service: string, code: string): GasHazardWorkItem | undefined {
        return this.items.find(item => item.service === service && item.code === code);
    }
}

export default new GasHazardWorksStore();