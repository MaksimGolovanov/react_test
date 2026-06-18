import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, message, theme, Select } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import StaffService from '../services/StaffService';

const { useToken } = theme;
const { Option } = Select;

export default function StaffCreateModal({ isOpen, onRequestClose, fetchData }) {
  const { token } = useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    try {
      const data = await StaffService.fetchAllDepartments();
      setDepartmentsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Ошибка загрузки отделов:', error);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    const newUser = {
      fio: values.fio,
      login: values.login,
      post: values.post,
      department: values.department, // полная строка из Select
      telephone: values.telephone || '',
      email: values.email || '',
      ip: values.ip || '',
      tabNumber: values.tabNumber,
    };
    try {
      await StaffService.createStaff(newUser);
      message.success('Сотрудник успешно создан');
      form.resetFields();
      onRequestClose();
      fetchData();
    } catch (error) {
      message.error('Ошибка при создании сотрудника');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      form.resetFields();
      onRequestClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={600}
      closable={false}
      maskClosable={!loading}
      destroyOnClose
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${token.colorBorder}` }}>
        <h6 style={{ margin: 0, fontWeight: 600 }}>Новый сотрудник</h6>
        <Button type="text" onClick={handleClose} disabled={loading} icon={<CloseOutlined />} size="small" style={{ minWidth: 24 }} />
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave} size="small" requiredMark="optional" disabled={loading}>
        <Row gutter={[12, 8]}>
          <Col span={24}>
            <Form.Item name="fio" label="ФИО" rules={[{ required: true, message: 'Введите ФИО сотрудника' }, { min: 3 }]}>
              <Input placeholder="Иванов Иван Иванович" size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="login" label="Логин" rules={[{ required: true, message: 'Введите логин' }, { min: 2 }]}>
              <Input placeholder="i.ivanov" size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tabNumber" label="Табельный номер" rules={[{ required: true, message: 'Введите табельный номер' }, { min: 3 }]}>
              <Input placeholder="001234" size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="post" label="Должность" rules={[{ required: true }]}>
              <Input placeholder="Специалист" size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department" label="Подразделение" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Выберите отдел"
                optionFilterProp="children"
                allowClear
                disabled={loading}
              >
                {departmentsList.map(dept => (
                  <Option key={dept.id} value={dept.code}>
                    {dept.description} ({dept.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="telephone" label="Телефон">
              <Input placeholder="+7 (999) 000-00-00" size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Введите корректный email' }]}>
              <Input placeholder="email@domain.com" size="small" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="ip" label="IP адрес" rules={[{ pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Введите корректный IP адрес' }]}>
              <Input placeholder="192.168.1.100" size="small" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: `1px solid ${token.colorBorder}` }}>
          <div style={{ color: token.colorTextSecondary, fontSize: 12 }}>
            <span style={{ color: token.colorError, marginRight: 4 }}>*</span> Обязательные поля
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleClose} disabled={loading} size="small">Отмена</Button>
            <Button type="primary" htmlType="submit" size="small" loading={loading} icon={<SaveOutlined />}>Создать</Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}