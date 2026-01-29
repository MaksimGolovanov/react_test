import React from 'react'
import { Table, Tooltip } from 'antd'
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import styles from './UsbTable.module.css'

const UsbTable = ({ 
  data, 
  sortConfig, 
  onSort, 
  selectedIds, 
  onSelectionChange,
  formatDate,
  getNextCheckDate
}) => {
  
  // Функция для определения класса для ячейки с датой следующей проверки
  const getDateCellColor = (record) => {
    if (!record.data_prov || record.log?.toLowerCase()?.trim() === 'нет') {
      return '';
    }

    const nextCheckDate = getNextCheckDate(record.data_prov);
    if (!nextCheckDate) return '';

    const now = new Date();
    const nextCheck = new Date(nextCheckDate);
    
    // Если дата просрочена
    if (nextCheck < now) {
      return styles.nextCheckOverdue;
    }
    
    // Вычисляем разницу в днях
    const diffTime = nextCheck - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Если осталось 7 дней или меньше
    if (diffDays <= 7 && diffDays >= 0) {
      return styles.nextCheckWarning;
    }
    
    return '';
  }

  // Функция для получения подсказки
  const getDateTooltip = (record) => {
    if (!record.data_prov) return 'Дата проверки не указана';
    
    const nextCheckDate = getNextCheckDate(record.data_prov);
    const now = new Date();
    const nextCheck = new Date(nextCheckDate);
    
    if (nextCheck < now) {
      const diffTime = now - nextCheck;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Просрочено на ${diffDays} дней`;
    }
    
    const diffTime = nextCheck - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `Осталось ${diffDays} дней`;
    }
    
    return `Осталось ${diffDays} дней`;
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? (
      <SortAscendingOutlined style={{ marginLeft: 5 }} />
    ) : (
      <SortDescendingOutlined style={{ marginLeft: 5 }} />
    )
  }

  const columns = [
    
    {
      title: (
        <span onClick={() => onSort('num_form')} style={{ cursor: 'pointer' }}>
          Форма {getSortIcon('num_form')}
        </span>
      ),
      dataIndex: 'num_form',
      key: 'num_form',
      width: 50,
      render: (text) => text || '-',
    },
    {
      title: (
        <span onClick={() => onSort('ser_num')} style={{ cursor: 'pointer' }}>
          Серийный номер {getSortIcon('ser_num')}
        </span>
      ),
      dataIndex: 'ser_num',
      key: 'ser_num',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: (
        <span onClick={() => onSort('volume')} style={{ cursor: 'pointer' }}>
          Объем {getSortIcon('volume')}
        </span>
      ),
      dataIndex: 'volume',
      key: 'volume',
      width: 40,
      render: (text) => text || '-',
    },
    {
      title: (
        <span onClick={() => onSort('data_uch')} style={{ cursor: 'pointer' }}>
          Дата регистрации {getSortIcon('data_uch')}
        </span>
      ),
      dataIndex: 'data_uch',
      key: 'data_uch',
      width: 120,
      render: (text) => formatDate(text) || '-',
    },
    {
      title: (
        <span onClick={() => onSort('email')} style={{ cursor: 'pointer' }}>
          Email {getSortIcon('email')}
        </span>
      ),
      dataIndex: 'email',
      key: 'email',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: (
        <span onClick={() => onSort('fio')} style={{ cursor: 'pointer' }}>
          ФИО {getSortIcon('fio')}
        </span>
      ),
      dataIndex: 'fio',
      key: 'fio',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: (
        <span onClick={() => onSort('department')} style={{ cursor: 'pointer' }}>
          Служба {getSortIcon('department')}
        </span>
      ),
      dataIndex: 'department',
      key: 'department',
      width: 180,
      render: (text) => text || '-',
    },
    {
      title: (
        <span onClick={() => onSort('data_prov')} style={{ cursor: 'pointer' }}>
          Дата проверки {getSortIcon('data_prov')}
        </span>
      ),
      dataIndex: 'data_prov',
      key: 'data_prov',
      width: 120,
      render: (text) => formatDate(text) || '-',
    },
    {
      title: 'Дата следующей проверки',
      key: 'next_check_date',
      width: 120,
      render: (_, record) => {
        const nextCheckDate = getNextCheckDate(record.data_prov);
        const tooltip = getDateTooltip(record);
        
        return (
          <Tooltip title={tooltip}>
            <span>{record.data_prov ? formatDate(nextCheckDate) : '-'}</span>
          </Tooltip>
        );
      },
      // Важно: добавляем className на уровне колонки
      onCell: (record) => ({
        className: getDateCellColor(record)
      }),
    },
    {
      title: (
        <span onClick={() => onSort('log')} style={{ cursor: 'pointer' }}>
          В работе {getSortIcon('log')}
        </span>
      ),
      dataIndex: 'log',
      key: 'log',
      width: 60,

    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedKeys) => {
      const newSelectedIds = data
        .filter(item => selectedKeys.includes(item.key || item.id))
        .map(item => item.id)
      
      if (newSelectedIds.length > 0) {
        onSelectionChange(newSelectedIds[0])
      } else {
        onSelectionChange([])
      }
    },
    type: 'radio',
    columnWidth: 60,
  }

  const dataWithKeys = data.map(item => ({
    ...item,
    key: item.id || item.key,
  }))

  return (
    <Table
      size="small"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataWithKeys}
      rowKey="id"
      pagination={false}
      scroll={{ x: 'max-content' }}
      style={{ width: '100%', fontSize: '12px' }} 
      rowClassName={(record) => {
        const isNotInWork = record.log?.toLowerCase()?.trim() === 'нет'
        return isNotInWork ? styles.notInWorkRow : ''
      }}
    />
  )
}

export default UsbTable