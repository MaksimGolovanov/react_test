import React, { useState, useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';
import userStore from '../store/UserStore';
import { 
  Table, 
  Form, 
  Card, 
  Input, 
  Button, 
  Row, 
  Col,
  message,
  Space 
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const RoleSprav = () => {
    const [form] = Form.useForm();
    
    useEffect(() => {
        userStore.fetchRoles();
    }, []);

    const handleSubmit = async (values) => {
        try {
            await userStore.createRole(values);
            message.success('Роль успешно создана');
            form.resetFields();
        } catch (error) {
            message.error('Ошибка при создании роли');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Название роли',
            dataIndex: 'role',
            key: 'role',
            width: 150,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
    ];

    return useObserver(() => (
        <Row gutter={[20, 20]} style={{ padding: '20px' }}>
            <Col xs={24} lg={12}>
                <Card title="Список ролей">
                    <Table
                        columns={columns}
                        dataSource={userStore.roles}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        size="middle"
                        scroll={{ x: true }}
                    />
                </Card>
            </Col>
            
            <Col xs={24} lg={12}>
                <Card title="Создание роли">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Название роли"
                            name="role"
                            rules={[{ required: true, message: 'Введите название роли' }]}
                        >
                            <Input placeholder="Введите название роли" />
                        </Form.Item>

                        <Form.Item
                            label="Описание роли"
                            name="description"
                            rules={[{ required: true, message: 'Введите описание роли' }]}
                        >
                            <Input placeholder="Введите описание роли" />
                        </Form.Item>

                        <Form.Item>
                            <Space style={{ float: 'right' }}>
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                >
                                    СОХРАНИТЬ
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    ));
};

export default RoleSprav;