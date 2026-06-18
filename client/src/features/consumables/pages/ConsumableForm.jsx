import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import consumablesStore from '../store/ConsumablesStore';

const { useToken } = theme;

const ConsumableForm = observer(({ visible, onCancel, onSuccess, initialData }) => {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        // Редактирование существующей записи – показываем как есть
        form.setFieldsValue({
          model: initialData.model,
          name: initialData.name,
          location: initialData.location,
          quantity: initialData.quantity,
          minQuantity: initialData.minQuantity,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          quantity: 0,
          minQuantity: 0,
          location: 'СЭБ', // по умолчанию
        });
      }
    }
  }, [visible, initialData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (initialData) {
        // Обновление одной записи (оставляем как было)
        await consumablesStore.updateItem(initialData.id, values);
        message.success('Картридж обновлён');
      } else {
        // Создание новой модели – отправляем с указанием склада для начального количества
        await consumablesStore.createItem(values);
        message.success('Картридж создан на всех складах');
      }
      onSuccess();
    } catch (err) {
      message.error(consumablesStore.error || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={initialData ? 'Редактирование картриджа' : 'Новый картридж'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      width={600}
      okText="Сохранить"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="model" label="Модель" rules={[{ required: true, message: 'Введите модель' }]}>
          <Input placeholder="Например: MP3353" />
        </Form.Item>
        <Form.Item name="name" label="Название (опционально)">
          <Input placeholder="Краткое название" />
        </Form.Item>
        {!initialData && (
          <Form.Item name="location" label="Начальный склад" rules={[{ required: true, message: 'Выберите склад' }]}>
            <Select placeholder="Выберите склад">
              {consumablesStore.locations.map(loc => <Select.Option key={loc} value={loc}>{loc}</Select.Option>)}
            </Select>
          </Form.Item>
        )}
        {initialData && (
          <Form.Item name="location" label="Склад" rules={[{ required: true }]}>
            <Select disabled>
              {consumablesStore.locations.map(loc => <Select.Option key={loc} value={loc}>{loc}</Select.Option>)}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="quantity" label="Количество" rules={[{ required: true, type: 'number', min: 0, message: 'Количество >= 0' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="minQuantity" label="Минимальное количество (порог)" tooltip="При достижении этого количества будет подсвечиваться в списке">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default ConsumableForm;