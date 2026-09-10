// src/features/protocols/ui/DictionaryManager/DictionaryManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  List,
  Button,
  Input,
  Space,
  Typography,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import DictionaryStore from '../../store/DictionaryStore';

const { TabPane } = Tabs;
const { Text } = Typography;

const DictionaryManager = ({ visible, onClose }) => {
  const [newValue, setNewValue] = useState('');
  const [activeTab, setActiveTab] = useState('organizations');

  const handleAdd = async () => {
    if (!newValue.trim()) {
      message.warning('Введите значение');
      return;
    }
    const result = await DictionaryStore.addItem(activeTab, newValue.trim());
    if (result) {
      message.success('Добавлено');
      setNewValue('');
    } else {
      message.error('Ошибка добавления');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить?')) {
      const ok = await DictionaryStore.removeItem(activeTab, id);
      if (ok) message.success('Удалено');
      else message.error('Ошибка');
    }
  };

  const renderList = (items) => (
    <List
      bordered
      dataSource={items}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(item.id)}
            />,
          ]}
        >
          <Text>{item.value}</Text>
        </List.Item>
      )}
    />
  );

  return (
    <Modal
      title="Управление справочниками"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Организации" key="organizations">
          {renderList(DictionaryStore.dictionaries.organizations)}
          <Space style={{ marginTop: 16, width: '100%' }}>
            <Input
              placeholder="Новое значение"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Добавить
            </Button>
          </Space>
        </TabPane>
        <TabPane tab="Учебные центры" key="trainingCenters">
          {renderList(DictionaryStore.dictionaries.trainingCenters)}
          <Space style={{ marginTop: 16, width: '100%' }}>
            <Input
              placeholder="Новое значение"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Добавить
            </Button>
          </Space>
        </TabPane>
        <TabPane tab="Программы обучения" key="programs">
          {renderList(DictionaryStore.dictionaries.programs)}
          <Space style={{ marginTop: 16, width: '100%' }}>
            <Input
              placeholder="Новое значение"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Добавить
            </Button>
          </Space>
        </TabPane>
        <TabPane tab="Должности" key="positions">
          {renderList(DictionaryStore.dictionaries.positions)}
          <Space style={{ marginTop: 16, width: '100%' }}>
            <Input
              placeholder="Новое значение"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onPressEnter={handleAdd}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Добавить
            </Button>
          </Space>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default observer(DictionaryManager);
