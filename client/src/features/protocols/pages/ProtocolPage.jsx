// src/features/protocols/pages/ProtocolPage.jsx
// ... (без изменений в импортах, только удаляем состояние selectedIds)
import React, { useMemo, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin, Alert, theme } from 'antd';
import { useProtocolData } from '../hooks/useProtocolData';
import { useProtocolFilters } from '../hooks/useProtocolFilters';
import { useProtocolForm } from '../hooks/useProtocolForm';
import ProtocolHeader from '../ui/ProtocolHeader/ProtocolHeader';
import ProtocolTable from '../ui/ProtocolTable/ProtocolTable';
import ProtocolModal from '../ui/ProtocolModal/ProtocolModal';
import DictionaryManager from '../ui/DictionaryManager/DictionaryManager';
import GenerateCertificatesModal from '../ui/GenerateCertificatesModal/GenerateCertificatesModal';
import { downloadProtocolDocx } from '../utils/ProtocolDocxGenerator';
import styles from './style.module.css';

const { useToken } = theme;

const ProtocolPage = observer(() => {
  const [showDictionaryManager, setShowDictionaryManager] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  // Убрали selectedIds
  const { token } = useToken();
  const { protocols, loading, error, refetchProtocols } = useProtocolData();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortConfig,
    handleSort,
  } = useProtocolFilters();
  const {
    showModal,
    currentProtocol,
    selectedId,
    formData,
    setShowModal,
    setFormData,
    setSelectedId,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSubmit,
  } = useProtocolForm(refetchProtocols);

  const filteredAndSortedData = useMemo(() => {
    let filtered =
      protocols?.filter((protocol) => {
        const matchSearch =
          protocol.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          protocol.organization?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
          statusFilter === 'all' || protocol.status === statusFilter;
        return matchSearch && matchStatus;
      }) || [];

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key.includes('date') || sortConfig.key === 'createdAt') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
        const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
        return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return filtered;
  }, [protocols, searchTerm, statusFilter, sortConfig]);

  const handleEditProtocol = useCallback(() => {
    if (selectedId) {
      handleEdit(selectedId, protocols);
    }
  }, [selectedId, protocols, handleEdit]);

  const handleDownloadDocx = useCallback(async () => {
    if (!selectedId) return;
    const protocolData = protocols.find((p) => p.id === selectedId);
    if (!protocolData) return;
    await downloadProtocolDocx(protocolData);
  }, [selectedId, protocols]);

  if (error)
    return <Alert message="Ошибка загрузки" description={error.message} type="error" showIcon style={{ margin: 24 }} />;
  if (loading)
    return <Spin tip="Загрузка протоколов..." style={{ display: 'block', textAlign: 'center', margin: 50 }} />;

  return (
    <div className={styles.container}>
      <ProtocolHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAddNew={handleAddNew}
        onEdit={handleEditProtocol}
        onDelete={() => handleDelete(selectedId)}
        onDownload={handleDownloadDocx}
        selectedId={selectedId}
        onManageDictionaries={() => setShowDictionaryManager(true)}
        onGenerateCertificates={() => setShowCertModal(true)}
      />
      <div
        className={styles.tableCard}
        style={{ background: token.colorBgContainer, boxShadow: token.boxShadow }}
      >
        <div className={styles.protocolListScroll}>
          <ProtocolTable
            data={filteredAndSortedData}
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedId={selectedId}
            onSelectionChange={setSelectedId}
            formatDate={(date) => (date ? new Date(date).toLocaleDateString('ru-RU') : '-')}
          />
        </div>
      </div>
      <ProtocolModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        currentProtocol={currentProtocol}
        formData={formData}
        setFormData={setFormData}
      />
      <DictionaryManager visible={showDictionaryManager} onClose={() => setShowDictionaryManager(false)} />
      <GenerateCertificatesModal
        visible={showCertModal}
        onClose={() => setShowCertModal(false)}
        protocols={protocols}
      />
    </div>
  );
});

export default ProtocolPage;