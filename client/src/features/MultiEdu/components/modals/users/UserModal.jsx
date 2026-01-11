// src/features/security-training/components/admin/UserModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Typography, message } from 'antd';
import securityTrainingStore from '../../../store/SecurityTrainingStore';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const UserModal = ({ visible, mode, currentUser, loading, onCancel, onSubmitSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (visible && mode === 'edit' && currentUser) {
      form.setFieldsValue({
        login: currentUser.login,
        tabNumber: currentUser.tabNumber,
        description: currentUser.description,
        roles: currentUser.roles || ['ST'],
        password: '',
        passwordConfirm: '',
        completed_courses: currentUser.completed_courses || 0,
        average_score: currentUser.average_score || 0,
        total_training_time: currentUser.total_training_time || 0,
      });
    } else if (visible && mode === 'create') {
      form.resetFields();
    }
  }, [visible, mode, currentUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === 'create' && values.password !== values.passwordConfirm) {
        message.error('Пароли не совпадают');
        return;
      }

      setSubmitting(true);

      const userData = {
        login: values.login.trim(),
        tabNumber: values.tabNumber.trim(),
        description: values.description?.trim() || '',
        roles: values.roles || ['ST'],
        completed_courses: values.completed_courses || 0,
        average_score: values.average_score || 0,
        total_training_time: values.total_training_time || 0,
      };

      if (mode === 'create') {
        userData.password = values.password;
      } else if (mode === 'edit' && values.password && values.password.trim()) {
        userData.password = values.password;
      }

      if (mode === 'create') {
        try {
          await securityTrainingStore.createSTUser(userData);
          message.success('Пользователь успешно создан/обновлен');
        } catch (error) {
          if (
            error.response?.status === 400 &&
            error.response?.data?.message?.includes('уже существует')
          ) {
            message.info('Пользователь был добавлен в систему обучения');
          } else {
            throw error;
          }
        }
      } else if (mode === 'edit' && currentUser) {
        await securityTrainingStore.updateSTUser(currentUser.id, userData);
        message.success('Пользователь успешно обновлен');
      }

      onSubmitSuccess();
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Ошибка при сохранении пользователя');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Создание пользователя' : 'Редактирование пользователя'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={700}
      confirmLoading={submitting}
      okText={mode === 'create' ? 'Создать' : 'Сохранить'}
      cancelText="Отмена"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          roles: ['ST'],
          completed_courses: 0,
          average_score: 0,
          total_training_time: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Логин"
              name="login"
              rules={[
                { required: true, message: 'Введите логин пользователя' },
                { min: 3, message: 'Логин должен содержать минимум 3 символа' },
              ]}
            >
              <Input placeholder="Введите логин" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Табельный номер"
              name="tabNumber"
              rules={[{ required: true, message: 'Введите табельный номер' }]}
            >
              <Input placeholder="Введите табельный номер" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Описание" name="description">
          <TextArea rows={2} placeholder="Введите описание пользователя" />
        </Form.Item>

        <Form.Item
          label="Роли"
          name="roles"
          rules={[{ required: true, message: 'Выберите роли пользователя' }]}
        >
          <Select mode="multiple" placeholder="Выберите роли" allowClear>
            <Option value="ST">ST (Обучающийся)</Option>
            <Option value="ST-ADMIN">ST-ADMIN (Администратор обучения)</Option>
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Пароль"
              name="password"
              rules={[
                { required: mode === 'create', message: 'Введите пароль' },
                { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
              ]}
            >
              <Input.Password placeholder="Введите пароль" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Подтверждение пароля"
              name="passwordConfirm"
              rules={[
                { required: mode === 'create', message: 'Подтвердите пароль' },
              ]}
            >
              <Input.Password placeholder="Подтвердите пароль" />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>
          Статистика обучения
        </Title>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Пройдено курсов" name="completed_courses">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="Количество курсов"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Средний балл" name="average_score">
              <InputNumber
                min={0}
                max={100}
                style={{ width: '100%' }}
                placeholder="Средний балл"
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace('%', '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Время обучения (мин.)" name="total_training_time">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="Время в минутах"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserModal;