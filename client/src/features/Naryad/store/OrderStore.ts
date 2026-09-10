// src/modules/Naryad/store/OrderStore.js

import { makeAutoObservable, runInAction } from 'mobx';
import { Order, OrderTemplate } from '../types/order.types';
import orderService from '../services/OrderLocalStorageService';
import NaryadGasHazardWorkStore from './NaryadGasHazardWorkStore'; // Новый стор для справочника ГОР (с БД)
import { loadTemplates, getTemplateById, getTemplateByCode } from '../lib/templateLoader';

class OrderStore {
    // Основные данные
    orders = [];
    templates = [];
    selectedTemplate = null;
    selectedOrder = null;
    isLoading = false;
    error = null;

    // Пагинация и фильтры
    currentPage = 1;
    pageSize = 16;
    searchTerm = '';
    statusFilter = 'all';

    // Справочник ГОР – используем новый стор с БД
    gasHazardWorksStore = new NaryadGasHazardWorkStore();

    constructor() {
        makeAutoObservable(this);
        this.init();
    }

    // Инициализация
    async init() {
        this.isLoading = true;
        try {
            // Загружаем шаблоны и наряды (локальное хранилище)
            await this.loadTemplates();
            await this.fetchOrders();
            // Загружаем справочник ГОР из БД
            await this.gasHazardWorksStore.loadAll();
        } catch (err) {
            this.error = err;
        } finally {
            this.isLoading = false;
        }
    }

    // Загрузка шаблонов
    async loadTemplates() {
        const templates = await loadTemplates();
        runInAction(() => {
            this.templates = templates;
            if (templates.length > 0 && !this.selectedTemplate) {
                this.selectedTemplate = templates[0];
            }
        });
    }

    // Загрузка нарядов из localStorage
    async fetchOrders() {
        try {
            const orders = await orderService.fetchOrders();
            runInAction(() => {
                this.orders = orders;
                this.error = null;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err;
            });
        }
    }

    // Создание нового наряда
    async createOrder(orderData) {
        try {
            const newOrder = await orderService.createOrder(orderData);
            runInAction(() => {
                this.orders.unshift(newOrder);
                this.selectedOrder = newOrder;
            });
            return newOrder;
        } catch (err) {
            runInAction(() => {
                this.error = err;
            });
            throw err;
        }
    }

    // Обновление наряда
    async updateOrder(id, data) {
        try {
            const updated = await orderService.updateOrder(id, data);
            runInAction(() => {
                const idx = this.orders.findIndex(o => o.id === id);
                if (idx !== -1) this.orders[idx] = updated;
                if (this.selectedOrder?.id === id) this.selectedOrder = updated;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err;
            });
        }
    }

    // Удаление наряда
    async deleteOrder(id) {
        try {
            await orderService.deleteOrder(id);
            runInAction(() => {
                this.orders = this.orders.filter(o => o.id !== id);
                if (this.selectedOrder?.id === id) this.selectedOrder = null;
            });
        } catch (err) {
            runInAction(() => {
                this.error = err;
            });
        }
    }

    // Выбор шаблона
    selectTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            this.selectedTemplate = template;
        }
    }

    // Выбор наряда
    selectOrder(order) {
        this.selectedOrder = order;
    }

    // Создание черновика
    createDraft(templateId) {
        const template = templateId ? getTemplateById(templateId) : this.selectedTemplate;
        if (!template) return;

        const now = new Date().toISOString();
        const draft = {
            id: 'tmp-' + Date.now().toString(),
            number: `НД-${new Date().getFullYear()}-${String(this.orders.length + 1).padStart(3, '0')}`,
            templateId: template.id,
            templateCode: template.code,
            data: {},
            status: 'draft',
            createdAt: now,
            updatedAt: now,
        };
        this.selectedOrder = draft;
    }

    // Сброс выбора
    clearSelection() {
        this.selectedOrder = null;
    }

    // ----- Computed -----
    get filteredOrders() {
        let list = this.orders;
        if (this.statusFilter !== 'all') {
            list = list.filter(o => o.status === this.statusFilter);
        }
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            list = list.filter(o =>
                o.number.toLowerCase().includes(term) ||
                (o.data?.workPlace || '').toLowerCase().includes(term) ||
                (o.data?.responsibleConduct || '').toLowerCase().includes(term)
            );
        }
        return list;
    }

    // ----- Actions для пагинации и фильтров -----
    setSearchTerm(term) {
        this.searchTerm = term;
        this.currentPage = 1;
    }

    setStatusFilter(status) {
        this.statusFilter = status;
        this.currentPage = 1;
    }

    setCurrentPage(page) {
        this.currentPage = page;
    }

    setPageSize(size) {
        this.pageSize = size;
    }

    // ----- Методы для работы со справочником ГОР (прокси к gasHazardWorksStore) -----
    // Получить все пункты для службы (синхронно из кэша)
    getGasHazardWorksForService(service) {
        return this.gasHazardWorksStore.getByServiceSync(service);
    }

    // Получить конкретный пункт по службе и коду (синхронно)
    getGasHazardWork(service, code) {
        return this.gasHazardWorksStore.getByServiceAndCode(service, code);
    }

    // Создать новый пункт
    async addGasHazardWork(data) {
        return this.gasHazardWorksStore.create(data);
    }

    // Обновить пункт
    async updateGasHazardWork(id, data) {
        return this.gasHazardWorksStore.update(id, data);
    }

    // Удалить пункт
    async deleteGasHazardWork(id) {
        return this.gasHazardWorksStore.delete(id);
    }
}

const orderStore = new OrderStore();
export default orderStore;