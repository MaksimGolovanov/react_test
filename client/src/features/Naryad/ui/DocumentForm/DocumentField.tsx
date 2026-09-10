// src/modules/Naryad/ui/DocumentForm/DocumentField.tsx

import React from 'react';
import { Input, Select, Checkbox, DatePicker, Form } from 'antd';
import { TemplateField } from '../../types/order.types';
import dayjs from 'dayjs';

interface DocumentFieldProps {
    field: TemplateField;
    value: any;
    onChange: (value: any) => void;
    mode?: 'document' | 'form';
    allData?: Record<string, any>; // document - стиль "подчёркивание", form - обычный
}

const DocumentField: React.FC<DocumentFieldProps> = ({ field, value, onChange, mode = 'document' }) => {
    const renderInput = () => {
        switch (field.type) {
            case 'text':
                return (
                    <Input
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.example || 'Введите...'}
                        bordered={mode === 'form'}
                        className={mode === 'document' ? 'doc-input' : ''}
                    />
                );
            case 'textarea':
                return (
                    <Input.TextArea
                        rows={field.rows || 3}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.example || 'Введите...'}
                        bordered={mode === 'form'}
                        className={mode === 'document' ? 'doc-textarea' : ''}
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        bordered={mode === 'form'}
                        className={mode === 'document' ? 'doc-input' : ''}
                    />
                );
            case 'checkbox':
                return (
                    <Checkbox
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                    >
                        {field.label}
                    </Checkbox>
                );
            case 'datetime':
                return (
                    <DatePicker
                        showTime
                        value={value ? dayjs(value) : null}
                        onChange={(date) => onChange(date ? date.toISOString() : '')}
                        className={mode === 'document' ? 'doc-input' : ''}
                    />
                );
            case 'select':
                const options = field.options?.map((opt) =>
                    typeof opt === 'string' ? { value: opt, label: opt } : opt
                ) || [];
                return (
                    <Select
                        value={value}
                        onChange={onChange}
                        options={options}
                        placeholder="Выберите..."
                        className={mode === 'document' ? 'doc-select' : ''}
                    />
                );
            default:
                return (
                    <Input
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        bordered={mode === 'form'}
                        className={mode === 'document' ? 'doc-input' : ''}
                    />
                );
        }
    };

    return (
        <Form.Item label={field.label} required={field.required} style={{ marginBottom: 12 }}>
            {renderInput()}
        </Form.Item>
    );
};

export default DocumentField;