// src/modules/Map/ui/MarkerModal/MarkerModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, message, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import mapStore from '../../store/MapStore';
import { Marker } from '../../types/map.types';

interface MarkerModalProps {
  visible: boolean;
  marker: Marker | null;
  defaultLngLat?: { lng: number; lat: number } | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const MarkerModal: React.FC<MarkerModalProps> = ({ visible, marker, defaultLngLat, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (marker) {
        form.setFieldsValue({
          name: marker.name,
          description: marker.description,
          lng: marker.geojson.coordinates[0],
          lat: marker.geojson.coordinates[1],
          properties: marker.properties,
        });
      } else if (defaultLngLat) {
        form.setFieldsValue({
          lng: defaultLngLat.lng,
          lat: defaultLngLat.lat,
        });
        form.resetFields(['name', 'description']);
      } else {
        form.resetFields();
      }
    }
  }, [visible, marker, defaultLngLat, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!mapStore.selectedLayerId) {
        message.error('Не выбран слой для метки');
        return;
      }
      if (marker) {
        await mapStore.updateMarker(marker.id, { ...values, layerId: marker.layerId });
        // Удалён лишний fetchMarkers – store уже обновил локальный массив
      } else {
        await mapStore.createMarker({ ...values, layerId: mapStore.selectedLayerId });
        // Удалён лишний fetchMarkers
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!marker) return;
    try {
      await mapStore.deleteMarker(marker.id);
      message.success('Метка удалена');
      onSuccess();
    } catch (err) {
      console.error(err);
      message.error('Ошибка удаления метки');
    }
  };

  return (
    <Modal
      title={marker ? 'Редактировать метку' : 'Новая метка'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      width={460}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          {marker && (
            <Popconfirm
              title="Удалить метку?"
              description="Вы уверены, что хотите удалить эту метку?"
              onConfirm={handleDelete}
              okText="Да"
              cancelText="Нет"
              okType="danger"
            >
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
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="lat" label="Широта" rules={[{ required: true }]}>
          <InputNumber step={0.00001} size="small" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="lng" label="Долгота" rules={[{ required: true }]}>
          <InputNumber step={0.00001} size="small" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name={['properties', 'type']} label="Тип метки">
          <Input placeholder="например, важный, информационный" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MarkerModal;