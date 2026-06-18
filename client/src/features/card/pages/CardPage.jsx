import { useState, useEffect, useCallback, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Card, Alert, Spin, message, Form, theme } from "antd";

import CardStore from "../store/CardStore";
import CardHeader from "../ui/CardHeader/CardHeader";
import CardTable from "../ui/CardTable/CardTable";
import CardModal from "../ui/CardModal/CardModal";
import DeleteModal from "../ui/DeleteModal/DeleteModal";
import { useCardActions } from "../hooks/useCardActions";
import { useCardFilter } from "../hooks/useCardFilter";
import { useCardSelection } from "../hooks/useCardSelection";
import styles from "./style.module.css";

const { useToken } = theme;

const CardPage = observer(() => {
  const { token } = useToken();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showInWorkOnly, setShowInWorkOnly] = useState(false);
  const [showNotInWorkOnly, setShowNotInWorkOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [form] = Form.useForm();

  const { handleDeleteCards, handleSaveCard } = useCardActions();
  const { sortedItems, fioSuggestions, cardStatistics } = useCardFilter(
    searchTerm,
    showInWorkOnly,
    showNotInWorkOnly,
    sortConfig
  );
  const {
    selectedIds,
    handleCheckboxChange,
    clearSelection,
    getSelectedCardsInfo,
  } = useCardSelection();

  useEffect(() => {
    CardStore.fetchCardAll();
    CardStore.fetchStaffAll();
  }, []);

  useEffect(() => {
    if (showInWorkOnly && showNotInWorkOnly) {
      setShowNotInWorkOnly(false);
    }
  }, [showInWorkOnly, showNotInWorkOnly]);

  const handleRequestSort = useCallback((key) => {
    setSortConfig((prev) => {
      let direction = "ascending";
      if (prev.key === key && prev.direction === "ascending") {
        direction = "descending";
      }
      return { key, direction };
    });
  }, []);

  const handleAddNew = useCallback(() => {
    setCurrentCard(null);
    form.resetFields();
    setShowModal(true);
  }, [form]);

  const handleEdit = useCallback(() => {
    if (selectedIds.length === 0) {
      message.warning("Выберите карту для редактирования");
      return;
    }
    const card = CardStore.card?.find((u) => u.id === selectedIds[0]);
    if (!card) return;

    setCurrentCard(card);
    form.setFieldsValue({
      ser_num: card.ser_num || "",
      type: card.type || "",
      description: card.description || "",
      fio: card.fio || "",
      department: card.department || "",
      data_prov: card.data_prov || "",
      log: card.log || "Да",
    });
    setShowModal(true);
  }, [selectedIds, form]);

  const handleConfirmDelete = useCallback(async () => {
    const success = await handleDeleteCards(selectedIds);
    if (success) {
      clearSelection();
      setShowDeleteModal(false);
    }
  }, [selectedIds, handleDeleteCards, clearSelection]);

  const handleSubmitCard = useCallback(
    async (values) => {
      const success = await handleSaveCard(values, currentCard);
      if (success) {
        setShowModal(false);
        clearSelection();
        setCurrentCard(null);
        form.resetFields();
      }
    },
    [currentCard, handleSaveCard, clearSelection, form]
  );

  const handleClearFio = useCallback(() => {
    form.setFieldsValue({ fio: "", department: "" });
  }, [form]);

  if (CardStore.error) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Ошибка загрузки данных"
          description={CardStore.error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (CardStore.isLoading && !CardStore.card) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p className={styles.loadingText}>Загрузка данных о картах доступа...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CardHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={() => setShowDeleteModal(true)}
        selectedIds={selectedIds}
        cardData={CardStore.card}
        showInWorkOnly={showInWorkOnly}
        showNotInWorkOnly={showNotInWorkOnly}
        onToggleShowInWorkOnly={setShowInWorkOnly}
        onToggleShowNotInWorkOnly={setShowNotInWorkOnly}
        stats={cardStatistics}
      />

      <div className={styles.tableCard} >
        <div className={styles.userListScroll}>
          <CardTable
            data={sortedItems}
            selectedIds={selectedIds}
            onCheckboxChange={handleCheckboxChange}
            sortConfig={sortConfig}
            onSort={handleRequestSort}
          />
        </div>
      </div>

      <CardModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCurrentCard(null);
          form.resetFields();
        }}
        currentCard={currentCard}
        form={form}
        onFinish={handleSubmitCard}
        onClearFio={handleClearFio}
        fioSuggestions={fioSuggestions}
        staffData={CardStore.staff || []}
        formData={currentCard || {}}
      />

      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        selectedIds={selectedIds}
        selectedCardsInfo={getSelectedCardsInfo}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
});

export default CardPage;