import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import HolidayService from '../../services/HolidayService';
import dayjs from 'dayjs';

const HolidayModal = ({ visible, onClose, onUpdate }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const data = await HolidayService.fetchAll();
      setHolidays(data);
    } catch {
      message.error('Ошибка загрузки праздников');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadHolidays();
    }
  }, [visible]);

  const handleAdd = () => {
    setCurrentRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (selectedRowKeys.length !== 1) return;
    const record = holidays.find((h) => h.id === selectedRowKeys[0]);
    if (!record) return;
    setCurrentRecord(record);
    form.setFieldsValue({
      date: dayjs(record.date),
      name: record.name,
    });
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    try {
      for (const id of selectedRowKeys) {
        await HolidayService.delete(id);
      }
      setSelectedRowKeys([]);
      await loadHolidays();
      if (onUpdate) onUpdate();
      message.success('Праздники удалены');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const handleSubmit = async (values) => {
    setConfirmLoading(true);
    try {
      const payload = {
        date: values.date.format('YYYY-MM-DD'),
        name: values.name,
      };
      if (currentRecord) {
        await HolidayService.update(currentRecord.id, payload);
        message.success('Праздник обновлён');
      } else {
        await HolidayService.create(payload);
        if (onUpdate) onUpdate();
        message.success('Праздник добавлен');
      }
      setModalVisible(false);
      await loadHolidays();
      setSelectedRowKeys([]);
    } catch {
      message.error('Ошибка сохранения');
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (text) => dayjs(text).format('DD.MM.YYYY'),
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    type: 'radio',
  };

  return (
    <>
      <Modal
        title="Справочник праздничных дней"
        open={visible}
        onCancel={onClose}
        width={700}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Добавить
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              disabled={selectedRowKeys.length !== 1}
            >
              Редактировать
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={selectedRowKeys.length === 0}
            >
              Удалить
            </Button>
          </Space>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={holidays.map((item) => ({ ...item, key: item.id }))}
          loading={loading}
          pagination={false}
          size="middle"
          rowKey="id"
        />
      </Modal>

      <Modal
        title={
          currentRecord ? 'Редактирование праздника' : 'Добавление праздника'
        }
        open={modalVisible}
        onCancel={() => !confirmLoading && setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Дата"
            name="date"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} disabled={confirmLoading} />
          </Form.Item>
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input placeholder="Новый год" disabled={confirmLoading} />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={() => setModalVisible(false)}
                disabled={confirmLoading}
                style={{ marginRight: 8 }}
              >
                Отмена
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                Сохранить
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default HolidayModal;
