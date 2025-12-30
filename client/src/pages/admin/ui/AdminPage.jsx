import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import userStore from '../store/UserStore';
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Spin, 
  Typography,
  Row,
  Col 
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styles from './style.module.css'
const { Text } = Typography;

const Admin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        userStore.fetchUsers();
    }, []);

    const handleEditUser = (userId) => {
        navigate(`/admin/edit/${userId}`);
    }

    const columns = [
        {
            title: 'Логин',
            dataIndex: 'login',
            key: 'login',
            width: 150,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Таб Номер',
            dataIndex: 'tabNumber',
            key: 'tabNumber',
            width: 150,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: 300,
            ellipsis: true,
        },
        {
            title: 'Роли',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => (
                <Space size={[4, 4]} wrap>
                    {roles?.map(role => (
                        <Tag 
                            key={role.id} 
                            color="blue"
                            style={{ margin: 0 }}
                        >
                            {role.role}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <EditOutlined 
                    style={{ 
                        color: '#1890ff', 
                        fontSize: '16px',
                        cursor: 'pointer' 
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(record.id);
                    }}
                />
            ),
        },
    ];

    return useObserver(() => (
        <div className={styles.container}>
            <Row justify="center">
                <Col xs={24} sm={24} md={22} lg={20} xl={18}>
                    <Card 
                        title="Управление пользователями" 
                        bordered={false}
                        style={{ 
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                        }}
                    >
                        {userStore.loading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Spin tip="Загрузка..." />
                            </div>
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={userStore.userRoles.map(user => ({
                                    ...user,
                                    key: user.id
                                }))}
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: false,
                                    showTotal: (total) => `Всего пользователей: ${total}`,
                                }}
                                onRow={(record) => ({
                                    onClick: () => handleEditUser(record.id),
                                    style: { 
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    },
                                    onMouseEnter: (event) => {
                                        event.currentTarget.style.backgroundColor = '#fafafa';
                                    },
                                    onMouseLeave: (event) => {
                                        event.currentTarget.style.backgroundColor = '';
                                    },
                                })}
                                locale={{
                                    emptyText: 'Нет данных о пользователях'
                                }}
                                scroll={{ x: true }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    ));
};

export default Admin;