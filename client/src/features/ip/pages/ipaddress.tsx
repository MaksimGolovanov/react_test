// src/modules/IpAddress/pages/ipaddress.tsx
import React, { useState, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, Card, Skeleton } from 'antd';
import IpStore from '../store/IpStore';
import styles from './style.module.css';
import IpTable from '../ui/IpTable/IpTable';
import IpModal from '../ui/IpModal/IpModal';
import IpHeader from '../ui/IpHeader/IpHeader';
import { IpAddress, SortConfig } from '../types/ip.types';

const ipToNumber = (ip: string): number => {
  if (!ip) return 0;
  return ip.split('.').reduce((acc, octet, idx) => acc + parseInt(octet, 10) * Math.pow(256, 3 - idx), 0);
};

const IpAddressPage: React.FC = observer(() => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'ip', direction: 'ascending' });
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentIp, setCurrentIp] = useState<IpAddress | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<IpAddress | null>(null);

  const filteredIps = useMemo<IpAddress[]>(() => {
    if (!IpStore.ipaddress) return [];
    const term = searchTerm.toLowerCase();
    return IpStore.ipaddress.filter(ip =>
      ip.ip?.includes(searchTerm) ||
      ip.description?.toLowerCase().includes(term) ||
      ip.device_type?.toLowerCase().includes(term)
    );
  }, [searchTerm, IpStore.ipaddress]);

  const sortedIps = useMemo<IpAddress[]>(() => {
    if (!filteredIps.length) return [];
    const { key, direction } = sortConfig;
    const sorted = [...filteredIps];
    if (!key) return sorted;

    sorted.sort((a, b) => {
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
    return sorted;
  }, [filteredIps, sortConfig]);

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
    <div className={styles.container}>
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
      <div className={styles.tableCard}>
        <div className={styles.userListScroll}>
          <IpTable
            data={sortedIps}
            sortConfig={sortConfig}
            onSort={requestSort}
            selectedRowKeys={selectedRowKeys}
            onSelectionChange={(keys, rows) => {
              setSelectedRowKeys(keys);
              setSelectedRow(rows[0] || null);
            }}
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