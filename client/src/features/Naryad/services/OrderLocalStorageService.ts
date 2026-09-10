// src/modules/Naryad/services/OrderLocalStorageService.ts

import { Order, OrderInput } from '../types/order.types';

const STORAGE_KEY = 'orders_data';

class OrderLocalStorageService {
    private getData(): Order[] {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // Создаём демо-данные, если их нет
            const initial = this.getInitialData();
            this.saveData(initial);
            return initial;
        }
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }

    private saveData(data: Order[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    private getInitialData(): Order[] {
        const now = new Date().toISOString();
        // Создаём один демо-наряд для шаблона GOR_MG_VSKR
        return [
            {
                id: '1',
                number: 'НД-2026-001',
                templateId: 'gor_mg_vskr',
                templateCode: 'GOR_MG_VSKR',
                data: {
                    structuralUnit: 'ЛЭС',
                    workPlace: 'МГ «Пунга-Вуктыл-Ухта-II» (3 нитка), Ду 1400 мм, км 382,016',
                    pipeNumber: '№20651а',
                    workType: '1.1',
                    responsiblePreparation: 'Чукичев Сергей Евгеньевич, Ведущий инженер ЛЭС',
                    responsibleConduct: 'Чукичев Сергей Евгеньевич, Ведущий инженер ЛЭС',
                    plannedStart: '2026-07-01T08:00:00.000Z',
                    plannedEnd: '2026-07-01T20:00:00.000Z',
                    tpa: [
                        { km: '382', openValves: '1с, 4с КУ Г-3', closedValves: 'Г-3, 2с, 3с, о1 КУ Г-3, ГП-35б, 1бГП-35б, 2бГП-35б' }
                    ],
                    measures: 'Применять средства видеофиксации...',
                    safetyMeasures: 'Обеспечить видеофиксацию...',
                    appendices: 'Технологическая схема...',
                    protection: {
                        ppe: 'Костюм из антистатической ткани...',
                        fireExtinguishers: 'Огнетушитель ОУ-8 – 2 шт.',
                        firstAid: 'Аптечка универсальная',
                        workRegime: 'Рабочий день не более 12 часов...',
                        gasAnalyzer: 'Mirax AVIS X Pro №4/1 Зав.№ AVX4P2412516'
                    },
                    issuer: 'Есев Дмитрий Сергеевич, Начальник ЛЭС',
                    ds: '',
                    otSpecialist: '',
                    workers: [
                        { fullName: 'Корсунов О.Н.', position: 'Обходчик линейный 4 разряда', signed: true, signatureDate: '26.06.2026' },
                        { fullName: 'Синельников М.Г.', position: 'Руководитель ГДОО', signed: true, signatureDate: '26.06.2026' },
                    ],
                    prepResponsible: 'Чукичев Сергей Евгеньевич, Ведущий инженер ЛЭС',
                    conductResponsible: 'Чукичев Сергей Евгеньевич, Ведущий инженер ЛЭС',
                    conductedBy: 'Начальник ЛЭС Есев Дмитрий Сергеевич',
                    airSamples: [
                        { datetime: '01.07.2026 08:00', place: 'МГ ...', substance: 'CH4', allowable: 'ниже 5% от НКПР', actual: '0,0%', inspector: 'Чукичев С.Е.' }
                    ],
                    completion: {
                        prepReady: true,
                        prepSign: 'Чукичев С.Е. 26.06.2026 07:30',
                        conductSign: '',
                        admission: 'Не требуется',
                        extensions: [],
                        workFinished: false,
                        closedBy: '',
                        closedDate: ''
                    }
                },
                status: 'active',
                createdAt: now,
                updatedAt: now
            }
        ];
    }

    async fetchOrders(): Promise<Order[]> {
        return this.getData();
    }

    async createOrder(data: Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Promise<Order> {
        const list = this.getData();
        const maxNumber = list.reduce((max, o) => {
            const num = parseInt(o.number.split('-')[2] || '0');
            return num > max ? num : max;
        }, 0);
        const newNumber = `НД-${new Date().getFullYear()}-${String(maxNumber + 1).padStart(3, '0')}`;
        const newOrder: Order = {
            ...data,
            id: Date.now().toString(),
            number: newNumber,
            status: data.status || 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        list.unshift(newOrder);
        this.saveData(list);
        return newOrder;
    }

    async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
        const list = this.getData();
        const index = list.findIndex(o => o.id === id);
        if (index === -1) throw new Error('Наряд не найден');
        const updated = { ...list[index], ...data, updatedAt: new Date().toISOString() };
        list[index] = updated;
        this.saveData(list);
        return updated;
    }

    async deleteOrder(id: string): Promise<void> {
        const list = this.getData();
        const filtered = list.filter(o => o.id !== id);
        if (filtered.length === list.length) throw new Error('Наряд не найден');
        this.saveData(filtered);
    }
}

export default new OrderLocalStorageService();