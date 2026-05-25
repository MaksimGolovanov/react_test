// src/modules/Map/ui/LayerModal/LayerModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, InputNumber, ColorPicker } from 'antd';
import mapStore from '../../store/MapStore';
import { Layer } from '../../types/map.types';

interface LayerModalProps {
  visible: boolean;
  layer: Layer | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const normalizeColor = (color: any): string => {
  if (!color) return '#3388ff';
  if (typeof color === 'string') return color;
  if (color.toHexString) return color.toHexString();
  if (typeof color === 'object' && color.hex) return color.hex;
  return '#3388ff';
};

const LayerModal: React.FC<LayerModalProps> = ({ visible, layer, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && layer) {
      const style = layer.style ? { ...layer.style } : {};
      if (style.color) style.color = normalizeColor(style.color);
      form.setFieldsValue({
        name: layer.name,
        description: layer.description,
        isVisible: layer.isVisible,
        order: layer.order,
        style,
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({ isVisible: false, order: 0, style: { color: '#3388ff' } });
    }
  }, [visible, layer, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.style?.color) values.style.color = normalizeColor(values.style.color);
      if (layer) {
        await mapStore.updateLayer(layer.id, values);
      } else {
        await mapStore.createLayer(values);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      title={layer ? 'Редактировать слой' : 'Новый слой'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      width={460}

    >
      <Form form={form} layout="vertical" size="small">
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={1} />
        </Form.Item>
        <Form.Item name="isVisible" label="Видимый" valuePropName="checked">
          <Switch size="small" />
        </Form.Item>
        <Form.Item name="order" label="Порядок">
          <InputNumber min={0} size="small" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name={['style', 'color']} label="Цвет">
          <ColorPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LayerModal;