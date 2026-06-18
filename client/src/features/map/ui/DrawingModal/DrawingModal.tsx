// src/modules/Map/ui/DrawingModal/DrawingModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, ColorPicker, Slider, Button, Popconfirm, message, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import mapStore from '../../store/MapStore';
import { Drawing, DrawingInput } from '../../types/map.types';

const { Option } = Select;

interface DrawingModalProps {
  visible: boolean;
  drawing: Drawing | null;
  initialData?: { type: string; coordinates: any; style?: any; text?: string } | null;
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

const DrawingModal: React.FC<DrawingModalProps> = ({ visible, drawing, initialData, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [fillEnabled, setFillEnabled] = useState(false);
  const [isTextType, setIsTextType] = useState(false);

  useEffect(() => {
    if (visible) {
      if (drawing) {
        const isText = drawing.type === 'text';
        setIsTextType(isText);
        const colorStr = normalizeColor(drawing.style.color);
        const fillColorStr = normalizeColor(drawing.style.fillColor);
        form.setFieldsValue({
          name: drawing.name,
          description: drawing.description,
          text: drawing.text,
          color: colorStr,
          weight: drawing.style.weight || 2,
          opacity: drawing.style.opacity || 0.7,
          fillColor: fillColorStr,
          fillOpacity: drawing.style.fillOpacity || 0.3,
          fontSize: drawing.style.fontSize || 14,
          fontFamily: drawing.style.fontFamily || 'Arial',
          rotation: drawing.style.rotation || 0,
        });
        setFillEnabled(!isText && (drawing.type === 'polygon' || drawing.type === 'rectangle' || drawing.type === 'circle'));
      } else if (initialData) {
        const isText = initialData.type === 'text';
        setIsTextType(isText);
        form.setFieldsValue({
          text: initialData.text || '',
          color: isText ? '#000000' : '#3388ff',
          weight: 2,
          opacity: 0.7,
          fillColor: '#3388ff',
          fillOpacity: 0.3,
          fontSize: 14,
          fontFamily: 'Arial',
          rotation: initialData.style?.rotation || 0,
        });
        setFillEnabled(!isText && (initialData.type === 'polygon' || initialData.type === 'rectangle' || initialData.type === 'circle'));
      }
    }
  }, [visible, drawing, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!mapStore.selectedLayerId) {
        message.error('Не выбран слой для рисунка');
        return;
      }

      const style: any = {};
      if (!isTextType) {
        style.color = normalizeColor(values.color);
        style.weight = values.weight;
        style.opacity = values.opacity;
        style.rotation = values.rotation;
        if (fillEnabled) {
          style.fillColor = normalizeColor(values.fillColor);
          style.fillOpacity = values.fillOpacity;
        }
      } else {
        style.color = normalizeColor(values.color);
        style.fontSize = values.fontSize;
        style.fontFamily = values.fontFamily;
        style.opacity = values.opacity;
        style.rotation = values.rotation;
      }

      if (drawing) {
        const updateData: any = { ...values, style };
        if (isTextType) updateData.text = values.text;
        await mapStore.updateDrawing(drawing.id, updateData);
        // Удалён лишний fetchDrawings – store уже обновил локальный массив
      } else if (initialData) {
        const input: DrawingInput = {
          name: values.name,
          description: values.description,
          type: initialData.type as any,
          coordinates: initialData.coordinates,
          style,
          layerId: mapStore.selectedLayerId,
          ...(isTextType && { text: values.text })
        };
        await mapStore.createDrawing(input);
        // Удалён лишний fetchDrawings
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!drawing) return;
    try {
      await mapStore.deleteDrawing(drawing.id);
      message.success('Рисунок удалён');
      onSuccess();
    } catch (err) {
      message.error('Ошибка удаления');
    }
  };

  const isFillable = drawing
    ? (drawing.type === 'polygon' || drawing.type === 'rectangle' || drawing.type === 'circle')
    : (initialData && (initialData.type === 'polygon' || initialData.type === 'rectangle' || initialData.type === 'circle'));

  return (
    <Modal
      title={drawing ? 'Редактировать рисунок' : 'Новый рисунок'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      width={540}
      styles={{ body: { padding: '12px 16px' } }}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          {drawing && (
            <Popconfirm title="Удалить рисунок?" onConfirm={handleDelete} okText="Да" cancelText="Нет" okType="danger">
              <Button danger icon={<DeleteOutlined />} size="small" style={{ float: 'left' }}>
                Удалить
              </Button>
            </Popconfirm>
          )}
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <Form form={form} layout="vertical" size="small">
        <Form.Item name="name" label="Название" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание" style={{ marginBottom: 8 }}>
          <Input.TextArea rows={1} />
        </Form.Item>

        {isTextType && (
          <>
            <Form.Item name="text" label="Текст" rules={[{ required: true }]} style={{ marginBottom: 8 }}>
              <Input.TextArea rows={1} />
            </Form.Item>
            <Form.Item name="color" label="Цвет" style={{ marginBottom: 8 }}>
              <ColorPicker size="small" />
            </Form.Item>
            <Form.Item name="fontSize" label="Размер" style={{ marginBottom: 8 }}>
              <Slider min={8} max={48} step={1} />
            </Form.Item>
            <Form.Item name="fontFamily" label="Шрифт" style={{ marginBottom: 8 }}>
              <Select size="small">
                <Option value="Arial">Arial</Option>
                <Option value="Verdana">Verdana</Option>
                <Option value="Times New Roman">Times New Roman</Option>
                <Option value="Courier New">Courier New</Option>
                <Option value="Georgia">Georgia</Option>
              </Select>
            </Form.Item>
            <Form.Item name="opacity" label="Прозрачность" style={{ marginBottom: 8 }}>
              <Slider min={0} max={1} step={0.1} />
            </Form.Item>
          </>
        )}

        {!isTextType && (
          <>
            <Form.Item name="color" label="Цвет линии" style={{ marginBottom: 8 }}>
              <ColorPicker size="small" />
            </Form.Item>
            <Form.Item name="weight" label="Толщина" style={{ marginBottom: 8 }}>
              <Slider min={1} max={10} step={1} />
            </Form.Item>
            <Form.Item name="opacity" label="Прозрачность" style={{ marginBottom: 8 }}>
              <Slider min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item name="rotation" label="Поворот" style={{ marginBottom: 8 }}>
              <Slider min={0} max={360} step={1} />
            </Form.Item>
            {isFillable && (
              <>
                <Form.Item name="fillColor" label="Цвет заливки" style={{ marginBottom: 8 }}>
                  <ColorPicker size="small" />
                </Form.Item>
                <Form.Item name="fillOpacity" label="Прозрачность заливки" style={{ marginBottom: 8 }}>
                  <Slider min={0} max={1} step={0.1} />
                </Form.Item>
              </>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default DrawingModal;