import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Space, Input, Card, Typography, message, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import consumablesStore from '../store/ConsumablesStore';
import ConsumableForm from './ConsumableForm';
import MovementForm from './MovementForm';
import ConsumableDetails from './ConsumableDetails';
import ConsumablesPivotTable from '../components/ConsumablesPivotTable';
import MoveForm from './MoveForm';
import styles from '../styles/consumables.module.css';

const { Search } = Input;
const { Title } = Typography;
const { useToken } = theme;

const ConsumablesList = observer(() => {
  const { token } = useToken();
  const [searchText, setSearchText] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [movementVisible, setMovementVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [movementItem, setMovementItem] = useState(null);
  const [movementType, setMovementType] = useState('income');
  const [moveRecord, setMoveRecord] = useState(null);
  const [moveSources, setMoveSources] = useState([]);

  useEffect(() => {
    if (!consumablesStore.initialized && !consumablesStore.loading) {
      consumablesStore.fetchItems();
    }
  }, []);

  const handleSearch = (value) => setSearchText(value);

  const handleCellClick = (record, location, type) => {
    const itemId = record._idMap[location];
    if (!itemId) {
      message.warning('Нет данных для этого склада');
      return;
    }
    setMovementItem({ id: itemId, model: record.model, quantity: record[location], location });
    setMovementType(type);
    setMovementVisible(true);
  };

  const handleEditModel = (record) => {
    const anyItem = consumablesStore.items.find(i => i.model === record.model);
    setEditingItem(anyItem);
    setFormVisible(true);
  };

  const handleDeleteModel = async (record) => {
    const ids = consumablesStore.items.filter(i => i.model === record.model).map(i => i.id);
    for (const id of ids) {
      await consumablesStore.deleteItem(id);
    }
    message.success('Модель удалена');
  };

  const handleOpenMove = (record, sources) => {
    setMoveRecord(record);
    setMoveSources(sources);
    setMoveVisible(true);
  };

  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingItem(null);
    consumablesStore.fetchItems();
  };

  const handleMovementSuccess = () => {
    setMovementVisible(false);
    setMovementItem(null);
    consumablesStore.fetchItems();
    if (detailsVisible && consumablesStore.selectedItem) {
      consumablesStore.getById(consumablesStore.selectedItem.id);
    }
  };

  const handleMoveSuccess = () => {
    setMoveVisible(false);
    setMoveRecord(null);
    consumablesStore.fetchItems();
  };

  return (
    <div className={styles.container} style={{ backgroundColor: token.colorBgLayout }}>
      <Card style={{ backgroundColor: token.colorBgContainer }}>
        <div className={styles.header}>
          <Title level={4} style={{ margin: 0, color: token.colorText }}>Расходные материалы</Title>
          <Space>
            <Search
              placeholder="Поиск по модели/названию"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.searchInput}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormVisible(true)}>Добавить</Button>
          </Space>
        </div>

        <div className={styles.tableWrapper}>
          <ConsumablesPivotTable
            data={consumablesStore.items}
            searchText={searchText}
            onCellClick={handleCellClick}
            onEditModel={handleEditModel}
            onDeleteModel={handleDeleteModel}
            onMove={handleOpenMove}
          />
        </div>
      </Card>

      <ConsumableForm
        visible={formVisible}
        onCancel={() => { setFormVisible(false); setEditingItem(null); }}
        onSuccess={handleFormSuccess}
        initialData={editingItem}
      />
      <MovementForm
        visible={movementVisible}
        onCancel={() => setMovementVisible(false)}
        onSuccess={handleMovementSuccess}
        item={movementItem}
        type={movementType}
      />
      <ConsumableDetails
        visible={detailsVisible}
        onClose={() => { setDetailsVisible(false); consumablesStore.clearSelected(); }}
        item={consumablesStore.selectedItem}
      />
      <MoveForm
        visible={moveVisible}
        onCancel={() => setMoveVisible(false)}
        onSuccess={handleMoveSuccess}
        sourceRecord={moveRecord}
        availableSources={moveSources}
      />
    </div>
  );
});

export default ConsumablesList;