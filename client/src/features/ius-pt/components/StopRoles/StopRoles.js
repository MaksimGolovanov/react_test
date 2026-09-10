// StopRoles.js – полный обновлённый файл

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Popconfirm,
  message,
  theme,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import iusPtStore from '../../store/IusPtStore';

const { useToken } = theme;

const StopRoles = observer(() => {
  const { token } = useToken();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await iusPtStore.fetchStopRoles();
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Фильтрация
  const filteredStopRoles = useMemo(() => {
    if (!searchQuery) return iusPtStore.stopRoles;
    const lowerQuery = searchQuery.toLowerCase();
    return iusPtStore.stopRoles.filter((role) => {
      const fieldsToSearch = [
        role.CodName,
        role.Description,
        role.CanDoWithoutApproval,
        role.Owner,
        role.Note,
        role.Approvers,
      ];
      return fieldsToSearch.some(field =>
        field && String(field).toLowerCase().includes(lowerQuery)
      );
    });
  }, [searchQuery, iusPtStore.stopRoles]);

  // CRUD для одной записи
  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      CodName: record.CodName,
      Description: record.Description,
      CanDoWithoutApproval: record.CanDoWithoutApproval || '',
      Owner: record.Owner || '',
      Note: record.Note || '',
      Approvers: record.Approvers || '',
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await iusPtStore.deleteStopRole(id);
      message.success('Запись удалена');
    } catch (err) {
      message.error('Ошибка удаления');
      console.error(err);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await iusPtStore.updateStopRole(editingRecord.id, values);
        message.success('Запись обновлена');
      } else {
        await iusPtStore.createStopRole(values);
        message.success('Запись создана');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      message.error(editingRecord ? 'Ошибка обновления' : 'Ошибка создания');
      console.error(err);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Массовое удаление
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Выберите записи для удаления');
      return;
    }
    try {
      await iusPtStore.bulkDeleteStopRoles(selectedRowKeys);
      setSelectedRowKeys([]);
      message.success(`Удалено ${selectedRowKeys.length} записей`);
    } catch (err) {
      message.error('Ошибка массового удаления');
      console.error(err);
    }
  };

  // Импорт из Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Пропускаем заголовок (первая строка), если он есть
        const startRow = json.length > 0 && json[0].some(cell => cell && String(cell).toLowerCase().includes('роль')) ? 1 : 0;
        const rolesImport = json
          .slice(startRow)
          .filter(row => row.some(cell => cell && String(cell).trim()))
          .map(row => ({
            CodName: String(row[0] || '').trim(),
            Description: String(row[1] || '').trim(),
            CanDoWithoutApproval: String(row[2] || '').trim(),
            Owner: String(row[3] || '').trim(),
            Note: String(row[4] || '').trim(),
            Approvers: String(row[5] || '').trim(),
          }))
          .filter(role => role.CodName && role.Description); // обязательные поля

        if (rolesImport.length === 0) {
          message.warning('Не найдено данных для импорта');
          return;
        }

        await iusPtStore.bulkCreateStopRoles(rolesImport);
        message.success(`Импортировано ${rolesImport.length} стоп-ролей`);
        setSelectedRowKeys([]);
      } catch (err) {
        console.error(err);
        message.error('Ошибка обработки файла');
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = ''; // сброс инпута
  };

  const columns = [
    { title: 'Роль', dataIndex: 'CodName', key: 'CodName', ellipsis: true },
    { title: 'Краткое описание роли', dataIndex: 'Description', key: 'Description', ellipsis: true },
    { title: 'Кому можно без согласования', dataIndex: 'CanDoWithoutApproval', key: 'CanDoWithoutApproval', render: (val) => val || '-', ellipsis: true },
    { title: 'Владелец', dataIndex: 'Owner', key: 'Owner', render: (val) => val || '-', ellipsis: true },
    { title: 'Примечание', dataIndex: 'Note', key: 'Note', render: (val) => val || '-', ellipsis: true },
    { title: 'Согласующие', dataIndex: 'Approvers', key: 'Approvers', render: (val) => val || '-', ellipsis: true },
    {
      title: 'Действия',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Удалить запись?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  if (isLoading) return <div style={{ color: token.colorText }}>Загрузка...</div>;
  if (error) return <div style={{ color: token.colorError }}>Ошибка: {error.message}</div>;

  return (
    <div style={{ padding: '0' }}>
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Добавить Стоп-роль
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBulkDelete}
              disabled={selectedRowKeys.length === 0}
            >
              Удалить выбранные ({selectedRowKeys.length})
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => fileInputRef.current.click()}
            >
              Загрузить из Excel
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Space>
          <Input.Search
            placeholder="Поиск Стоп-Ролей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <Table
            dataSource={filteredStopRoles}
            columns={columns}
            rowKey="id"
            pagination={{
              defaultPageSize: 8,
              pageSizeOptions: ['8', '12', '24', '48'],
              showSizeChanger: true,
            }}
            bordered
            loading={isLoading}
            rowSelection={rowSelection}
            style={{ width: '100%' }}
          />
        </div>
      </Space>

      {/* Модалка создания/редактирования (без изменений) */}
      <Modal
        title={editingRecord ? 'Редактирование Стоп-роли' : 'Добавление Стоп-роли'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="CodName" label="Роль" rules={[{ required: true, message: 'Введите роль' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Description" label="Краткое описание роли" rules={[{ required: true, message: 'Введите описание' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="CanDoWithoutApproval" label="Кому можно без согласования">
            <Input />
          </Form.Item>
          <Form.Item name="Owner" label="Владелец">
            <Input />
          </Form.Item>
          <Form.Item name="Note" label="Примечание">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="Approvers" label="Согласующие">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default StopRoles;