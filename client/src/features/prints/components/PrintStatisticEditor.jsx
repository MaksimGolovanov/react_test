import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Table, Button, InputNumber, message, Space, Popconfirm, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import moment from 'moment';

const PrintStatisticEditor = ({ isOpen, onRequestClose, serialNumber, onSuccess }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10); // сохраняем размер страницы

  const fetchData = async () => {
    if (!serialNumber) return;
    setLoading(true);
    try {
      const stats = await PrintsService.fetchPrintStatistic(serialNumber);
      const sorted = stats.sort((a, b) => b.clock - a.clock);
      setData(sorted);
    } catch (error) {
      message.error('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && serialNumber) {
      fetchData();
    }
  }, [isOpen, serialNumber]);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    const search = searchText.toLowerCase();
    return data.filter(item => {
      const dateStr = moment(item.clock * 1000).format('DD.MM.YYYY HH:mm');
      const valueStr = String(item.value);
      return dateStr.includes(search) || valueStr.includes(search);
    });
  }, [data, searchText]);

  const handleSave = async (record) => {
    try {
      await PrintsService.updateStatistic(record.id, {
        value: record.value,
        clock: record.clock,
      });
      message.success('Запись обновлена');
      fetchData();
      onSuccess?.();
    } catch (error) {
      message.error('Ошибка обновления');
    }
  };

  const handleDelete = async (id) => {
    try {
      await PrintsService.deleteStatistic(id);
      message.success('Запись удалена');
      fetchData();
      onSuccess?.();
    } catch (error) {
      message.error('Ошибка удаления');
    }
  };

  const handleAdd = async () => {
    const newRecord = {
      clock: moment().unix(),
      value: 0,
    };
    try {
      await PrintsService.createStatistic(serialNumber, newRecord);
      message.success('Запись добавлена');
      fetchData();
      onSuccess?.();
    } catch (error) {
      message.error('Ошибка добавления');
    }
  };

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'clock',
      key: 'clock',
      render: (clock) => moment(clock * 1000).format('DD.MM.YYYY HH:mm'),
      sorter: (a, b) => a.clock - b.clock,
    },
    {
      title: 'Показания счётчика',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => {
        const isEditing = editingKey === record.id;
        return isEditing ? (
          <InputNumber
            value={value}
            onChange={(val) => {
              const newData = [...data];
              const index = newData.findIndex(item => item.id === record.id);
              if (index !== -1) {
                newData[index].value = val;
                setData(newData);
              }
            }}
            min={0}
            step={1}
          />
        ) : (
          <span>{value}</span>
        );
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => {
        const isEditing = editingKey === record.id;
        return isEditing ? (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={() => {
                handleSave(record);
                setEditingKey(null);
              }}
            />
            <Button size="small" onClick={() => setEditingKey(null)}>Отмена</Button>
          </Space>
        ) : (
          <Space>
            <Button size="small" onClick={() => setEditingKey(record.id)}>Изменить</Button>
            <Popconfirm
              title="Удалить запись?"
              onConfirm={() => handleDelete(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      title={`Статистика принтера (серийный № ${serialNumber})`}
      open={isOpen}
      onCancel={onRequestClose}
      footer={null}
      width={800}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Добавить запись
        </Button>
        <Input.Search
          placeholder="Поиск по дате или значению"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} записей`,
          onShowSizeChange: (current, size) => setPageSize(size),
        }}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default PrintStatisticEditor;