// src/modules/Naryad/types/order.types.ts

export interface TemplateField {
    name: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'datetime' | 'number' | 'array' | 'group';
    label: string;
    required?: boolean;
    readonly?: boolean;
    options?: string[] | { value: string; label: string }[];
    // Новое поле для динамических опций
    dynamicOptions?: {
        source: 'gasHazardWorks';   // пока только один источник
        filterField?: string;       // имя поля, по которому фильтровать (например, 'structuralUnit')
        valueField?: string;        // поле, используемое как значение (по умолчанию 'code')
        labelField?: string;        // поле, используемое как отображаемый текст (по умолчанию 'description' или 'code')
    };
    example?: string;
    rows?: number;
    subfields?: TemplateField[];
}

export interface TemplateSection {
    title: string;
    fields: string[]; // имена полей, входящих в раздел
}

export interface StaticContent {
    section7?: string;   // текст п.7 (может быть HTML)
    section8?: string;   // для ОР
    section9?: string;   // текст п.9 (может быть HTML)
    section10?: string;  // для ОР (п.10 – инструктажи)
    // другие именованные блоки по необходимости
}

export interface OrderTemplate {
    id: string;
    code: string;
    name: string;
    schema: TemplateField[];
    sections: TemplateSection[];
    static_content: StaticContent;
    docx_template: string; // имя файла .docx в public/templates/
    version: number;
    is_active: boolean;
}

// Универсальный наряд – все данные в поле data
export interface Order {
    id: string;
    number: string;
    templateId: string;          // ссылка на шаблон
    templateCode?: string;       // дублируем для быстрого доступа
    data: Record<string, any>;   // все заполненные поля
    status: 'draft' | 'active' | 'closed';
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

export type OrderInput = Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'status'> & {
    status?: 'draft' | 'active' | 'closed';
};

// Для формы – состояние редактирования
export interface OrderFormState {
    template: OrderTemplate | null;
    order: Order | null;
    currentSection: number;
    errors: Record<string, string>;
}

// ===== ДОБАВЛЯЕМ ИНТЕРФЕЙС ДЛЯ СПРАВОЧНИКА =====
export interface GasHazardWorkItem {
    id: string;                     // уникальный идентификатор
    code: string;                   // номер пункта, например '1.1'
    service: string;                // структурное подразделение: 'ЛЭС', 'КС', 'СЗК' и т.д.
    description: string;            // место и характер работы
    dangerFactors: string;          // возможные опасные и вредные факторы
    executorCategory: string;       // категория исполнителей
    preparationMeasures: string;    // основные мероприятия по подготовке
    safetyMeasures: string;         // основные мероприятия по безопасному проведению
    appendices?: string;            // приложения (опционально)
    withoutPermit?: boolean;        // true, если работа проводится без наряда-допуска
    createdAt?: string;
    updatedAt?: string;
}