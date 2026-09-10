// src/modules/Naryad/lib/templateLoader.ts

import { OrderTemplate } from '../types/order.types';

const TEMPLATES_BASE_URL = '/templates';

// Кэш шаблонов
let templatesCache: OrderTemplate[] | null = null;
let templatesMap: Map<string, OrderTemplate> | null = null;

export async function loadTemplates(): Promise<OrderTemplate[]> {
    if (templatesCache) return templatesCache;

    try {
        // Загружаем список доступных шаблонов (можно хранить в файле index.json)
        // Для простоты будем загружать все .json файлы из папки public/templates
        // Но проще иметь файл со списком: templates/index.json
        const response = await fetch(`${TEMPLATES_BASE_URL}/index.json`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить список шаблонов');
        }
        const manifest: { templates: string[] } = await response.json();

        const templates: OrderTemplate[] = [];
        for (const fileName of manifest.templates) {
            const res = await fetch(`${TEMPLATES_BASE_URL}/${fileName}`);
            if (res.ok) {
                const template = await res.json();
                templates.push(template);
            } else {
                console.warn(`Не удалось загрузить шаблон ${fileName}`);
            }
        }

        // Фильтруем активные
        const active = templates.filter(t => t.is_active !== false);
        templatesCache = active;
        templatesMap = new Map(active.map(t => [t.code, t]));
        return active;
    } catch (error) {
        console.error('Ошибка загрузки шаблонов:', error);
        // Возвращаем дефолтные заглушки для демонстрации
        return getDefaultTemplates();
    }
}

export function getTemplateByCode(code: string): OrderTemplate | null {
    return templatesMap?.get(code) || null;
}

export function getTemplateById(id: string): OrderTemplate | null {
    return templatesCache?.find(t => t.id === id) || null;
}

