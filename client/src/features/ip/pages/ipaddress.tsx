// src/modules/IpAddress/pages/ipaddress.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Skeleton, theme } from 'antd';
import IpStore from '../store/IpStore';
import styles from './style.module.css';
import IpTable from '../ui/IpTable/IpTable';
import IpModal from '../ui/IpModal/IpModal';
import IpHeader from '../ui/IpHeader/IpHeader';
import { IpAddress, SortConfig } from '../types/ip.types';

const { useToken } = theme;

const ipToNumber = (ip: string): number => {
  if (!ip) return 0;
  return ip.split('.').reduce((acc, octet, idx) => acc + parseInt(octet, 10) * Math.pow(256, 3 - idx), 0);
};

const IpAddressPage: React.FC = observer(() => {
  const { token } = useToken();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ip', direction: 'ascending' });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentIp, setCurrentIp] = useState<IpAddress | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<IpAddress | null>(null);

  // Состояния пагинации
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(16);

  // Фильтрация и сортировка (все данные)
  const filteredAndSortedIps = useMemo<IpAddress[]>(() => {
    if (!IpStore.ipaddress) return [];
    const term = searchTerm.toLowerCase();
    let filtered = IpStore.ipaddress.filter(ip =>
      ip.ip?.includes(searchTerm) ||
      ip.description?.toLowerCase().includes(term) ||
      ip.device_type?.toLowerCase().includes(term)
    );

    // Сортировка
    const { key, direction } = sortConfig;
    if (key) {
      filtered.sort((a, b) => {
        if (key === 'ip') {
          const aVal = ipToNumber(a.ip);
          const bVal = ipToNumber(b.ip);
          return direction === 'ascending' ? aVal - bVal : bVal - aVal;
        }
        const aVal = a[key] ?? '';
        const bVal = b[key] ?? '';
        if (aVal === bVal) return 0;
        const cmp = aVal < bVal ? -1 : 1;
        return direction === 'ascending' ? cmp : -cmp;
      });
    }
    return filtered;
  }, [IpStore.ipaddress, searchTerm, sortConfig]);

  // Пагинация
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedIps.slice(start, start + pageSize);
  }, [filteredAndSortedIps, currentPage, pageSize]);

  // Сброс на первую страницу при изменении фильтра или сортировки
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  const requestSort = (key: keyof IpAddress) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const handleAddNew = () => {
    setCurrentIp(null);
    setIsModalVisible(true);
  };

  const handleEdit = (ip: IpAddress) => {
    setCurrentIp(ip);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setCurrentIp(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    setSelectedRowKeys([]);
    setSelectedRow(null);
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    setSelectedRowKeys([]); // сброс выбора при смене страницы
    setSelectedRow(null);
  };

  if (IpStore.error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert message="Ошибка загрузки данных" description={IpStore.error.message} type="error" showIcon />
      </div>
    );
  }

  if (IpStore.isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className={styles.container} >
      <IpHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        selectedRow={selectedRow}
        onEdit={handleEdit}
        onDelete={() => {
          setSelectedRowKeys([]);
          setSelectedRow(null);
        }}
      />
      <div className={styles.tableCard} style={{ background: token.colorBgContainer, boxShadow: token.boxShadow }}>
        <div className={styles.userListScroll}>
          <IpTable
            data={paginatedData}
            sortConfig={sortConfig}
            onSort={requestSort}
            selectedRowKeys={selectedRowKeys}
            onSelectionChange={(keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectedRow(rows[0] || null);
            }}
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredAndSortedIps.length}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
      <IpModal
        visible={isModalVisible}
        currentIp={currentIp}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
});

export default IpAddressPage;