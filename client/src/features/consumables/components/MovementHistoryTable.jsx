// components/MovementHistoryTable.jsx
import React from 'react';
import { Table, Tag, theme } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { useToken } = theme;

const MovementHistoryTable = ({ movements }) => {
  const { token } = useToken();

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString('ru-RU'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag
          icon={type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          color={type === 'income' ? 'green' : 'red'}
        >
          {type === 'income' ? 'Приход' : 'Уход'}
        </Tag>
      ),
    },
    {
      title: 'Количество',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={movements}
      rowKey="id"
      pagination={{ pageSize: 5, size: 'small' }}
      size="small"
      style={{ marginTop: 8 }}
    />
  );
};

export default MovementHistoryTable;
