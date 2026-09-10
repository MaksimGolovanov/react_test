import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message } from 'antd';
import StaffService from '../../staff/services/StaffService';
//import DeviceService from '../services/DeviceService';
import DeviceService from '../mocks/DeviceService.mock';
const AssignUserModal = ({ visible, onCancel, device, onAssigned }) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedTabNumber, setSelectedTabNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadStaff();
      if (device) setSelectedTabNumber(device.assignedTo || null);
    }
  }, [visible, device]);

  const loadStaff = async () => {
    try {
      const data = await StaffService.fetchStaff();
      setStaffList(data);
    } catch {
      message.error('Ошибка загрузки сотрудников');
    }
  };

  const handleSave = async () => {
    if (!device) return;
    setLoading(true);
    try {
      await DeviceService.update(device.id, { assignedTo: selectedTabNumber });
      message.success('Привязка обновлена');
      onAssigned(device.id, selectedTabNumber);
      onCancel();
    } catch {
      message.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Привязка сотрудника"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Сохранить
        </Button>,
      ]}
      destroyOnClose
    >
      <Select
        placeholder="Выберите сотрудника"
        style={{ width: '100%' }}
        value={selectedTabNumber}
        onChange={setSelectedTabNumber}
        showSearch
        optionFilterProp="children"
      >
        {staffList.map((s) => (
          <Select.Option key={s.tabNumber} value={s.tabNumber}>
            {s.fio} ({s.tabNumber})
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AssignUserModal;
