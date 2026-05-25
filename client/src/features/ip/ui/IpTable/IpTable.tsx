// src/modules/IpAddress/ui/IpTable/IpTable.tsx
import React from 'react';
import { Table, Tag, Tooltip } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { IpAddress, IpTableProps } from '../../types/ip.types';

const deviceColorMap: Record<string, string> = {
  Компьютер: 'blue',
  Сервер: 'purple',
  Принтер: 'orange',
  Коммутатор: 'green',
  Маршрутизатор: 'cyan',
  Другое: 'default',
};

const getSortIcon = (sortConfig: IpTableProps['sortConfig'], key: keyof IpAddress) => {
  if (sortConfig.key !== key) return null;
  return sortConfig.direction === 'ascending'
    ? <SortAscendingOutlined style={{ marginLeft: 5 }} />
    : <SortDescendingOutlined style={{ marginLeft: 5 }} />;
};

const IpTable: React.FC<IpTableProps> = ({
  data,
  sortConfig,
  onSort,
  selectedRowKeys,
  onSelectionChange,
}) => {
  const columns = [
    {
      title: <span onClick={() => onSort('ip')} style={{ cursor: 'pointer' }}>IP-адрес {getSortIcon(sortConfig, 'ip')}</span>,
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (text: string) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{text}</Tag>,
    },
    {
      title: <span onClick={() => onSort('subnet_mask')} style={{ cursor: 'pointer' }}>Маска подсети {getSortIcon(sortConfig, 'subnet_mask')}</span>,
      dataIndex: 'subnet_mask',
      key: 'subnet_mask',
      width: 130,
      render: (text?: string) => text || '—',
    },
    {
      title: <span onClick={() => onSort('device_type')} style={{ cursor: 'pointer' }}>Тип устройства {getSortIcon(sortConfig, 'device_type')}</span>,
      dataIndex: 'device_type',
      key: 'device_type',
      width: 200,
      render: (type?: string) => type ? (
        <Tag color={deviceColorMap[type] || 'geekblue'} style={{ borderRadius: 20, padding: '2px 12px' }}>
          {type}
        </Tag>
      ) : '—',
    },
    {
      title: <span onClick={() => onSort('switch')} style={{ cursor: 'pointer' }}>Коммутатор {getSortIcon(sortConfig, 'switch')}</span>,
      dataIndex: 'switch',
      key: 'switch',
      width: 200,
      render: (text?: string) => text || '—',
    },
    {
      title: <span onClick={() => onSort('switch_port')} style={{ cursor: 'pointer' }}>Порт {getSortIcon(sortConfig, 'switch_port')}</span>,
      dataIndex: 'switch_port',
      key: 'switch_port',
      width: 200,
      render: (text?: string) => text || '—',
    },
    {
      title: <span onClick={() => onSort('network_segment')} style={{ cursor: 'pointer' }}>Сегмент сети {getSortIcon(sortConfig, 'network_segment')}</span>,
      dataIndex: 'network_segment',
      key: 'network_segment',
      width: 200,
      render: (text?: string) => text || '—',
    },
    {
      title: <span onClick={() => onSort('description')} style={{ cursor: 'pointer' }}>Описание {getSortIcon(sortConfig, 'description')}</span>,
      dataIndex: 'description',
      key: 'description',
      ellipsis: { showTitle: false },
      render: (text?: string) => (
        <Tooltip title={text} placement="topLeft">
          {text || <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>нет описания</span>}
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      sticky
      size="middle"
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectionChange,
        type: 'radio',
        columnWidth: 60,
      }}
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={false}
      style={{ width: '100%' }}
    />
  );
};

export default IpTable;