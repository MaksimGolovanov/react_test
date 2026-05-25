// src/modules/IpAddress/ui/IpModal/IpModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { DEVICE_TYPES, SWITCH_TYPES } from '../../lib/constants';
import IpStore from '../../store/IpStore';
import { IpModalProps, IpAddressInput } from '../../types/ip.types';

const { TextArea } = Input;
const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$/;

const IpModal: React.FC<IpModalProps> = ({ visible, currentIp, onCancel, onSuccess }) => {
  const [form] = Form.useForm<IpAddressInput>();

  useEffect(() => {
    if (visible) {
      if (currentIp) {
        form.setFieldsValue({
          ip: currentIp.ip,
          subnet_mask: currentIp.subnet_mask || '',
          device_type: currentIp.device_type || undefined,
          switch: currentIp.switch || undefined,
          switch_port: currentIp.switch_port || '',
          network_segment: currentIp.network_segment || '',
          description: currentIp.description || '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, currentIp, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (currentIp) {
        await IpStore.updateIp(currentIp.id, values);
        message.success('IP-адрес обновлён');
      } else {
        await IpStore.createIp(values);
        message.success('IP-адрес добавлен');
      }
      onSuccess();
      form.resetFields();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      message.error('Ошибка при сохранении');
    }
  };

  return (
    <Modal
      title={currentIp ? 'Редактирование IP-адреса' : 'Добавление IP-адреса'}
      open={visible}
      onOk={handleSubmit}
      centered
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      width={600}
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ style: { borderRadius: 40, padding: '4px 20px' } }}
      cancelButtonProps={{ style: { borderRadius: 40 } }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="IP-адрес"
          name="ip"
          rules={[
            { required: true, message: 'Введите IP-адрес' },
            { pattern: IP_PATTERN, message: 'Неверный формат IP' },
          ]}
        >
          <Input placeholder="192.168.1.1" />
        </Form.Item>
        <Form.Item label="Маска подсети" name="subnet_mask">
          <Input placeholder="255.255.255.0" />
        </Form.Item>
        <Form.Item label="Тип устройства" name="device_type">
          <Select placeholder="Выберите тип" allowClear>
            {DEVICE_TYPES.map(type => <Select.Option key={type} value={type}>{type}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Коммутатор" name="switch">
          <Select placeholder="Выберите коммутатор" allowClear>
            {SWITCH_TYPES.map(type => <Select.Option key={type} value={type}>{type}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Порт" name="switch_port">
          <Input placeholder="GigabitEthernet0/1" />
        </Form.Item>
        <Form.Item label="Сегмент сети" name="network_segment">
          <Input placeholder="VLAN 10" />
        </Form.Item>
        <Form.Item label="Описание" name="description">
          <TextArea rows={3} placeholder="Назначение IP-адреса" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IpModal;