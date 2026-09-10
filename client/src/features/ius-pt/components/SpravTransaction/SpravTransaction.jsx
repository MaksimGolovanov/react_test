// src/features/ius-pt/components/SpravTransaction/SpravTransaction.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table, Button, Input, Space, Modal, Form, Popconfirm, message,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import iusPtStore from '../../store/IusPtStore';

const SpravTransaction = observer(() => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  // Загрузка данных – только транзакции и роли (без пользователей)
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        iusPtStore.fetchTransactions({ limit: 99999 }),
        iusPtStore.fetchRoles(),
      ]);
      setTransactions(iusPtStore.transactions);
    } catch (err) {
      message.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Фильтрация
  const filtered = useMemo(() => {
    if (!searchQuery) return transactions;
    const lower = searchQuery.toLowerCase();
    return transactions.filter(item =>
      (item.system || '').toLowerCase().includes(lower) ||
      (item.roleCode || '').toLowerCase().includes(lower) ||
      (item.transactionCode || '').toLowerCase().includes(lower) ||
      (item.description || '').toLowerCase().includes(lower)
    );
  }, [searchQuery, transactions]);

  // Открытие модалки создания
  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Редактирование
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      system: record.system,
      roleCode: record.roleCode,
      transactionCode: record.transactionCode,
      description: record.description,
    });
    setModalVisible(true);
  };

  // Сохранение
  const handleSave = async (values) => {
    try {
      if (editingRecord) {
        await iusPtStore.updateTransaction(editingRecord.id, values);
      } else {
        await iusPtStore.createTransaction(values);
      }
      await loadData();
      setModalVisible(false);
      message.success(editingRecord ? 'Обновлено' : 'Создано');
    } catch (err) {
      message.error('Ошибка сохранения');
    }
  };

  // Удаление одной
  const handleDelete = async (id) => {
    try {
      await iusPtStore.deleteTransaction(id);
      await loadData();
      message.success('Удалено');
    } catch (err) {
      message.error('Ошибка удаления');
    }
  };

  // Массовое удаление
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      await iusPtStore.bulkDeleteTransactions(selectedRowKeys);
      await loadData();
      setSelectedRowKeys([]);
      message.success(`Удалено ${selectedRowKeys.length} записей`);
    } catch (err) {
      message.error('Ошибка массового удаления');
    }
  };

  // Импорт из Excel (столбцы: Система, Код роли, Код транзакции, Описание)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const startRow = json[0]?.some(cell => String(cell).toLowerCase().includes('система')) ? 1 : 0;
        const items = json.slice(startRow).filter(row => row.some(cell => cell && String(cell).trim()))
          .map(row => ({
            system: String(row[0] || '').trim(),
            roleCode: String(row[1] || '').trim(),
            transactionCode: String(row[2] || '').trim(),
            description: String(row[3] || '').trim(),
          }))
          .filter(item => item.system && item.roleCode && item.transactionCode);
        if (!items.length) { message.warning('Нет данных'); return; }
        await iusPtStore.bulkCreateTransactions(items);
        await loadData();
        message.success(`Импортировано ${items.length} транзакций`);
      } catch (err) {
        console.error(err);
        message.error('Ошибка импорта');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const columns = [
    { title: 'Система', dataIndex: 'system' },
    { title: 'Код роли', dataIndex: 'roleCode' },
    { title: 'Код транзакции', dataIndex: 'transactionCode' },
    { title: 'Описание', dataIndex: 'description', ellipsis: true },
    {
      title: 'Действия',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: keys => setSelectedRowKeys(keys),
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Добавить транзакцию
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete} disabled={!selectedRowKeys.length}>
          Удалить выбранные ({selectedRowKeys.length})
        </Button>
        <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current.click()}>
          Импорт из Excel
        </Button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx,.xls" onChange={handleFileUpload} />
      </Space>

      <Input.Search
        placeholder="Поиск по системе, коду роли, коду транзакции, описанию"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
        allowClear
      />

      <Table
      size='small'
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowSelection={rowSelection}
        bordered
      />

      {/* Модалка создания/редактирования */}
      <Modal
        title={editingRecord ? 'Редактирование транзакции' : 'Новая транзакция'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="system" label="Система" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roleCode" label="Код роли" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="transactionCode" label="Код транзакции" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default SpravTransaction;