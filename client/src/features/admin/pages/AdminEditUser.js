import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userStore from '../store/UserStore';
import { observer } from 'mobx-react-lite';
import {
    Form,
    Button,
    Card,
    Row,
    Col,
    Input,
    Checkbox,
    Modal,
    message,
    Space,
    Alert,
    Spin
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AdminEditUser = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState('');
    const [rolesLoading, setRolesLoading] = useState(true);

    // Загружаем роли, если их нет
    useEffect(() => {
        const loadRoles = async () => {
            if (userStore.roles.length === 0) {
                await userStore.fetchRoles();
            }
            setRolesLoading(false);
        };
        loadRoles();
    }, []);

    // Заполняем форму после загрузки данных пользователя
    useEffect(() => {
        const user = userStore.userRoles.find((u) => u.id === parseInt(id));
        if (user) {
            form.setFieldsValue({
                login: user.login,
                description: user.description || '',
                tabNumber: user.tabNumber || '',
                roles: user.roles.map(role => role.role),
            });
        }
    }, [id, form, userStore.userRoles]);

    const handleSubmit = async (values) => {
        setLoading(true);

        const selectedRoleIds = userStore.roles
            .filter(role => values.roles?.includes(role.role))
            .map(role => role.id);

        console.log('Обновление ролей (ID):', selectedRoleIds);

        try {
            const success = await userStore.updateUser(id, {
                login: values.login,
                password: values.password || undefined,
                description: values.description,
                tabNumber: values.tabNumber,
                roles: selectedRoleIds,
            });

            if (success) {
                message.success('Пользователь успешно обновлен');
                navigate('/admin');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Ошибка при обновлении пользователя');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await userStore.deleteUser(id);
            message.success('Пользователь удален');
            setShowDeleteModal(false);
            navigate('/admin');
        } catch (err) {
            setError('Ошибка при удалении пользователя');
        }
    };

    const roleOptions = userStore.roles.map(role => ({
        label: role.role,
        value: role.role,
    }));

    if (rolesLoading) {
        return (
            <Row justify="center" style={{ padding: '20px' }}>
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card style={{ borderRadius: '8px', textAlign: 'center' }}>
                        <Spin tip="Загрузка списка ролей..." />
                    </Card>
                </Col>
            </Row>
        );
    }

    return (
        <Row justify="center" style={{ padding: '20px' }}>
            <Col xs={24} sm={20} md={16} lg={12}>
                <Card
                    title="Редактирование пользователя"
                    extra={
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => setShowDeleteModal(true)}>
                            Удалить
                        </Button>
                    }
                    style={{ borderRadius: '8px' }}
                >
                    {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Логин" name="login" rules={[{ required: true, message: 'Введите логин' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Новый пароль" name="password">
                                    <Input.Password placeholder="Оставьте пустым, если не меняете" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Описание" name="description">
                            <TextArea rows={3} />
                        </Form.Item>

                        <Form.Item label="Табельный номер" name="tabNumber">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Роли" name="roles" rules={[{ required: true, message: 'Выберите хотя бы одну роль' }]}>
                            <Checkbox.Group options={roleOptions} />
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ float: 'right' }}>
                                <Button onClick={() => navigate('/admin')}>Отмена</Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Сохранить
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                <Modal
                    title="Подтверждение удаления"
                    open={showDeleteModal}
                    onOk={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    okText="Удалить"
                    cancelText="Отмена"
                    okButtonProps={{ danger: true }}
                >
                    <p>Вы действительно хотите удалить пользователя "{form.getFieldValue('login')}"?</p>
                </Modal>
            </Col>
        </Row>
    );
});

export default AdminEditUser;