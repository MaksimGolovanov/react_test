import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, theme, Select, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import StaffService from '../services/StaffService';

const { useToken } = theme;
const { Option } = Select;

export default function StaffEditModal({ isOpen, onRequestClose, fetchData, selectedData }) {
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

  useEffect(() => {
    if (selectedData && isOpen) {
      form.setFieldsValue({
        fio: selectedData.fio || '',
        login: selectedData.login || '',
        post: selectedData.post || '',
        department: selectedData.department || '',
        telephone: selectedData.telephone || '',
        email: selectedData.email || '',
        ip: selectedData.ip || '',
        tabNumber: selectedData.tabNumber || '',
      });
    }
  }, [selectedData, isOpen, form]);

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const dataToUpdate = { ...values, del: selectedData?.del || 0 };
      await StaffService.updateStaff(dataToUpdate);
      onRequestClose();
      fetchData();
    } catch (error) {
      console.error('Ошибка при изменении пользователя:', error);
      message.error('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onRequestClose();
  };

  return (
    <Modal open={isOpen} onCancel={handleClose} footer={null} centered width={600} closable={false} destroyOnClose>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${token.colorBorder}` }}>
        <h6 style={{ margin: 0, fontWeight: 600 }}>Редактирование сотрудника</h6>
        <Button type="text" onClick={handleClose} icon={<CloseOutlined />} size="small" style={{ minWidth: 24 }} />
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave} size="small" requiredMark="optional">
        <Row gutter={[12, 8]}>
          <Col span={24}>
            <Form.Item name="fio" label="ФИО" rules={[{ required: true }]}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="login" label="Логин" rules={[{ required: true }]}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="tabNumber" label="Табельный номер" rules={[{ required: true, pattern: /^[0-9]+$/ }]}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="post" label="Должность" rules={[{ required: true }]}>
              <Input size="small" />
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
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="ip" label="IP адрес">
              <Input size="small" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: `1px solid ${token.colorBorder}` }}>
          <div style={{ color: token.colorTextSecondary, fontSize: 12 }}><span style={{ color: token.colorError, marginRight: 4 }}>*</span> Обязательные поля</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleClose} size="small">Отмена</Button>
            <Button type="primary" htmlType="submit" size="small" loading={loading} icon={<SaveOutlined />}>Сохранить</Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}