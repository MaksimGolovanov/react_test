import React, { useState } from 'react';
import { Table, Button, Space, Tooltip, theme, Modal, Popover, Card, Typography } from 'antd';
import {
  SwapOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import MovementHistoryTable from './MovementHistoryTable';
import consumablesStore from '../store/ConsumablesStore';

const { Title, Text } = Typography;
const { useToken } = theme;

const ConsumablesPivotTable = ({ data, searchText, onCellClick, onEditModel, onDeleteModel, onMove }) => {
  const { token } = useToken();
  const locations = ['СЭБ', 'Склад', 'АБК'];
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [selectedCell, setSelectedCell] = useState(null);
  const [movementsModalVisible, setMovementsModalVisible] = useState(false);
  const [currentModelMovements, setCurrentModelMovements] = useState([]);
  const [currentModelName, setCurrentModelName] = useState('');

  // Группировка по модели
  const modelsMap = new Map();
  data.forEach(item => {
    if (!modelsMap.has(item.model)) {
      modelsMap.set(item.model, {
        model: item.model,
        name: item.name,
        minQuantity: item.minQuantity,
        locations: {},
        idMap: {},
      });
    }
    const entry = modelsMap.get(item.model);
    entry.locations[item.location] = item.quantity;
    entry.idMap[item.location] = item.id;
    if (item.name) entry.name = item.name;
    if (item.minQuantity) entry.minQuantity = item.minQuantity;
  });

  let tableData = Array.from(modelsMap.values()).map(entry => {
    const total = locations.reduce((sum, loc) => sum + (entry.locations[loc] || 0), 0);
    return {
      key: entry.model,
      model: entry.model,
      name: entry.name,
      ...entry.locations,
      _total: total,
      _minQuantity: entry.minQuantity,
      _idMap: entry.idMap,
    };
  });

  // Фильтрация по поиску
  if (searchText) {
    const lower = searchText.toLowerCase();
    tableData = tableData.filter(item =>
      item.model.toLowerCase().includes(lower) ||
      (item.name && item.name.toLowerCase().includes(lower))
    );
  }

  const handleCellContext = (record, location, event) => {
    event.preventDefault();
    setSelectedCell({ record, location });
    setPopoverPosition({ x: event.clientX, y: event.clientY });
    setPopoverVisible(true);
  };

  const handleSelectType = (type) => {
    if (selectedCell) {
      onCellClick(selectedCell.record, selectedCell.location, type);
    }
    setPopoverVisible(false);
    setSelectedCell(null);
  };

  const handleTotalClick = (record) => {
    // Собираем все движения по данной модели
    const modelItems = consumablesStore.items.filter(i => i.model === record.model);
    const allMovements = modelItems.flatMap(item => item.movements || []);
    // Сортируем по дате (новые сверху)
    allMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
    setCurrentModelMovements(allMovements);
    setCurrentModelName(`${record.model}${record.name ? ` (${record.name})` : ''}`);
    setMovementsModalVisible(true);
  };

  const columns = [
    {
      title: 'Модель',
      dataIndex: 'model',
      fixed: 'left',
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      render: text => text || '—',
    },
    ...locations.map(loc => ({
      title: loc,
      dataIndex: loc,
      key: loc,
      onCell: (record) => ({
        style: { cursor: 'pointer', transition: 'background-color 0.2s' },
        onClick: (e) => handleCellContext(record, loc, e),
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = token.colorPrimaryBg;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        },
      }),
      render: (qty, record) => {
        const isLow = (qty || 0) <= (record._minQuantity || 0);
        const hasStock = (qty || 0) > 0;
        return (
          <div
            style={{
              color: isLow ? token.colorError : hasStock ? token.colorText : token.colorTextDisabled,
              fontWeight: hasStock ? 'bold' : 'normal',
              textAlign: 'center',
              padding: '4px 0',
            }}
          >
            {qty !== undefined ? qty : 0}
          </div>
        );
      },
    })),
    {
      title: 'Итого',
      dataIndex: '_total',
      sorter: (a, b) => a._total - b._total,
      render: (total, record) => (
        <div
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            fontWeight: 'bold',
            color: total <= (record._minQuantity || 0) ? token.colorError : token.colorText,
            transition: 'opacity 0.2s',
          }}
          onClick={() => handleTotalClick(record)}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <HistoryOutlined style={{ marginRight: 4 }} />
          {total}
        </div>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => {
        const availableSources = locations.filter(loc => (record[loc] || 0) > 0);
        return (
          <Space size="small">
            <Tooltip title="Редактировать модель">
              <Button icon={<EditOutlined />} size="small" onClick={() => onEditModel(record)} />
            </Tooltip>
            <Tooltip title="Удалить модель">
              <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onDeleteModel(record)} />
            </Tooltip>
            {availableSources.length > 0 && (
              <Tooltip title="Переместить">
                <Button icon={<SwapOutlined />} size="small" onClick={() => onMove(record, availableSources)} />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{ pageSize: 20 }}
        scroll={{ x: 'max-content' }}
        rowClassName={() => 'pivot-row'}
      />

      {/* Всплывающее окно выбора приход/уход */}
      <Popover
        open={popoverVisible}
        onOpenChange={(visible) => !visible && setPopoverVisible(false)}
        content={
          <div style={{ display: 'flex', gap: 12, padding: '8px 4px' }}>
            <Button
              type="primary"
              icon={<ArrowUpOutlined />}
              onClick={() => handleSelectType('income')}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Приход
            </Button>
            <Button
              danger
              icon={<ArrowDownOutlined />}
              onClick={() => handleSelectType('outcome')}
            >
              Уход
            </Button>
          </div>
        }
        trigger="click"
        placement="bottomLeft"
        getPopupContainer={() => document.body}
        overlayStyle={{
          position: 'fixed',
          top: popoverPosition.y,
          left: popoverPosition.x,
        }}
      />

      {/* Модалка истории движений по модели */}
      <Modal
        title={`История движений: ${currentModelName}`}
        open={movementsModalVisible}
        onCancel={() => setMovementsModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        {currentModelMovements.length === 0 ? (
          <Text type="secondary">Нет операций для этой модели</Text>
        ) : (
          <MovementHistoryTable movements={currentModelMovements} />
        )}
      </Modal>
    </>
  );
};

export default ConsumablesPivotTable;