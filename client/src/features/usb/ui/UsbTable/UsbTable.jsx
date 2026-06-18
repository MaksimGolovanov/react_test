// src/features/usb/ui/UsbTable/UsbTable.jsx
import React from 'react';
import { Table, Tooltip, theme } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

const { useToken } = theme;

const UsbTable = ({
  data,
  sortConfig,
  onSort,
  selectedId,
  onSelectionChange,
  formatDate,
  getNextCheckDate,
}) => {
  const { token } = useToken();

  const getDateCellStyle = (record) => {
    if (!record.data_prov || record.log?.toLowerCase()?.trim() === 'нет')
      return { backgroundColor: 'transparent' };
    const nextCheck = getNextCheckDate(record.data_prov);
    if (!nextCheck) return {};
    const now = new Date();
    const diffDays = Math.ceil((nextCheck - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { backgroundColor: token.colorErrorBg, color: token.colorError };
    }
    if (diffDays <= 7) {
      return { backgroundColor: token.colorWarningBg, color: token.colorWarning };
    }
    return {};
  };

  const getTooltip = (record) => {
    if (!record.data_prov) return 'Дата проверки не указана';
    const nextCheck = getNextCheckDate(record.data_prov);
    const now = new Date();
    const diffDays = Math.ceil((nextCheck - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `Просрочено на ${-diffDays} дней`;
    if (diffDays <= 7) return `Осталось ${diffDays} дней`;
    return `Осталось ${diffDays} дней`;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? (
      <SortAscendingOutlined style={{ marginLeft: 5 }} />
    ) : (
      <SortDescendingOutlined style={{ marginLeft: 5 }} />
    );
  };

  const columns = [
    {
      title: <span onClick={() => onSort('num_form')} style={{ cursor: 'pointer' }}>Форма {getSortIcon('num_form')}</span>,
      dataIndex: 'num_form',
      key: 'num_form',
      render: (text) => text || '-',
    },
    {
      title: <span onClick={() => onSort('ser_num')} style={{ cursor: 'pointer' }}>Серийный номер {getSortIcon('ser_num')}</span>,
      dataIndex: 'ser_num',
      key: 'ser_num',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: <span onClick={() => onSort('volume')} style={{ cursor: 'pointer' }}>Объем {getSortIcon('volume')}</span>,
      dataIndex: 'volume',
      key: 'volume',
      render: (text) => text || '-',
    },
    {
      title: <span onClick={() => onSort('data_uch')} style={{ cursor: 'pointer' }}>Дата регистрации {getSortIcon('data_uch')}</span>,
      dataIndex: 'data_uch',
      key: 'data_uch',
      render: (text) => formatDate(text),
    },
    {
      title: <span onClick={() => onSort('email')} style={{ cursor: 'pointer' }}>Email {getSortIcon('email')}</span>,
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: <span onClick={() => onSort('fio')} style={{ cursor: 'pointer' }}>ФИО {getSortIcon('fio')}</span>,
      dataIndex: 'fio',
      key: 'fio',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: <span onClick={() => onSort('department')} style={{ cursor: 'pointer' }}>Служба {getSortIcon('department')}</span>,
      dataIndex: 'department',
      key: 'department',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: <span onClick={() => onSort('data_prov')} style={{ cursor: 'pointer' }}>Дата проверки {getSortIcon('data_prov')}</span>,
      dataIndex: 'data_prov',
      key: 'data_prov',
      render: (text) => formatDate(text),
    },
    {
      title: 'Дата следующей проверки',
      key: 'next_check',
      render: (_, record) => {
        const nextCheck = getNextCheckDate(record.data_prov);
        return (
          <Tooltip title={getTooltip(record)}>
            <span>{nextCheck ? formatDate(nextCheck) : '-'}</span>
          </Tooltip>
        );
      },
      onCell: (record) => ({
        style: getDateCellStyle(record),
      }),
    },
    {
      title: <span onClick={() => onSort('log')} style={{ cursor: 'pointer' }}>В работе {getSortIcon('log')}</span>,
      dataIndex: 'log',
      key: 'log',
      render: (text) => (text === 'Да' ? 'Да' : 'Нет'),
    },
  ];

  const dataWithKeys = data.map((item) => ({ ...item, key: item.id }));

  const rowSelection = {
    selectedRowKeys: selectedId ? [selectedId] : [],
    onChange: (selectedRowKeys) => {
      const newId = selectedRowKeys[0] || null;
      onSelectionChange(newId);
    },
    type: 'radio',
    columnWidth: 60,
  };

  return (
    <Table
      size="small"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataWithKeys}
      rowKey="id"
      pagination={false}
      
      rowClassName={(record) => (record.log?.toLowerCase() === 'нет' ? 'not-in-work-row' : '')}
    />
  );
};

export default UsbTable;