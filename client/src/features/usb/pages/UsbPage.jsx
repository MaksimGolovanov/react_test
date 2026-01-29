import React from "react";
import { observer } from "mobx-react-lite";
import { Container, Card, Alert, Spinner } from "react-bootstrap";

// Импорт кастомных хуков
import { useUsbData } from "../hooks/useUsbData";
import { useUsbFilters } from "../hooks/useUsbFilters";
import { useUsbNotifications } from "../hooks/useUsbNotifications";
import { useUsbForm } from "../hooks/useUsbForm";

// Импорт утилит
import { formatDate, getNextCheckDate } from "../utils/dateUtils";
import { filterAndSortUsbs, getCellColorClass } from "../utils/usbUtils";

// Импорт компонентов UI
import UsbModal from "../ui/UsbModal/UsbModal";
import NotificationStatusBar from "../ui/NotificationStatusBar/NotificationStatusBar";
import UsbHeader from "../ui/UsbHeader/UsbHeader";
import UsbTable from "../ui/UsbTable/UsbTable";

import styles from "./style.module.css";

const UsbPage = observer(() => {
  // Хуки для данных
  const { usbData, staffData, loading, error, refetchUsbData } = useUsbData();

  // Хуки для фильтрации и сортировки
  const {
    searchTerm,
    setSearchTerm,
    showInWorkOnly,
    toggleShowInWorkOnly,
    sortConfig,
    handleSort,
  } = useUsbFilters();

  // Хуки для уведомлений
  const {
    sendingState,
    hasUsbsToNotify,
    sendReminders,
    closeStatusBar,
    isSending,
  } = useUsbNotifications(usbData);

  // Хуки для формы
  const {
    showModal,
    currentUsb,
    selectedIds,
    formData,
    setShowModal,
    setFormData,
    handleCheckboxChange,
    handleAddNew,
    handleEdit,
    handleSubmit,
    getFioSuggestions,
  } = useUsbForm(staffData, refetchUsbData);

  // Мемоизированные вычисления
  const filteredAndSortedData = React.useMemo(
    () => filterAndSortUsbs(usbData, searchTerm, showInWorkOnly, sortConfig),
    [usbData, searchTerm, showInWorkOnly, sortConfig]
  );

  const getCellColorClassMemoized = React.useCallback(
    (usb) => getCellColorClass(usb, getNextCheckDate, styles),
    []
  );

  const handleEditUsb = React.useCallback(() => {
    if (selectedIds.length > 0) {
      handleEdit(selectedIds[0], usbData);
    }
  }, [selectedIds, usbData, handleEdit]);

  // Пропсы для дочерних компонентов
  const usbHeaderProps = React.useMemo(
    () => ({
      searchTerm,
      onSearchChange: setSearchTerm,
      onAddNew: handleAddNew,
      onEdit: handleEditUsb,
      selectedIds,
      usbData,
      showInWorkOnly,
      onToggleShowInWorkOnly: toggleShowInWorkOnly,
      onSendReminders: sendReminders,
      isSending,
      hasUsbsToNotify,
      sendingState,
    }),
    [
      searchTerm,
      setSearchTerm, // Добавлено
      handleAddNew,
      handleEditUsb,
      selectedIds,
      usbData,
      showInWorkOnly,
      toggleShowInWorkOnly,
      sendReminders,
      isSending,
      hasUsbsToNotify,
      sendingState,
    ]
  );

  const usbTableProps = React.useMemo(
    () => ({
      data: filteredAndSortedData,
      sortConfig,
      onSort: handleSort,
      selectedIds,
      onSelectionChange: handleCheckboxChange,
      formatDate,
      getNextCheckDate,
      getCellColorClass: getCellColorClassMemoized,
    }),
    [
      filteredAndSortedData,
      sortConfig,
      handleSort,
      selectedIds,
      handleCheckboxChange,
      getCellColorClassMemoized,
    ]
  );

  // Состояния загрузки и ошибок
  if (error) {
    return (
      <Container className={styles.errorContainer}>
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки данных</Alert.Heading>
          <p>{error.message}</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className={styles.loadingContainer}>
        <Spinner animation="border" role="status" />
        <p className={styles.loadingText}>
          Загрузка данных о USB-накопителях...
        </p>
      </Container>
    );
  }

  return (
    <div className={styles.container}>
      <UsbHeader {...usbHeaderProps} />
      <NotificationStatusBar
        sendingState={sendingState}
        onClose={closeStatusBar}
      />

      <Card className={styles.tableCard}>
        <div className={styles.userListScroll}>
          <UsbTable {...usbTableProps} />
        </div>
      </Card>

      <UsbModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={(data) => handleSubmit(data, currentUsb)}
        formData={formData}
        onInputChange={(name, value) =>
          setFormData((prev) => ({ ...prev, [name]: value }))
        }
        currentUsb={currentUsb}
        staff={staffData}
        getFioSuggestions={getFioSuggestions}
      />
    </div>
  );
});

export default UsbPage;