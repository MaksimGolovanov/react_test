import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import DeviceService from '../mocks/DeviceService.mock';
//import DeviceService from '../services/DeviceService';
import StaffService from '../../staff/services/StaffService';

const { Option } = Select;

const DevicePropertiesModal = ({
  visible,
  onCancel,
  onSave,
  device = null,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    if (visible) loadStaff();
  }, [visible]);

  const loadStaff = async () => {
    try {
      const data = await StaffService.fetchStaff();
      setStaffList(data);
    } catch {
      message.error('Не удалось загрузить сотрудников');
    }
  };

  useEffect(() => {
    if (device) {
      form.setFieldsValue({
        type: device.type,
        model: device.model,
        serialNumber: device.serialNumber,
        inventoryNumber: device.inventoryNumber,
        ipAddress: device.ipAddress,
        macAddress: device.macAddress,
        assignedTo: device.assignedTo,
        comment: device.comment,
      });
    } else {
      form.resetFields();
    }
  }, [device, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = { ...values };
      let result;
      if (device) {
        result = await DeviceService.update(device.id, payload);
      } else {
        result = await DeviceService.create(payload);
      }
      onSave(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Ошибка сохранения');
    }
  };

  return (
    <Modal
      title={device ? 'Редактирование устройства' : 'Новое устройство'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Тип" name="type" rules={[{ required: true }]}>
          <Select placeholder="Выберите тип">
            <Option value="computer">Компьютер</Option>
            <Option value="printer">Принтер</Option>
            <Option value="mfu">МФУ</Option>
            <Option value="monitor">Монитор</Option>
            <Option value="switch">Свитч</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Модель" name="model">
          <Input placeholder="HP EliteBook 840" />
        </Form.Item>
        <Form.Item label="Серийный номер" name="serialNumber">
          <Input placeholder="SN12345" />
        </Form.Item>
        <Form.Item label="Инвентарный номер" name="inventoryNumber">
          <Input placeholder="INV-001" />
        </Form.Item>
        <Form.Item label="IP адрес" name="ipAddress">
          <Input placeholder="192.168.1.100" />
        </Form.Item>
        <Form.Item label="MAC адрес" name="macAddress">
          <Input placeholder="AA:BB:CC:DD:EE:FF" />
        </Form.Item>
        <Form.Item label="Привязать к сотруднику" name="assignedTo">
          <Select
            placeholder="Выберите сотрудника"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {staffList.map((s) => (
              <Option key={s.tabNumber} value={s.tabNumber}>
                {s.fio} ({s.tabNumber})
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Комментарий" name="comment">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DevicePropertiesModal;
