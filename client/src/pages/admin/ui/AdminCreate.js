import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../store/UserStore';
import { 
  Card, 
  Form, 
  Button, 
  Input, 
  Checkbox, 
  Row, 
  Col, 
  message,
  Space 
} from 'antd';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const AdminCreate = observer(() => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        userStore.fetchUsers();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        
        const selectedRoleIds = userStore.roles
            .filter(role => values.roles?.includes(role.role))
            .map(role => role.id);

        try {
            const success = await userStore.createUser(
                values.login,
                values.password,
                selectedRoleIds,
                values.description,
                values.tabNumber
            );

            if (success) {
                message.success('Пользователь успешно создан');
                navigate('/admin');
            }
        } catch (error) {
            message.error('Ошибка при создании пользователя');
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = userStore.roles.map(role => ({
        label: role.role,
        value: role.role,
    }));

    return (
        <Row justify="center" style={{ padding: '20px' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card 
                    title="Создание пользователя" 
                    style={{ borderRadius: '8px' }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Логин"
                                    name="login"
                                    rules={[{ required: true, message: 'Введите логин' }]}
                                >
                                    <Input placeholder="Введите логин" />
                                </Form.Item>
                            </Col>
                            
                            <Col span={12}>
                                <Form.Item
                                    label="Пароль"
                                    name="password"
                                    rules={[{ required: true, message: 'Введите пароль' }]}
                                >
                                    <Input.Password placeholder="Введите пароль" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Описание"
                            name="description"
                        >
                            <TextArea 
                                rows={3} 
                                placeholder="Введите описание" 
                            />
                        </Form.Item>

                        <Form.Item
                            label="Табельный номер"
                            name="tabNumber"
                        >
                            <Input placeholder="Введите табельный номер" />
                        </Form.Item>

                        <Form.Item
                            label="Роли"
                            name="roles"
                            rules={[{ required: true, message: 'Выберите хотя бы одну роль' }]}
                        >
                            <Checkbox.Group options={roleOptions} />
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ float: 'right' }}>
                                <Button onClick={() => navigate('/admin')}>
                                    Отмена
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Создать
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
});

export default AdminCreate;