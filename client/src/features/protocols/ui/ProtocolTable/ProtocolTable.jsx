// src/features/protocols/ui/ProtocolTable/ProtocolTable.jsx
import React from 'react';
import { Table, Tag, theme } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

const { useToken } = theme;

const ProtocolTable = ({
  data,
  sortConfig,
  onSort,
  selectedId, // одно значение, не массив
  onSelectionChange,
  formatDate,
}) => {
  const { token } = useToken();

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? (
      <SortAscendingOutlined style={{ marginLeft: 5 }} />
    ) : (
      <SortDescendingOutlined style={{ marginLeft: 5 }} />
    );
  };

  const getStatusTag = (status) => {
    const colors = { draft: 'default', signed: 'success', archived: 'warning' };
    const labels = { draft: 'Черновик', signed: 'Подписан', archived: 'Архив' };
    return <Tag color={colors[status] || 'default'}>{labels[status] || status}</Tag>;
  };

  const columns = [
    {
      title: <span onClick={() => onSort('number')} style={{ cursor: 'pointer' }}>Номер {getSortIcon('number')}</span>,
      dataIndex: 'number',
      key: 'number',
      ellipsis: true,
    },
    {
      title: <span onClick={() => onSort('organization')} style={{ cursor: 'pointer' }}>Организация {getSortIcon('organization')}</span>,
      dataIndex: 'organization',
      key: 'organization',
      ellipsis: true,
    },
    {
      title: <span onClick={() => onSort('date')} style={{ cursor: 'pointer' }}>Дата {getSortIcon('date')}</span>,
      dataIndex: 'date',
      key: 'date',
      render: formatDate,
    },
    {
      title: <span onClick={() => onSort('programName')} style={{ cursor: 'pointer' }}>Программа {getSortIcon('programName')}</span>,
      dataIndex: 'programName',
      key: 'programName',
      ellipsis: true,
    },
    {
      title: <span onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>Статус {getSortIcon('status')}</span>,
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedId ? [selectedId] : [],
    onChange: (keys) => onSelectionChange(keys[0] || null),
    type: 'radio', // одиночный выбор
  };

  return (
    <Table
      size="middle"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data.map((item) => ({ ...item, key: item.id }))}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ProtocolTable;