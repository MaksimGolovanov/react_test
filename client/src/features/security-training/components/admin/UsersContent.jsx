// src/features/security-training/components/admin/UsersContent.jsx
import React from "react";
import AvatarWithFallback from "../../../../Components/AvatarWithFallback/AvatarWithFallback";
import {
  Alert,
  Card,
  Table,
  Button,
  Space,
  Typography,
  Progress,
  Tag,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const UsersContent = ({ users, loading }) => {
  console.log("UsersContent получил users:", users);
  console.log("Тип users:", typeof users);
  console.log("Длина users:", users?.length);
  console.log("Первый элемент users:", users?.[0]);

  if (users && users.length > 0) {
    console.log("Ключи первого пользователя:", Object.keys(users[0]));
    console.log("Значения первого пользователя:", users[0]);
  }

  console.log("Loading состояние:", loading);

  const userColumns = [
    {
      title: "Пользователь",
      dataIndex: "login",
      key: "login",
      render: (text, record) => (
        <Space>
          <AvatarWithFallback
            tabNumber={record.tabNumber}
            size={45}
            fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
            timestamp={Date.now()}
          />
          <div>
            <Text strong>{text || "Не указано"}</Text>
            <div>
              <Text type="secondary">{record.tabNumber || "Нет email"}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "Администратор"
              ? "red"
              : role === "Менеджер"
              ? "orange"
              : "blue"
          }
        >
          {role || "Сотрудник"}
        </Tag>
      ),
    },
    {
      title: "Отдел",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Пройдено курсов",
      dataIndex: "completedCourses",
      key: "completedCourses",
      render: (count) => (
        <Tag icon={<TrophyOutlined />} color="green">
          {count || 0}
        </Tag>
      ),
    },
    {
      title: "Средний балл",
      dataIndex: "averageScore",
      key: "averageScore",
      render: (score) => <Progress percent={score || 0} size="small" />,
    },
    {
      title: "Последняя активность",
      dataIndex: "lastActivity",
      key: "lastActivity",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small">Подробнее</Button>
          <Button size="small" type="primary">
            Написать
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert
        message="Управление пользователями"
        description="Просматривайте и управляйте пользователями системы обучения"
        type="info"
        showIcon
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "24px",
        }}
      >
        <Title level={5}>Все пользователи ({users.length})</Title>
        <Space>
          <Button icon={<PlusOutlined />} type="primary">
            Добавить пользователя
          </Button>
          <Button icon={<DownloadOutlined />}>Экспорт</Button>
        </Space>
      </div>

      <Card>
        <Table
          columns={userColumns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.tab_number || record.id || record.login}
        />
      </Card>
    </Space>
  );
};

export default UsersContent;
