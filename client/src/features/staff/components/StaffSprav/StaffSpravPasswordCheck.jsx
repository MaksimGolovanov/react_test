// components/StaffSprav/StaffSpravPasswordCheck.jsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Spin, Typography, message } from 'antd';
import { KeyOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import AdService from '../../services/AdService';
import styles from './style.module.css';

const { Text } = Typography;

const StaffSpravPasswordCheck = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await AdService.checkPasswordExpiry(
                values.adminLogin,
                values.adminPassword,
                values.targetUser
            );
            setResult(data);
            message.success('Проверка выполнена');
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка проверки';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.spravContent}>
            <Card title="Проверка срока действия пароля пользователя AD" className={styles.toolbarCard}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Логин администратора (доменный)"
                        name="adminLogin"
                        rules={[{ required: true, message: 'Введите логин' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="golovanov_ks3" />
                    </Form.Item>
                    <Form.Item
                        label="Пароль администратора"
                        name="adminPassword"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>
                    <Form.Item
                        label="Целевой пользователь (логин)"
                        name="targetUser"
                        rules={[{ required: true, message: 'Введите логин пользователя' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="ivanov_iv" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<KeyOutlined />}>
                            Проверить
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {loading && (
                <Card style={{ marginTop: 16 }}>
                    <Spin tip="Выполняется запрос..." />
                </Card>
            )}

            {error && (
                <Card style={{ marginTop: 16 }}>
                    <Alert message="Ошибка" description={error} type="error" showIcon />
                </Card>
            )}

            {result && (
                <Card title="Результат проверки" style={{ marginTop: 16 }}>
                    <p><Text strong>Пользователь:</Text> {result.targetUser}</p>
                    <p><Text strong>Полное имя:</Text> {result.fullName || '-'}</p>
                    <p><Text strong>Дата последней смены пароля:</Text> {result.passwordLastSet ? new Date(result.passwordLastSet).toLocaleString() : '-'}</p>
                    <p><Text strong>Дата обязательной смены пароля:</Text> {result.passwordMustChange ? new Date(result.passwordMustChange).toLocaleString() : '-'}</p>
                    {result.passwordMustChange && (
                        <p><Text strong>Дней до истечения:</Text> {
                            Math.max(0, Math.floor((new Date(result.passwordMustChange) - Date.now()) / (1000 * 60 * 60 * 24)))
                        }</p>
                    )}
                    <details>
                        <summary style={{ cursor: 'pointer', color: '#1890ff' }}>Подробный вывод</summary>
                        <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f5f5f5', padding: 8, marginTop: 8 }}>
                            {result.raw}
                        </pre>
                    </details>
                </Card>
            )}
        </div>
    );
};

export default StaffSpravPasswordCheck;