// src/features/plans/ui/PlanTable/PlanTable.jsx
import React from 'react';
import { Table, Tag, theme } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

const { useToken } = theme;

const PlanTable = ({ data, sortConfig, onSort, selectedId, onSelectionChange, formatDate }) => {
  const { token } = useToken();

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <SortAscendingOutlined style={{ marginLeft: 5 }} /> : <SortDescendingOutlined style={{ marginLeft: 5 }} />;
  };

  const getStatusTag = (status) => {
    const colors = {
      draft: 'default', active: 'processing', completed: 'success'
    };
    return <Tag color={colors[status] || 'default'}>{status === 'draft' ? 'Черновик' : status === 'active' ? 'В работе' : 'Завершен'}</Tag>;
  };

  const columns = [
    { title: <span onClick={() => onSort('title')} style={{ cursor: 'pointer' }}>Название {getSortIcon('title')}</span>, dataIndex: 'title', key: 'title', ellipsis: true },
    { title: <span onClick={() => onSort('location')} style={{ cursor: 'pointer' }}>Место работ {getSortIcon('location')}</span>, dataIndex: 'location', key: 'location' },
    { title: <span onClick={() => onSort('responsible')} style={{ cursor: 'pointer' }}>Ответственный {getSortIcon('responsible')}</span>, dataIndex: 'responsible', key: 'responsible', ellipsis: true },
    { title: <span onClick={() => onSort('created_at')} style={{ cursor: 'pointer' }}>Дата создания {getSortIcon('created_at')}</span>, dataIndex: 'created_at', key: 'created_at', render: formatDate },
    { title: <span onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>Статус {getSortIcon('status')}</span>, dataIndex: 'status', key: 'status', render: getStatusTag },
  ];

  const rowSelection = {
    selectedRowKeys: selectedId ? [selectedId] : [],
    onChange: (keys) => onSelectionChange(keys[0] || null),
    type: 'radio',
  };

  return (
    <Table
      size="middle"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data.map(item => ({ ...item, key: item.id }))}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default PlanTable;