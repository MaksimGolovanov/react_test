// src/modules/Naryad/ui/OrderTable/OrderTable.tsx

import React from 'react';
import { Table, Tag } from 'antd';
import orderStore from '../../store/OrderStore';

const statusColors = { draft: 'orange', active: 'green', closed: 'gray' };

const OrderTable: React.FC<any> = ({ data, selectedRowKeys, onSelectionChange, currentPage, pageSize, total, onPaginationChange }) => {
    const columns = [
        { title: 'Номер', dataIndex: 'number', key: 'number', render: (text: string) => <strong>{text}</strong> },
        { title: 'Место работы', dataIndex: 'data', key: 'workPlace', render: (data: any) => data?.workPlace || '' },
        { title: 'Ответственный', dataIndex: 'data', key: 'responsibleConduct', render: (data: any) => data?.responsibleConduct || '' },
        { title: 'Статус', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag> },
        { title: 'Дата создания', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => new Date(date).toLocaleDateString() },
        {
            title: 'Тип наряда',
            dataIndex: 'templateCode',
            key: 'templateCode',
            render: (code: string) => {
                const template = orderStore.templates.find(t => t.code === code);
                return template ? template.name : code;
            }
        }
    ];

    return (
        <Table
            rowSelection={{ selectedRowKeys, onChange: onSelectionChange, type: 'radio', columnWidth: 60 }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ current: currentPage, pageSize, total, onChange: onPaginationChange }}
        />
    );
};

export default OrderTable;