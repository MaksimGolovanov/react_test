import React, { useMemo, memo } from "react";
import { Button, Input, Space, message, Switch, theme } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./CardHeader.module.css";

const { useToken } = theme;

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
    const { token } = useToken();

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

    const calculatedStats = useMemo(() => {
      if (stats && stats.total !== undefined) return stats;
      return {
        total: cardData?.length || 0,
        inWork: cardData?.filter((u) => u.log?.toLowerCase() === "да").length || 0,
        notInWork: cardData?.filter((u) => u.log?.toLowerCase() === "нет").length || 0,
      };
    }, [stats, cardData]);

    return (
      <div >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div className={styles.actionsRow}>
            <Space wrap>
              <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
                Добавить
              </Button>
              <Button icon={<EditOutlined />} onClick={handleEditClick} disabled={selectedIds.length === 0}>
                Редактировать
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDeleteClick} disabled={selectedIds.length === 0}>
                Удалить
              </Button>
              <div className={styles.switchContainer}>
                <Space>
                  <span className={styles.switchLabel} style={{ color: token.colorTextSecondary }}>
                    Только в работе:
                  </span>
                  <Switch size="small" checked={showInWorkOnly} onChange={onToggleShowInWorkOnly} disabled={showNotInWorkOnly} />
                  <span className={styles.switchLabel} style={{ color: token.colorTextSecondary }}>
                    Только не в работе:
                  </span>
                  <Switch size="small" checked={showNotInWorkOnly} onChange={onToggleShowNotInWorkOnly} disabled={showInWorkOnly} />
                </Space>
              </div>
            </Space>
          </div>
          <div className={styles.searchStatsRow} style={{ borderTopColor: token.colorBorder }}>
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
                <span className={styles.statItem} style={{ color: token.colorTextSecondary }}>
                  Всего: <strong style={{ color: token.colorText }}>{calculatedStats.total}</strong>
                </span>
                <span className={styles.statItem} style={{ color: token.colorTextSecondary }}>
                  В работе: <strong style={{ color: token.colorSuccess }}>{calculatedStats.inWork}</strong>
                </span>
                <span className={styles.statItem} style={{ color: token.colorTextSecondary }}>
                  Не в работе: <strong style={{ color: token.colorWarning }}>{calculatedStats.notInWork}</strong>
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