// Заглушки для отладки, если файлы не загружены
function getDefaultTemplates(): OrderTemplate[] {
    return [
        {
            id: 'gor_mg_vskr',
            code: 'GOR_MG_VSKR',
            name: 'ГОР: вскрытие шурфа на МГ',
            schema: [
                { name: 'structuralUnit', type: 'select', label: 'Структурное подразделение', options: ['ЛЭС', 'СЗК'], required: true },
                { name: 'workPlace', type: 'text', label: 'Место проведения', required: true },
                { name: 'pipeNumber', type: 'text', label: 'Номер трубы' },
                { name: 'workType', type: 'select', label: 'Тип работ', options: ['1.1', '1.3'] },
                { name: 'responsiblePreparation', type: 'text', label: 'Ответственный за подготовку', required: true },
                { name: 'responsibleConduct', type: 'text', label: 'Ответственный за проведение', required: true },
                { name: 'plannedStart', type: 'datetime', label: 'Начало' },
                { name: 'plannedEnd', type: 'datetime', label: 'Окончание' },
                {
                    name: 'tpa', type: 'array', label: 'Положение ТПА', subfields: [
                        { name: 'km', type: 'text', label: 'Километр' },
                        { name: 'openValves', type: 'text', label: 'Открытые краны' },
                        { name: 'closedValves', type: 'text', label: 'Закрытые краны' }
                    ]
                },
                { name: 'measures', type: 'text', label: 'Мероприятия по подготовке' },
                { name: 'safetyMeasures', type: 'text', label: 'Мероприятия безопасности' },
                { name: 'appendices', type: 'text', label: 'Приложения' },
                {
                    name: 'protection', type: 'group', label: 'СИЗ и режим', subfields: [
                        { name: 'ppe', type: 'text', label: 'СИЗ' },
                        { name: 'fireExtinguishers', type: 'text', label: 'Огнетушители' },
                        { name: 'firstAid', type: 'text', label: 'Аптечка' },
                        { name: 'workRegime', type: 'text', label: 'Режим работы' },
                        { name: 'gasAnalyzer', type: 'text', label: 'Газоанализатор' }
                    ]
                },
                { name: 'issuer', type: 'text', label: 'Выдал' },
                { name: 'ds', type: 'text', label: 'ДС' },
                { name: 'otSpecialist', type: 'text', label: 'ОТ' },
                {
                    name: 'workers', type: 'array', label: 'Исполнители', subfields: [
                        { name: 'fullName', type: 'text', label: 'ФИО' },
                        { name: 'position', type: 'text', label: 'Должность' },
                        { name: 'signed', type: 'checkbox', label: 'Подпись' },
                        { name: 'signatureDate', type: 'text', label: 'Дата' }
                    ]
                },
                { name: 'prepResponsible', type: 'text', label: 'Ответственный за подготовку (инструктаж)' },
                { name: 'conductResponsible', type: 'text', label: 'Ответственный за проведение (инструктаж)' },
                { name: 'conductedBy', type: 'text', label: 'Инструктаж провёл' },
                {
                    name: 'airSamples', type: 'array', label: 'Анализы воздуха', subfields: [
                        { name: 'datetime', type: 'text', label: 'Дата/время' },
                        { name: 'place', type: 'text', label: 'Место' },
                        { name: 'substance', type: 'select', label: 'Вещество', options: ['CH4', 'O2'] },
                        { name: 'allowable', type: 'text', label: 'Допустимая' },
                        { name: 'actual', type: 'text', label: 'Фактическая' },
                        { name: 'inspector', type: 'text', label: 'Инспектор' }
                    ]
                },
                {
                    name: 'completion', type: 'group', label: 'Закрытие', subfields: [
                        { name: 'prepReady', type: 'checkbox', label: 'Подготовка выполнена' },
                        { name: 'prepSign', type: 'text', label: 'Подпись за подготовку' },
                        { name: 'conductSign', type: 'text', label: 'Подпись за проведение' },
                        { name: 'admission', type: 'text', label: 'Допуск' },
                        {
                            name: 'extensions', type: 'array', label: 'Продления', subfields: [
                                { name: 'date', type: 'text', label: 'Дата' },
                                { name: 'responsible', type: 'text', label: 'Ответственный' },
                                { name: 'approvals', type: 'text', label: 'Утверждения' }
                            ]
                        },
                        { name: 'workFinished', type: 'checkbox', label: 'Работа завершена' },
                        { name: 'closedBy', type: 'text', label: 'Закрыл' },
                        { name: 'closedDate', type: 'text', label: 'Дата закрытия' }
                    ]
                }
            ],
            sections: [
                { title: 'Основные данные', fields: ['structuralUnit', 'workPlace', 'pipeNumber', 'workType', 'responsiblePreparation', 'responsibleConduct', 'plannedStart', 'plannedEnd'] },
                { title: 'ТПА', fields: ['tpa'] },
                { title: 'Мероприятия', fields: ['measures', 'safetyMeasures', 'appendices'] },
                { title: 'СИЗ', fields: ['protection'] },
                { title: 'Инструктажи', fields: ['workers', 'prepResponsible', 'conductResponsible', 'conductedBy'] },
                { title: 'Анализы', fields: ['airSamples'] },
                { title: 'Закрытие', fields: ['completion'] }
            ],
            static_content: {
                section7: 'Выполнить весь комплекс подготовительных работ...\n(здесь полный текст пункта 7)',
                section9: 'К проведению ГОР приступать только после выполнения всех подготовительных работ...\n(здесь полный текст пункта 9)'
            },
            docx_template: 'gor_mg_vskr.docx',
            version: 1,
            is_active: true
        },
        // можно добавить заглушку для GOR_KS_LUKLAZ
        {
            id: 'gor_ks_luklaz',
            code: 'GOR_KS_LUKLAZ',
            name: 'ГОР: вскрытие люк-лаза на КС',
            schema: [
                // аналогично, но с другими полями
            ],
            sections: [],
            static_content: {},
            docx_template: 'gor_ks_luklaz.docx',
            version: 1,
            is_active: true
        }
    ];
}