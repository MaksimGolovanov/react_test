import React, { useState } from 'react';
import { Modal, Form, InputNumber, Input, message, Typography, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import consumablesStore from '../store/ConsumablesStore';

const { Text } = Typography;
const { useToken } = theme;

const MovementForm = observer(({ visible, onCancel, onSuccess, item, type }) => {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const typeText = type === 'income' ? 'Приход' : 'Уход';
  const maxQuantity = type === 'income' ? 999999 : item.quantity;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const movement = { type, quantity: values.quantity, comment: values.comment || '', date: new Date().toISOString() };
      await consumablesStore.addMovement(item.id, movement);
      message.success(`${typeText} зарегистрирован`);
      onSuccess();
    } catch (err) {
      message.error(consumablesStore.error || 'Ошибка операции');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`${typeText} картриджа: ${item.model}`} open={visible} onCancel={onCancel} onOk={() => form.submit()} confirmLoading={loading} okText="Подтвердить" cancelText="Отмена">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Текущее количество"><Text strong style={{ color: token.colorText }}>{item.quantity}</Text></Form.Item>
        <Form.Item name="quantity" label="Количество" rules={[{ required: true, message: 'Введите количество' }, { type: 'number', min: 1, message: 'Количество > 0' }, { type: 'number', max: maxQuantity, message: `Уход не может превышать ${maxQuantity}` }]}>
          <InputNumber min={1} max={maxQuantity} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="comment" label="Комментарий"><Input.TextArea rows={3} placeholder="Причина, место перемещения" /></Form.Item>
      </Form>
    </Modal>
  );
});

export default MovementForm;