import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import userStore from '../store/UserStore';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const success = await userStore.login(values.login, values.password);
            if (success) {
                message.success('Вход выполнен успешно');
                navigate('/');
            } else {
                message.error('Неверные учетные данные');
            }
        } catch (error) {
            message.error('Ошибка при входе');
        } finally {
            setLoading(false);
        }
    };
useEffect(() => {
        userStore.fetchUsers();
    }, []);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f0f2f5'
        }}>
            <Card 
                style={{ width: '100%', maxWidth: '400px' }}
                bordered={false}
            >
                <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Вход в систему</h2>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Логин"
                        name="login"
                        rules={[{ required: true, message: 'Введите логин' }]}
                    >
                        <Input placeholder="Введите логин" />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password placeholder="Введите пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;