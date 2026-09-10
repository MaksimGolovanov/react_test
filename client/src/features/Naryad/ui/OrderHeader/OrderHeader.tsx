// src/modules/Naryad/ui/OrderHeader/OrderHeader.tsx

import React, { useState } from 'react';
import { Button, Input, Space, message, Modal, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined, DatabaseOutlined } from '@ant-design/icons';
import orderStore from '../../store/OrderStore';
import GasHazardWorksManager from '../GasHazardWorksManager/GasHazardWorksManager'
import styles from './OrderHeader.module.css';

const OrderHeader: React.FC<any> = ({ searchTerm, onSearchChange, onAddNew, selectedRow, onEdit, onDelete, onCopy }) => {
    const [worksManagerVisible, setWorksManagerVisible] = useState(false);

    const handleDelete = () => {
        if (!selectedRow) return message.warning('Выберите наряд');
        Modal.confirm({
            title: 'Удаление',
            content: `Удалить наряд №${selectedRow.number}?`,
            onOk: async () => {
                await orderStore.deleteOrder(selectedRow.id);
                message.success('Удалено');
                onDelete();
            }
        });
    };

    return (
        <div className={styles.header}>
            <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>Создать</Button>
                <Button icon={<EditOutlined />} onClick={() => selectedRow && onEdit(selectedRow)} disabled={!selectedRow}>Редактировать</Button>
                <Button icon={<CopyOutlined />} onClick={() => selectedRow && onCopy(selectedRow)} disabled={!selectedRow}>Копировать</Button>
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete} disabled={!selectedRow}>Удалить</Button>
                <Button icon={<DatabaseOutlined />} onClick={() => setWorksManagerVisible(true)}>Перечень ГОР</Button>
            </Space>
            <Space>
                <Select
                    defaultValue="all"
                    style={{ width: 140 }}
                    onChange={(val) => orderStore.setStatusFilter(val as any)}
                >
                    <Select.Option value="all">Все статусы</Select.Option>
                    <Select.Option value="draft">Черновик</Select.Option>
                    <Select.Option value="active">Активен</Select.Option>
                    <Select.Option value="closed">Закрыт</Select.Option>
                </Select>
                <Input
                    placeholder="Поиск..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    style={{ width: 300 }}
                />
            </Space>

            {/* Модалка справочника */}
            <GasHazardWorksManager visible={worksManagerVisible} onClose={() => setWorksManagerVisible(false)} />
        </div>
    );
};

export default OrderHeader;