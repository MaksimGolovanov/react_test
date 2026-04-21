import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Form, Input, Button, Card, Row, Col, Space, message, Popconfirm } from 'antd';
import { SaveOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import IusPtStore from '../../store/IusPtStore';

const IusAdm = observer(() => {
    const [form] = Form.useForm();
    const [editingId, setEditingId] = React.useState(null);

    useEffect(() => {
        IusPtStore.fetchAdmins();
    }, []);

    const handleEdit = (record) => {
        setEditingId(record.id);
        form.setFieldsValue({
            iusadm: record.iusadm,
            description: record.description,
            email: record.email,
            cod: record.cod,
        });
    };

    const handleDelete = async (id) => {
        try {
            await IusPtStore.deleteAdmin(id);
            message.success('Подписант удалён');
        } catch (error) {
            message.error('Ошибка при удалении');
            console.error(error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingId) {
                await IusPtStore.updateAdmin({ id: editingId, ...values });
                message.success('Подписант обновлён');
                setEditingId(null);
            } else {
                await IusPtStore.createAdmin(values);
                message.success('Подписант создан');
            }
            form.resetFields();
        } catch (error) {
            message.error(editingId ? 'Ошибка обновления' : 'Ошибка создания');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        form.resetFields();
    };

    const columns = [
        { title: 'И.О. Фамилия', dataIndex: 'iusadm', key: 'iusadm', width: 150 },
        { title: 'Должность', dataIndex: 'description', key: 'description' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Cod', dataIndex: 'cod', key: 'cod', width: 100 },
        {
            title: 'Действия',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Удалить подписанта?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Row gutter={24}>
            <Col xs={24} lg={14}>
                <Card title="Список подписантов">
                    <Table
                        dataSource={IusPtStore.admins}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        bordered
                    />
                </Card>
            </Col>
            <Col xs={24} lg={10}>
                <Card title={editingId ? 'Редактирование подписанта' : 'Создание подписанта'}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            name="iusadm"
                            label="И.О. Фамилия"
                            rules={[{ required: true, message: 'Введите ФИО' }]}
                        >
                            <Input placeholder="Введите И.О. Фамилия" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Должность"
                            rules={[{ required: true, message: 'Введите должность' }]}
                        >
                            <Input placeholder="Введите должность" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[{ required: true, type: 'email', message: 'Введите корректный email' }]}
                        >
                            <Input placeholder="Введите Email" />
                        </Form.Item>
                        <Form.Item
                            name="cod"
                            label="Cod"
                            rules={[{ required: true, message: 'Введите код' }]}
                        >
                            <Input placeholder="Введите Cod" />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                    {editingId ? 'Обновить' : 'Сохранить'}
                                </Button>
                                {editingId && (
                                    <Button onClick={handleCancel}>
                                        Отмена
                                    </Button>
                                )}
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
});

export default IusAdm;