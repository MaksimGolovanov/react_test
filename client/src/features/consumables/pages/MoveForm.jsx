import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Input, message, Typography, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import consumablesStore from '../store/ConsumablesStore';

const { Text } = Typography;
const { useToken } = theme;

const MoveForm = observer(({ visible, onCancel, onSuccess, sourceRecord, availableSources }) => {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const locations = consumablesStore.locations;

  useEffect(() => {
    if (visible && sourceRecord && availableSources?.length) {
      form.resetFields();
      setSelectedSource(null);
    }
  }, [visible, sourceRecord, availableSources, form]);

  const handleSourceChange = (value) => {
    setSelectedSource(value);
    form.setFieldsValue({ targetLocation: undefined, quantity: undefined });
  };

  const handleSubmit = async (values) => {
    const { sourceLocation, targetLocation, quantity, comment } = values;
    const sourceId = sourceRecord._idMap[sourceLocation];
    if (!sourceId) {
      message.error('Ошибка: не найден ID склада-источника');
      return;
    }
    setLoading(true);
    try {
      await consumablesStore.moveItem(sourceId, targetLocation, quantity, comment);
      message.success('Перемещение выполнено');
      onSuccess();
    } catch (err) {
      message.error(consumablesStore.error || 'Ошибка перемещения');
    } finally {
      setLoading(false);
    }
  };

  if (!sourceRecord) return null;

  return (
    <Modal
      title={`Перемещение: ${sourceRecord.model}`}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Переместить"
      cancelText="Отмена"
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="sourceLocation"
          label="Склад-источник"
          rules={[{ required: true, message: 'Выберите склад' }]}
        >
          <Select placeholder="Выберите склад" onChange={handleSourceChange}>
            {availableSources.map(loc => (
              <Select.Option key={loc} value={loc}>
                {loc} (доступно: {sourceRecord[loc] || 0})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="targetLocation"
          label="Целевой склад"
          rules={[{ required: true, message: 'Выберите целевой склад' }]}
        >
          <Select placeholder="Выберите склад">
            {locations.filter(loc => loc !== selectedSource).map(loc => (
              <Select.Option key={loc} value={loc}>{loc}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Количество"
          rules={[
            { required: true, message: 'Введите количество' },
            { type: 'number', min: 1, message: 'Количество > 0' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const source = getFieldValue('sourceLocation');
                const maxQty = source ? (sourceRecord[source] || 0) : 0;
                if (value && value > maxQty) {
                  return Promise.reject(new Error(`Недостаточно на складе (доступно ${maxQty})`));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea rows={2} placeholder="Причина перемещения" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default MoveForm;