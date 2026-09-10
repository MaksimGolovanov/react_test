// src/modules/Naryad/ui/DocumentForm/EditableTable.tsx

import React, { useState } from 'react';
import { Table, Input, Select, Checkbox, Button, Space } from 'antd';
import { TemplateField } from '../../types/order.types';

interface EditableTableProps {
    fields: TemplateField[]; // subfields
    data: any[];
    onChange: (newData: any[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ fields, data, onChange }) => {
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const isEditing = (record: any) => record._key === editingKey;

    const addRow = () => {
        const newRow: any = { _key: Date.now().toString() };
        fields.forEach((f) => {
            newRow[f.name] = f.type === 'checkbox' ? false : '';
        });
        const newData = [...data, newRow];
        onChange(newData);
        // Автоматически начать редактирование новой строки
        setEditingKey(newRow._key);
    };

    const deleteRow = (key: string) => {
        const newData = data.filter((item) => item._key !== key);
        onChange(newData);
        if (editingKey === key) setEditingKey(null);
    };

    const saveRow = (key: string) => {
        setEditingKey(null);
    };

    const editRow = (key: string) => {
        setEditingKey(key);
    };

    const handleCellChange = (record: any, fieldName: string, value: any) => {
        const newData = data.map((item) => {
            if (item._key === record._key) {
                return { ...item, [fieldName]: value };
            }
            return item;
        });
        onChange(newData);
    };

    const columns = fields.map((field) => ({
        title: field.label,
        dataIndex: field.name,
        key: field.name,
        render: (text: any, record: any) => {
            const editable = isEditing(record);
            if (!editable) {
                // Отображаем значение или пусто
                if (field.type === 'checkbox') {
                    return record[field.name] ? '✅' : '❌';
                }
                return record[field.name] || '—';
            }
            // Режим редактирования
            switch (field.type) {
                case 'select':
                    return (
                        <Select
                            value={record[field.name]}
                            onChange={(val) => handleCellChange(record, field.name, val)}
                            style={{ width: '100%' }}
                            options={field.options?.map((opt) =>
                                typeof opt === 'string' ? { value: opt, label: opt } : opt
                            )}
                        />
                    );
                case 'checkbox':
                    return (
                        <Checkbox
                            checked={!!record[field.name]}
                            onChange={(e) => handleCellChange(record, field.name, e.target.checked)}
                        />
                    );
                default:
                    return (
                        <Input
                            value={record[field.name] || ''}
                            onChange={(e) => handleCellChange(record, field.name, e.target.value)}
                        />
                    );
            }
        },
    }));

    // Добавляем колонку действий
    const actionColumn = {
        title: 'Действия',
        key: 'actions',
        render: (_: any, record: any) => {
            const editable = isEditing(record);
            return editable ? (
                <Button type="link" onClick={() => saveRow(record._key)}>
                    Сохранить
                </Button>
            ) : (
                <Space>
                    <Button type="link" onClick={() => editRow(record._key)}>
                        Редактировать
                    </Button>
                    <Button type="link" danger onClick={() => deleteRow(record._key)}>
                        Удалить
                    </Button>
                </Space>
            );
        },
    };

    return (
        <div>
            <Table
                columns={[...columns, actionColumn]}
                dataSource={data.map((item) => ({ ...item, key: item._key }))}
                pagination={false}
                size="small"
            />
            <Button type="dashed" onClick={addRow} style={{ marginTop: 8 }}>
                + Добавить строку
            </Button>
        </div>
    );
};

export default EditableTable;