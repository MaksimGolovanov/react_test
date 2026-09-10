import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreatePlanModal = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!file) {
        message.warning('Пожалуйста, выберите изображение схемы');
        return;
      }
      setLoading(true);
      await onSave(values, file);
      setLoading(false);
      form.resetFields();
      setFile(null);
      onCancel();
    } catch (error) {
      setLoading(false);
      console.error('Ошибка создания плана:', error);
      message.error('Ошибка создания плана: ' + (error.message || ''));
    }
  };

  return (
    <Modal
      title="Создание плана"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Создать"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Название здания"
          name="buildingName"
          rules={[{ required: true }]}
        >
          <Input placeholder="Главный корпус" />
        </Form.Item>
        <Form.Item label="Этаж" name="floor" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} placeholder="3" />
        </Form.Item>
        <Form.Item label="Изображение схемы" rules={[{ required: true }]}>
          <Upload
            beforeUpload={beforeUpload}
            accept="image/*"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Выбрать файл</Button>
          </Upload>
          {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePlanModal;