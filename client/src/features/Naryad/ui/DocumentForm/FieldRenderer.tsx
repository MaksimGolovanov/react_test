// src/modules/Naryad/ui/DocumentForm/FieldRenderer.tsx

import React, { useMemo } from 'react';
import { Input, Select, Checkbox, DatePicker, Form, Button, Space } from 'antd';
import { TemplateField } from '../../types/order.types';
import dayjs from 'dayjs';
import orderStore from '../../store/OrderStore';

interface FieldRendererProps {
    field: TemplateField;
    value: any;
    onChange: (value: any) => void;
    allData?: Record<string, any>;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, allData = {} }) => {
    // Вычисляем динамические опции
    const dynamicOptions = useMemo(() => {
        if (field.dynamicOptions?.source === 'gasHazardWorks') {
            const filterField = field.dynamicOptions.filterField || 'structuralUnit';
            const filterValue = allData[filterField] || '';
            const items = orderStore.getGasHazardWorksForService(filterValue);
            const valueField = field.dynamicOptions.valueField || 'code';
            const labelField = field.dynamicOptions.labelField || 'description';
            return items.map(item => ({
                value: item[valueField as keyof typeof item] as string,
                label: item[labelField as keyof typeof item] as string,
            }));
        }
        return null;
    }, [field.dynamicOptions, allData]);

    // Если есть динамические опции, используем их, иначе статические
    const selectOptions = dynamicOptions || field.options?.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    ) || [];

    const renderInput = () => {
        switch (field.type) {
            case 'text':
                return <Input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.example} disabled={field.readonly} />;
            case 'textarea':
                return <Input.TextArea rows={field.rows || 3} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.example} disabled={field.readonly} />;
            case 'number':
                return <Input type="number" value={value || ''} onChange={e => onChange(parseFloat(e.target.value))} disabled={field.readonly} />;
            case 'checkbox':
                return <Checkbox checked={!!value} onChange={e => onChange(e.target.checked)}>{field.label}</Checkbox>;
            case 'datetime':
                return <DatePicker showTime value={value ? dayjs(value) : null} onChange={date => onChange(date ? date.toISOString() : '')} disabled={field.readonly} />;
            case 'select':
                return (
                    <Select
                        value={value}
                        onChange={onChange}
                        options={selectOptions}
                        placeholder="Выберите..."
                        showSearch
                        filterOption={(input, option) => {
                            // Приводим label к строке, чтобы избежать ошибок TypeScript
                            const label = String(option?.label ?? '');
                            return label.toLowerCase().includes(input.toLowerCase());
                        }}
                        disabled={field.readonly}
                    />
                );
            case 'array':
                return <ArrayField field={field} value={value || []} onChange={onChange} allData={allData} />;
            case 'group':
                return <GroupField field={field} value={value || {}} onChange={onChange} allData={allData} />;
            default:
                return <Input value={value || ''} onChange={e => onChange(e.target.value)} disabled={field.readonly} />;
        }
    };

    return (
        <Form.Item label={field.label} required={field.required} style={{ marginBottom: 16 }}>
            {renderInput()}
        </Form.Item>
    );
};

// ===== ДОПОЛНИТЕЛЬНО: обновляем ArrayField и GroupField, чтобы передавали allData =====
const ArrayField: React.FC<{ field: TemplateField; value: any[]; onChange: (val: any[]) => void; allData?: Record<string, any> }> = ({ field, value, onChange, allData }) => {
    const addItem = () => {
        const newItem = field.subfields?.reduce((acc, sub) => {
            acc[sub.name] = sub.type === 'checkbox' ? false : '';
            return acc;
        }, {} as any) || {};
        onChange([...value, newItem]);
    };

    const removeItem = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const updateItem = (index: number, subName: string, subValue: any) => {
        const newValue = [...value];
        newValue[index] = { ...newValue[index], [subName]: subValue };
        onChange(newValue);
    };

    return (
        <div>
            {value.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8, borderRadius: 4 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {field.subfields?.map(sub => (
                            <FieldRenderer
                                key={sub.name}
                                field={sub}
                                value={item[sub.name]}
                                onChange={(val) => updateItem(idx, sub.name, val)}
                                allData={allData}
                            />
                        ))}
                        <Button danger onClick={() => removeItem(idx)}>Удалить</Button>
                    </Space>
                </div>
            ))}
            <Button type="dashed" onClick={addItem}>Добавить строку</Button>
        </div>
    );
};

const GroupField: React.FC<{ field: TemplateField; value: any; onChange: (val: any) => void; allData?: Record<string, any> }> = ({ field, value, onChange, allData }) => {
    const handleSubChange = (subName: string, subValue: any) => {
        onChange({ ...value, [subName]: subValue });
    };

    return (
        <div>
            {field.subfields?.map(sub => (
                <FieldRenderer
                    key={sub.name}
                    field={sub}
                    value={value[sub.name]}
                    onChange={(val) => handleSubChange(sub.name, val)}
                    allData={allData}
                />
            ))}
        </div>
    );
};

export default FieldRenderer;