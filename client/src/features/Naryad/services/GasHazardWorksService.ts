// src/modules/Naryad/services/GasHazardWorksService.ts

import { GasHazardWorkItem } from '../types/order.types';

const STORAGE_KEY = 'gas_hazard_works_data';

// Начальные данные (из PDF для ЛЭС, можно расширить)
const initialData: GasHazardWorkItem[] = [
    // ЛЭС – пункт 1.1
    {
        id: 'le_1.1',
        code: '1.1',
        service: 'ЛЭС',
        description: 'Охранные зоны ЛЧ МГ, ГО. Земляные работы глубиной более одного метра по вскрытию не освобожденных от газа и не выведенных из эксплуатации подземных газопроводов: вскрытие шурфа, вскрытие трубопроводной арматуры.',
        dangerFactors: 'Возможность выхода в воздух рабочей зоны взрывопожароопасных и других опасных веществ; загазованность, образование взрывоопасной смеси; пониженное/повышенное содержание кислорода; высокое давление; обрушение стенок траншеи; движущиеся машины и механизмы; острые кромки; неровность поверхностей; повышенный уровень шума; недостаточная освещённость; физические перегрузки; пониженная/повышенная температура; вредные вещества в воздухе.',
        executorCategory: 'Руководители, специалисты, рабочие филиала и специализированных подрядных организаций, прошедшие обучение и аттестацию в установленном порядке, не имеющие медицинских противопоказаний и допущенные к самостоятельному выполнению данных работ.',
        preparationMeasures: '1. При производстве земляных работ механизированным способом разработать, согласовать и утвердить ППР или ПОиПОР.\n2. Подготовить средства видеофиксации работ во взрывозащищенном исполнении, обеспечить видеофиксацию подготовительных работ и целевых инструктажей.\n3. Начальник ЛЭС или лицо, его замещающее, на объекте которого проводятся ГОР, перед началом подготовки объекта проводит инструктаж лиц, ответственных за подготовку и проведение ГОР.\n4. К наряду-допуску прилагаются схемы (ситуационная и технологическая).\n... (полный текст из PDF)',
        safetyMeasures: '1. Обеспечить видеофиксацию проведения ГОР видеорегистратором во взрывозащищенном исполнении.\n2. К проведению ГОР приступать только после выполнения всех подготовительных работ и мероприятий, предусмотренных нарядом-допуском.\n3. ГОР должна начинаться в присутствии и с разрешения лица, ответственного за проведение ГОР по согласованию с начальником смены ДС.\n4. Обеспечить доклад начальнику смены ДС каждые 2 часа о ходе проведения работ.\n... (полный текст)',
        appendices: '',
        withoutPermit: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // ЛЭС – пункт 1.2 (кратко для примера)
    {
        id: 'le_1.2',
        code: '1.2',
        service: 'ЛЭС',
        description: 'Охранная зона МГ ЛЧ, ГО. Земляные работы глубиной до 1 метра механизированным способом. Планировка монтажных площадей под временные подъезды к месту производства работ и размещению материалов; Техническая рекультивация; Расчистка трассы МГ и ГО от древесно-кустарниковой растительности; Строительство, ремонт постоянных/временных лежневых дорог и их демонтаж; Строительство, ремонт временных/постоянных переездов через МГ; Строительство, ремонт водопропусков.',
        dangerFactors: 'Возможность выхода в воздух рабочей зоны взрывопожароопасных и других опасных веществ; загазованность, образование взрывоопасной смеси; высокое давление; острые кромки; неровность поверхностей; повышенный уровень шума; недостаточная освещённость; физические перегрузки; пониженная/повышенная температура; возможность наличия вредных веществ.',
        executorCategory: 'Руководители, специалисты, рабочие филиала и специализированных подрядных организаций, прошедшие обучение и аттестацию в установленном порядке, не имеющие медицинских противопоказаний и допущенные к самостоятельному выполнению данных работ.',
        preparationMeasures: '1. При производстве земляных работ механизированным способом разработать, согласовать и утвердить ППР или ПОиПОР.\n2. Подготовить средства видеофиксации... (полный текст)',
        safetyMeasures: '1. Обеспечить видеофиксацию проведения ГОР видеорегистратором во взрывозащищенном исполнении.\n2. К проведению ГОР приступать только после выполнения всех подготовительных работ...',
        appendices: '',
        withoutPermit: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Можно добавить остальные пункты ЛЭС (1.3 ... 1.14, 2.1 ... 2.3)
    // и для других служб: КС, СЗК и т.д.
    // Здесь только заглушки для демонстрации
    {
        id: 'ks_1.1',
        code: '1.1',
        service: 'КС',
        description: 'Вскрытие люк-лаза на КС (пример)',
        dangerFactors: '...',
        executorCategory: '...',
        preparationMeasures: '...',
        safetyMeasures: '...',
        appendices: '',
        withoutPermit: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

class GasHazardWorksService {
    private getData(): GasHazardWorkItem[] {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // Если данных нет, сохраняем начальные и возвращаем их
            this.saveData(initialData);
            return initialData;
        }
        try {
            return JSON.parse(raw);
        } catch {
            this.saveData(initialData);
            return initialData;
        }
    }

    private saveData(data: GasHazardWorkItem[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    async fetchAll(): Promise<GasHazardWorkItem[]> {
        return this.getData();
    }

    async create(item: Omit<GasHazardWorkItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GasHazardWorkItem> {
        const list = this.getData();
        const newItem: GasHazardWorkItem = {
            ...item,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        list.push(newItem);
        this.saveData(list);
        return newItem;
    }

    async update(id: string, updates: Partial<GasHazardWorkItem>): Promise<GasHazardWorkItem> {
        const list = this.getData();
        const index = list.findIndex(item => item.id === id);
        if (index === -1) throw new Error('Пункт не найден');
        const updated = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
        list[index] = updated;
        this.saveData(list);
        return updated;
    }

    async delete(id: string): Promise<void> {
        const list = this.getData();
        const filtered = list.filter(item => item.id !== id);
        if (filtered.length === list.length) throw new Error('Пункт не найден');
        this.saveData(filtered);
    }
}

export default new GasHazardWorksService();