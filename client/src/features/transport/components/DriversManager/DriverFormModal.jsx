import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const DriverFormModal = ({ visible, editingDriver, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState('at_work');

  useEffect(() => {
    if (editingDriver) {
      setSelectedStatus(editingDriver.is_active);
      form.setFieldsValue({
        fio: editingDriver.fio,
        post: editingDriver.post,
        department: editingDriver.department,
        is_active: editingDriver.is_active,
        date_from: editingDriver.date_from ? dayjs(editingDriver.date_from) : null,
        date_to: editingDriver.date_to ? dayjs(editingDriver.date_to) : null,
      });
    } else {
      form.resetFields();
      setSelectedStatus('at_work');
      form.setFieldsValue({ is_active: 'at_work' });
    }
  }, [editingDriver, form, visible]);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (value === 'at_work') {
      form.setFieldsValue({ date_from: null, date_to: null });
    }
  };

  const handleFinish = async (values) => {
    await onSave(values);
    form.resetFields();
  };

  return (
    <Modal
      title={editingDriver ? 'Редактирование водителя' : 'Добавление водителя'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Сохранить"
      cancelText="Отмена"
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="fio" label="ФИО" rules={[{ required: true, message: 'Введите ФИО' }]}>
          <Input placeholder="Иванов Иван Иванович" />
        </Form.Item>
        <Form.Item name="post" label="Должность" rules={[{ required: true, message: 'Введите должность' }]}>
          <Input placeholder="Водитель" />
        </Form.Item>
        <Form.Item name="department" label="Принадлежность" rules={[{ required: true, message: 'Введите принадлежность' }]}>
          <Input placeholder="Вуктыльское ЛПУМГ, УТТиСТ, УАВР или другое" />
        </Form.Item>
        <Form.Item name="is_active" label="Статус" rules={[{ required: true, message: 'Выберите статус' }]}>
          <Select placeholder="Выберите статус" onChange={handleStatusChange}>
            <Option value="at_work">На работе</Option>
            <Option value="on_vacation">В отпуске</Option>
            <Option value="on_sick_leave">На больничном</Option>
            <Option value="on_study">На учёбе</Option>
          </Select>
        </Form.Item>

        {selectedStatus !== 'at_work' && (
          <>
            <Form.Item name="date_from" label="Дата начала" rules={[{ required: true, message: 'Укажите дату начала' }]}>
              <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" placeholder="Выберите дату" />
            </Form.Item>
            <Form.Item name="date_to" label="Дата окончания" rules={[{ required: true, message: 'Укажите дату окончания' }]}>
              <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" placeholder="Выберите дату" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default DriverFormModal;