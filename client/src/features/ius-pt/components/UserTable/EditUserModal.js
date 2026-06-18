// src/features/ius-pt/components/UserTable/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button, message, theme } from 'antd';
import IusPtService from '../../services/IusPtService';

const { useToken } = theme;

const EditUserModal = ({ visible, onCancel, user, onSave }) => {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      IusPtService.fetchStaffWithIusUser().then(setStaffList).catch(console.error);
      form.setFieldsValue({
        name: user.IusUser?.name,
        fio: user.fio,
        email: user.email,
        department: user.department?.slice(13),
        post: user.post,
        tabNumber: user.tabNumber,
        contractDetails: user.IusUser?.contractDetails,
        location: user.IusUser?.location,
        computerName: user.IusUser?.computerName,
        telephone: user.telephone,
        ip: user.ip,
        manager: user.IusUser?.manager,
        managerEmail: user.IusUser?.managerEmail,
      });
    }
  }, [visible, user, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await onSave({
        tabNumber: user.tabNumber,
        name: values.name,
        contractDetails: values.contractDetails,
        computerName: values.computerName,
        location: values.location,
        manager: values.manager,
        managerEmail: values.managerEmail,
      });
      message.success('Сохранено');
      onCancel();
    } catch (e) {
      message.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter(s => s.fio.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Modal
      title="Редактирование данных пользователя"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Имя пользователя">
          <Input />
        </Form.Item>
        <Form.Item name="fio" label="ФИО">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="department" label="Подразделение">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="post" label="Должность">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="tabNumber" label="Табельный номер">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="contractDetails" label="Реквизиты договора о конфиденциальности">
          <Input />
        </Form.Item>
        <Form.Item name="location" label="Расположение (город, адрес)">
          <Input />
        </Form.Item>
        <Form.Item name="computerName" label="Имя компьютера">
          <Input />
        </Form.Item>
        <Form.Item name="telephone" label="Телефон">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="ip" label="IP адрес">
          <Input readOnly />
        </Form.Item>
        <Form.Item name="manager" label="Руководитель">
          <Select
            showSearch
            placeholder="Выберите руководителя"
            filterOption={false}
            onSearch={setSearchQuery}
            onSelect={(val, option) => {
              form.setFieldsValue({ manager: option.label, managerEmail: option.email });
            }}
            notFoundContent={null}
          >
            {filteredStaff.map(s => (
              <Select.Option key={s.tabNumber} value={s.tabNumber} label={s.fio} email={s.email}>
                {s.fio} ({s.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="managerEmail" label="E-mail руководителя">
          <Input readOnly />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>Сохранить</Button>
            <Button onClick={onCancel}>Отмена</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;