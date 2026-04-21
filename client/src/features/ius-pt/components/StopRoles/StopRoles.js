import React, { useEffect, useState, useMemo } from 'react';
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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import iusPtStore from '../../store/IusPtStore';

const StopRoles = observer(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

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

  const filteredStopRoles = useMemo(() => {
    if (!searchQuery) return iusPtStore.stopRoles;
    const lower = searchQuery.toLowerCase();
    return iusPtStore.stopRoles.filter((role) =>
      Object.values(role).some((val) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [searchQuery, iusPtStore.stopRoles]);

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

  const columns = [
    { title: 'Роль', dataIndex: 'CodName', key: 'CodName', ellipsis: true },
    {
      title: 'Краткое описание роли',
      dataIndex: 'Description',
      key: 'Description',
      ellipsis: true,
    },
    {
      title: 'Кому можно без согласования',
      dataIndex: 'CanDoWithoutApproval',
      key: 'CanDoWithoutApproval',
      render: (val) => val || '-',
      ellipsis: true,
    },
    {
      title: 'Владелец',
      dataIndex: 'Owner',
      key: 'Owner',
      render: (val) => val || '-',
      ellipsis: true,
    },
    {
      title: 'Примечание',
      dataIndex: 'Note',
      key: 'Note',
      render: (val) => val || '-',
      ellipsis: true,
    },
    {
      title: 'Согласующие',
      dataIndex: 'Approvers',
      key: 'Approvers',
      render: (val) => val || '-',
      ellipsis: true,
    },
    {
      title: 'Действия',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Удалить запись?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div style={{ padding: '0' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Добавить Стоп-роль
          </Button>
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
              defaultPageSize: 12,
              pageSizeOptions: ['12', '24', '36', '48', '60'],
              showSizeChanger: true,
            }}
            bordered
            loading={isLoading}
            
            style={{ width: '100%' }}
          />
        </div>
      </Space>

      <Modal
        title={
          editingRecord ? 'Редактирование Стоп-роли' : 'Добавление Стоп-роли'
        }
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Сохранить"
        cancelText="Отмена"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="CodName"
            label="Роль"
            rules={[{ required: true, message: 'Введите роль' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Краткое описание роли"
            rules={[{ required: true, message: 'Введите описание' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            name="CanDoWithoutApproval"
            label="Кому можно без согласования"
          >
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
