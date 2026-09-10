// src/modules/gramota/components/SignatoryManagerModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Table,
  Space,
  message,
  Form,
  Input,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SignatoryService from '../services/SignatoryService';

const SignatoryManagerModal = ({ visible, onClose, onSelect, selectedId }) => {
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadSignatories = async () => {
    setLoading(true);
    try {
      const data = await SignatoryService.fetchAll();
      setSignatories(data);
    } catch {
      message.error('Ошибка загрузки подписантов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) loadSignatories();
  }, [visible]);

  const handleSave = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await SignatoryService.update(editing.id, values);
        message.success('Подписант обновлён');
      } else {
        await SignatoryService.create(values);
        message.success('Подписант добавлен');
      }
      setFormVisible(false);
      form.resetFields();
      setEditing(null);
      loadSignatories();
    } catch {
      message.error('Ошибка сохранения');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await SignatoryService.delete(id);
      message.success('Подписант удалён');
      loadSignatories();
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Должность', dataIndex: 'position', key: 'position' },
    { title: 'ФИО', dataIndex: 'name', key: 'name' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setFormVisible(true);
            }}
          />
          <Popconfirm
            title="Удалить?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Управление подписантами"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setFormVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          Добавить подписанта
        </Button>
        <Table
          dataSource={signatories}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title={editing ? 'Редактирование подписанта' : 'Добавление подписанта'}
        open={formVisible}
        onCancel={() => {
          setFormVisible(false);
          form.resetFields();
          setEditing(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Должность"
            name="position"
            rules={[{ required: true, message: 'Введите должность' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ФИО"
            name="name"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SignatoryManagerModal;
