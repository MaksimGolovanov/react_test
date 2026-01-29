import { useMemo } from "react";
import { Table, Tooltip } from "antd";
import SortableHeader from "../SortableHeader/SortableHeader";
import {
  formatDate,
  getNextCheckDate,
} from "../../utils/utils";

import styles from "./CardTable.module.css";

const CardTable = ({
  data,
  selectedIds,
  onCheckboxChange,
  sortConfig,
  onSort,
}) => {
  // Функция для определения цвета ячейки
  const getCellColor = (record) => {
    // Если карта не в работе, не подсвечиваем
    if (record.log && record.log.toLowerCase().trim() === "нет") {
      return "";
    }

    const nextCheckDate = getNextCheckDate(record.data_prov);
    if (!nextCheckDate) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextCheck = new Date(nextCheckDate);
    nextCheck.setHours(0, 0, 0, 0);

    // Рассчитываем разницу в днях
    const diffTime = nextCheck - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "nextCheckOverdue"; // Просрочена
    } else if (diffDays <= 7) {
      return "nextCheckWarning"; // Осталось 7 дней или меньше
    }

    return "";
  };

  // Функция для получения подсказки
  const getDateTooltip = (record) => {
    if (!record.data_prov) return 'Дата проверки не указана';
    
    const nextCheckDate = getNextCheckDate(record.data_prov);
    if (!nextCheckDate) return 'Не удалось определить дату';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextCheck = new Date(nextCheckDate);
    nextCheck.setHours(0, 0, 0, 0);
    
    const diffTime = nextCheck - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Просрочено на ${Math.abs(diffDays)} дней`;
    } else if (diffDays <= 7) {
      return `Осталось ${diffDays} дней`;
    }
    
    return `Осталось ${diffDays} дней`;
  };

  // Настройка rowSelection для Ant Design Table
  const rowSelection = useMemo(() => ({
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys) => {
      if (selectedRowKeys.length === 0) {
        onCheckboxChange([]);
      } else if (selectedRowKeys.length === 1) {
        const newId = selectedRowKeys[0];
        if (selectedIds.includes(newId)) {
          onCheckboxChange([]);
        } else {
          onCheckboxChange(newId);
        }
      } else {
        const lastSelected = selectedRowKeys[selectedRowKeys.length - 1];
        onCheckboxChange(lastSelected);
      }
    },
    columnWidth: 23,
    type: 'radio',
  }), [selectedIds, onCheckboxChange]);

  const columns = useMemo(
    () => [
      {
        title: (
          <SortableHeader
            title="S/N"
            sortKey="ser_num"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "ser_num",
        key: "ser_num",
        width: 100,
        render: (text) => text || "-",
      },
      {
        title: (
          <SortableHeader
            title="Тип"
            sortKey="type"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "type",
        key: "type",
        width: 100,
        render: (text) => text || "-",
      },
      {
        title: (
          <SortableHeader
            title="Описание"
            sortKey="description"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "description",
        key: "description",
        width: 150,
        render: (text) => text || "-",
      },
      {
        title: (
          <SortableHeader
            title="ФИО"
            sortKey="fio"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "fio",
        key: "fio",
        width: 200,
        render: (text) => text || "-",
      },
      {
        title: (
          <SortableHeader
            title="Служба"
            sortKey="department"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "department",
        key: "department",
        width: 300,
        render: (text) => text || "-",
      },
      {
        title: (
          <SortableHeader
            title="Дата проверки"
            sortKey="data_prov"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "data_prov",
        key: "data_prov",
        width: 60,
        render: (text) => formatDate(text) || "-",
      },
      {
        title: "Дата следующей проверки",
        key: "nextCheckDate",
        width: 60,
        render: (_, record) => {
          const tooltip = getDateTooltip(record);
          const nextCheckDate = record.data_prov
            ? formatDate(getNextCheckDate(record.data_prov))
            : "-";
          
          return (
            <Tooltip title={tooltip}>
              <span>{nextCheckDate}</span>
            </Tooltip>
          );
        },
        // Добавляем className на уровне ячейки для окрашивания всей ячейки
        onCell: (record) => ({
          className: styles[getCellColor(record)] || ''
        }),
      },
      {
        title: (
          <SortableHeader
            title="В работе"
            sortKey="log"
            currentSort={sortConfig}
            onSort={onSort}
          />
        ),
        dataIndex: "log",
        key: "log",
        width: 40,
      },
    ],
    [sortConfig, onSort] // Убрана styles из зависимостей
  );

  const tableData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        key: item.id,
      })),
    [data]
  );

  // Функция для определения класса строки
  const getRowClassName = (record) => {
    // Если статус "нет", добавляем класс для желтого фона
    if (record.log && record.log.toLowerCase().trim() === "нет") {
      return styles.notInWorkRow;
    }
    return "";
  };

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowSelection={rowSelection}
      pagination={false}
      scroll={{ x: "max-content" }}
      style={{ width: "100%", fontSize: "12px" }}
      rowClassName={getRowClassName}
      bordered
      size="middle"
    />
  );
};

export default CardTable;