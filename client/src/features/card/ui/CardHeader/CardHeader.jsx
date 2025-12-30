import React, { useMemo, memo } from "react";
import { Button, Input, Space, message, Switch } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./CardHeader.module.css";

const CardHeader = memo(
  ({
    searchTerm,
    onSearchChange,
    onAddNew,
    onEdit,
    onDelete,
    selectedIds,
    cardData,
    showInWorkOnly,
    showNotInWorkOnly,
    onToggleShowInWorkOnly,
    onToggleShowNotInWorkOnly,
    stats = { total: 0, inWork: 0, notInWork: 0 },
  }) => {
    const handleEditClick = React.useCallback(() => {
      if (selectedIds.length === 0) {
        message.warning("Выберите карту для редактирования");
        return;
      }
      onEdit();
    }, [selectedIds, onEdit]);

    const handleDeleteClick = React.useCallback(() => {
      if (selectedIds.length === 0) {
        message.warning("Выберите карту для удаления");
        return;
      }
      onDelete();
    }, [selectedIds, onDelete]);

    // Если stats не передан, вычисляем из cardData
    const calculatedStats = useMemo(() => {
      if (stats && stats.total !== undefined) {
        return stats;
      }

      return {
        total: cardData?.length || 0,
        inWork:
          cardData?.filter((u) => u.log?.toLowerCase() === "да").length || 0,
        notInWork:
          cardData?.filter((u) => u.log?.toLowerCase() === "нет").length || 0,
      };
    }, [stats, cardData]);

    return (
      <div className={styles.header}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div className={styles.actionsRow}>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
                Добавить
              </Button>

              <Button
                icon={<EditOutlined />}
                onClick={handleEditClick}
                type="default"
                disabled={selectedIds.length === 0}
              >
                Редактировать
              </Button>
              
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                disabled={selectedIds.length === 0}
              >
                Удалить
              </Button>

              <div className={styles.switchContainer}>
                <Space>
                  <span className={styles.switchLabel}>Только в работе:</span>
                  <Switch
                    size="small"
                    checked={showInWorkOnly}
                    onChange={onToggleShowInWorkOnly}
                    disabled={showNotInWorkOnly}
                  />
                  <span className={styles.switchLabel}>
                    Только не в работе:
                  </span>
                  <Switch
                    size="small"
                    checked={showNotInWorkOnly}
                    onChange={onToggleShowNotInWorkOnly}
                    disabled={showInWorkOnly}
                  />
                </Space>
              </div>
            </Space>
          </div>

          <div className={styles.searchStatsRow}>
            <Input
              placeholder="Поиск по серийному номеру или ФИО..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: 400 }}
              allowClear
            />

            <div className={styles.statsContainer}>
              <Space size="small">
                <span className={styles.statItem}>
                  Всего: <strong>{calculatedStats.total}</strong>
                </span>
                <span className={styles.statItem}>
                  В работе:{" "}
                  <strong className={styles.statInWork}>
                    {calculatedStats.inWork}
                  </strong>
                </span>
                <span className={styles.statItem}>
                  Не в работе:{" "}
                  <strong className={styles.statNotInWork}>
                    {calculatedStats.notInWork}
                  </strong>
                </span>
              </Space>
            </div>
          </div>
        </Space>
      </div>
    );
  }
);

export default CardHeader;