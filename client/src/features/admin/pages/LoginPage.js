// features/admin/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Button, Card, Input, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import userStore from '../store/UserStore';
import { getFirstAvailablePath } from '../../../shared/routesConfig';
import '../styles/admin-common.css';

const LoginPage = observer(() => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Редирект если уже авторизован
  useEffect(() => {
    if (userStore.isAuthenticated && userStore.initialized && !userStore.loading) {
      const firstPath = getFirstAvailablePath(userStore.userRolesAuth);
      navigate(firstPath, { replace: true });
    }
  }, [userStore.isAuthenticated, userStore.initialized, userStore.loading, userStore.userRolesAuth, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const success = await userStore.login(values.login, values.password);
      if (success) {
        message.success('Вход выполнен успешно');
        // Редирект произойдет в useEffect
      } else {
        message.error(userStore.error || 'Неверные учетные данные');
      }
    } catch (error) {
      message.error('Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <Card className="login-card" bordered={false}>
        <h2 className="login-title">Вход в систему</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item label="Логин" name="login" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input placeholder="Введите логин" />
          </Form.Item>
          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default LoginPage;