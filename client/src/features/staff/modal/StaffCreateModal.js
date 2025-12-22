import React, { useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import StaffService from '../services/StaffService';

export default function StaffCreateModal({ isOpen, onRequestClose, fetchData }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values) => {
    setLoading(true);
    
    const newUser = {
      fio: values.fio,
      login: values.login,
      post: values.post,
      department: values.department,
      telephone: values.telephone || '',
      email: values.email || '',
      ip: values.ip || '',
      tabNumber: values.tabNumber
    };

    try {
      await StaffService.createStaff(newUser);
      message.success('Сотрудник успешно создан');
      form.resetFields();
      onRequestClose();
      fetchData();
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
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
      className="staff-create-modal"
      maskClosable={!loading}
      destroyOnClose
    >
      {/* Заголовок */}
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h6 className="mb-0 fw-semibold">Новый сотрудник</h6>
        <Button
          type="text"
          onClick={handleClose}
          disabled={loading}
          icon={<CloseOutlined className="text-muted" />}
          size="small"
          className="p-0"
          style={{ minWidth: '24px' }}
        />
      </div>
      
      {/* Форма */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        size="small"
        requiredMark="optional"
        disabled={loading}
      >
        <Row gutter={[12, 8]}>
          {/* ФИО */}
          <Col span={24}>
            <Form.Item
              name="fio"
              label="ФИО"
              rules={[
                { required: true, message: 'Введите ФИО сотрудника' },
                { min: 3, message: 'Не менее 3 символов' }
              ]}
            >
              <Input 
                placeholder="Иванов Иван Иванович"
                size="small"
              />
            </Form.Item>
          </Col>
          
          {/* Логин и Табельный номер */}
          <Col span={12}>
            <Form.Item
              name="login"
              label="Логин"
              rules={[
                { required: true, message: 'Введите логин' },
                { min: 2, message: 'Не менее 2 символов' }
              ]}
            >
              <Input 
                placeholder="i.ivanov"
                size="small"
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="tabNumber"
              label="Табельный номер"
              rules={[
                { required: true, message: 'Введите табельный номер' },
                { min: 3, message: 'Не менее 3 символов' }
              ]}
            >
              <Input 
                placeholder="001234"
                size="small"
              />
            </Form.Item>
          </Col>
          
          {/* Должность и Подразделение */}
          <Col span={12}>
            <Form.Item
              name="post"
              label="Должность"
              rules={[{ required: true, message: 'Введите должность' }]}
            >
              <Input 
                placeholder="Специалист"
                size="small"
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="department"
              label="Подразделение"
              rules={[{ required: true, message: 'Введите подразделение' }]}
            >
              <Input 
                placeholder="Отдел ИТ"
                size="small"
              />
            </Form.Item>
          </Col>
          
          {/* Телефон и Email */}
          <Col span={12}>
            <Form.Item
              name="telephone"
              label="Телефон"
            >
              <Input 
                placeholder="+7 (999) 000-00-00"
                size="small"
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'Введите корректный email' }
              ]}
            >
              <Input 
                placeholder="email@domain.com"
                size="small"
              />
            </Form.Item>
          </Col>
          
          {/* IP адрес */}
          <Col span={24}>
            <Form.Item
              name="ip"
              label="IP адрес"
              rules={[
                {
                  pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
                  message: 'Введите корректный IP адрес'
                }
              ]}
            >
              <Input 
                placeholder="192.168.1.100"
                size="small"
              />
            </Form.Item>
          </Col>
        </Row>
        
        {/* Футер с кнопками */}
        <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
          <div className="text-muted small">
            <span className="text-danger me-1">*</span> Обязательные поля
          </div>
          <div className="d-flex gap-2">
            <Button 
              onClick={handleClose}
              disabled={loading}
              size="small"
              className="px-3"
            >
              Отмена
            </Button>
            <Button 
              type="primary"
              htmlType="submit"
              size="small"
              className="px-3 d-flex align-items-center gap-2"
              loading={loading}
            >
              <SaveOutlined /> 
              Создать
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}