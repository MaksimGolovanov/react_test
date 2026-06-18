// src/features/usb/pages/UsbPage.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin, Alert, Card, theme } from 'antd';
import { useUsbData } from '../hooks/useUsbData';
import { useUsbFilters } from '../hooks/useUsbFilters';
import { useUsbNotifications } from '../hooks/useUsbNotifications';
import { useUsbForm } from '../hooks/useUsbForm';
import UsbHeader from '../ui/UsbHeader/UsbHeader';
import UsbTable from '../ui/UsbTable/UsbTable';
import UsbModal from '../ui/UsbModal/UsbModal';
import NotificationStatusBar from '../ui/NotificationStatusBar/NotificationStatusBar';
import styles from './style.module.css';

const { useToken } = theme;

const UsbPage = observer(() => {
  const { token } = useToken();
  const { usbData, staffData, loading, error, refetchUsbData } = useUsbData();
  const {
    searchTerm,
    setSearchTerm,
    showInWorkOnly,
    toggleShowInWorkOnly,
    sortConfig,
    handleSort,
  } = useUsbFilters();
  const {
    sendingState,
    hasUsbsToNotify,
    sendReminders,
    closeStatusBar,
    isSending,
  } = useUsbNotifications(usbData);
  const {
    showModal,
    currentUsb,
    selectedId,
    formData,
    setShowModal,
    setFormData,
    handleCheckboxChange,
    handleAddNew,
    handleEdit,
    handleSubmit,
    getFioSuggestions,
  } = useUsbForm(staffData, refetchUsbData);

  // Фильтрация и сортировка
  const filteredAndSortedData = useMemo(() => {
    let filtered =
      usbData?.filter((usb) => {
        const matchSearch =
          (usb.num_form && usb.num_form.includes(searchTerm)) ||
          (usb.ser_num &&
            usb.ser_num.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (usb.fio && usb.fio.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchWork =
          !showInWorkOnly || (usb.log && usb.log.toLowerCase() === 'да');
        return matchSearch && matchWork;
      }) || [];

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === 'num_form') {
          const numA = parseInt(a.num_form) || 0;
          const numB = parseInt(b.num_form) || 0;
          return sortConfig.direction === 'ascending'
            ? numA - numB
            : numB - numA;
        }
        if (sortConfig.key === 'volume') {
          const numA = parseFloat(a[sortConfig.key]) || 0;
          const numB = parseFloat(b[sortConfig.key]) || 0;
          return sortConfig.direction === 'ascending'
            ? numA - numB
            : numB - numA;
        }
        if (sortConfig.key.includes('data')) {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          if (isNaN(dateA.getTime()))
            return sortConfig.direction === 'ascending' ? -1 : 1;
          if (isNaN(dateB.getTime()))
            return sortConfig.direction === 'ascending' ? 1 : -1;
          return sortConfig.direction === 'ascending'
            ? dateA - dateB
            : dateB - dateA;
        }
        const valA = a[sortConfig.key]
          ? a[sortConfig.key].toString().toLowerCase()
          : '';
        const valB = b[sortConfig.key]
          ? b[sortConfig.key].toString().toLowerCase()
          : '';
        if (valA === valB) return 0;
        const cmp = valA < valB ? -1 : 1;
        return sortConfig.direction === 'ascending' ? cmp : -cmp;
      });
    }
    return filtered;
  }, [usbData, searchTerm, showInWorkOnly, sortConfig]);

  const handleEditUsb = useCallback(() => {
    if (selectedId) {
      handleEdit(selectedId, usbData);
    }
  }, [selectedId, usbData, handleEdit]);

  if (error) {
    return (
      <Alert
        message="Ошибка загрузки данных"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: 24 }}
      />
    );
  }

  if (loading) {
    return (
      <Spin
        tip="Загрузка USB-накопителей..."
        style={{ display: 'block', textAlign: 'center', margin: 50 }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <UsbHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        onEdit={handleEditUsb}
        selectedId={selectedId}
        usbData={usbData}
        showInWorkOnly={showInWorkOnly}
        onToggleShowInWorkOnly={toggleShowInWorkOnly}
        onSendReminders={sendReminders}
        isSending={isSending}
        hasUsbsToNotify={hasUsbsToNotify}
        sendingState={sendingState}
      />
      <NotificationStatusBar sendingState={sendingState} onClose={closeStatusBar} />
      <div
        className={styles.tableCard}
        style={{
          background: token.colorBgContainer,
          boxShadow: token.boxShadow,
        }}
      >
        <div className={styles.userListScroll}>
          <UsbTable
            data={filteredAndSortedData}
            sortConfig={sortConfig} 
            onSort={handleSort}
            selectedId={selectedId}
            onSelectionChange={handleCheckboxChange}
            formatDate={(date) =>
              date ? new Date(date).toLocaleDateString('ru-RU') : '-'
            }
            getNextCheckDate={(dateStr) => {
              if (!dateStr) return null;
              const d = new Date(dateStr);
              d.setDate(d.getDate() + 90);
              return d;
            }}
          />
        </div>
      </div>
      <UsbModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        currentUsb={currentUsb}
        staff={staffData}
        getFioSuggestions={getFioSuggestions}
      />
    </div>
  );
});

export default UsbPage;