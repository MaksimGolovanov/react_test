import { useMemo } from "react";
import { Table, Tooltip, theme } from "antd";
import SortableHeader from "../SortableHeader/SortableHeader";
import { formatDate, getNextCheckDate } from "../../utils/utils";

const { useToken } = theme;

const CardTable = ({ data, selectedIds, onCheckboxChange, sortConfig, onSort }) => {
  const { token } = useToken();

  const getCellStyle = (record) => {
    if (record.log && record.log.toLowerCase().trim() === "нет") return {};
    const nextCheckDate = getNextCheckDate(record.data_prov);
    if (!nextCheckDate) return {};
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nextCheck = new Date(nextCheckDate);
    nextCheck.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((nextCheck - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { backgroundColor: token.colorErrorBg, color: token.colorError };
    }
    if (diffDays <= 7) {
      return { backgroundColor: token.colorWarningBg, color: token.colorWarning };
    }
    return {};
  };

  const getTooltip = (record) => {
    if (!record.data_prov) return "Дата проверки не указана";
    const nextCheckDate = getNextCheckDate(record.data_prov);
    if (!nextCheckDate) return "Не удалось определить дату";
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nextCheck = new Date(nextCheckDate);
    nextCheck.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((nextCheck - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `Просрочено на ${-diffDays} дней`;
    if (diffDays <= 7) return `Осталось ${diffDays} дней`;
    return `Осталось ${diffDays} дней`;
  };

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedIds,
      onChange: (keys) => {
        if (keys.length === 0) onCheckboxChange([]);
        else onCheckboxChange(keys[keys.length - 1]);
      },
      type: "radio",
      columnWidth: 60,
    }),
    [selectedIds, onCheckboxChange]
  );

  const columns = useMemo(
    () => [
      {
        title: <SortableHeader title="S/N" sortKey="ser_num" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "ser_num",
        key: "ser_num",
        width: 100,
        render: (text) => text || "-",
      },
      {
        title: <SortableHeader title="Тип" sortKey="type" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "type",
        key: "type",
        width: 100,
        render: (text) => text || "-",
      },
      {
        title: <SortableHeader title="Описание" sortKey="description" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "description",
        key: "description",
        width: 150,
        render: (text) => text || "-",
      },
      {
        title: <SortableHeader title="ФИО" sortKey="fio" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "fio",
        key: "fio",
        width: 200,
        render: (text) => text || "-",
      },
      {
        title: <SortableHeader title="Служба" sortKey="department" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "department",
        key: "department",
        width: 300,
        render: (text) => text || "-",
      },
      {
        title: <SortableHeader title="Дата проверки" sortKey="data_prov" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "data_prov",
        key: "data_prov",
        width: 120,
        render: (text) => formatDate(text) || "-",
      },
      {
        title: "Дата следующей проверки",
        key: "nextCheckDate",
        width: 140,
        render: (_, record) => {
          const nextCheckDate = record.data_prov ? formatDate(getNextCheckDate(record.data_prov)) : "-";
          return (
            <Tooltip title={getTooltip(record)}>
              <span>{nextCheckDate}</span>
            </Tooltip>
          );
        },
        onCell: (record) => ({
          style: getCellStyle(record),
        }),
      },
      {
        title: <SortableHeader title="В работе" sortKey="log" currentSort={sortConfig} onSort={onSort} />,
        dataIndex: "log",
        key: "log",
        width: 80,
        render: (text) => text || "-",
      },
    ],
    [sortConfig, onSort, token]   // ✅ добавили token в зависимости
  );

  const tableData = useMemo(() => data.map((item) => ({ ...item, key: item.id })), [data]);

  const getRowClassName = (record) => {
    if (record.log && record.log.toLowerCase().trim() === "нет") return "not-in-work-row";
    return "";
  };

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowSelection={rowSelection}
      pagination={false}
      rowClassName={getRowClassName}
      size="middle"
      bordered
    />
  );
};

export default CardTable;