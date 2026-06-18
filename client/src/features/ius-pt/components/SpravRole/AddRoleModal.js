// src/features/ius-pt/components/SpravRole/AddRoleModal.jsx
import React from 'react';
import { Modal, Form, Input, Button, Space, message } from 'antd';

const AddRoleModal = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Ошибка валидации формы');
    }
  };

  return (
    <Modal
      title="Добавить новую роль"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>Отмена</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Сохранить</Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="typename" label="Тип" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="SID" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Функциональная роль/Бизнес-роль" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Код роли" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="mandat" label="Мандат">
          <Input />
        </Form.Item>
        <Form.Item name="business_process" label="Бизнес процесс">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoleModal;