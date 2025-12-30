// src/features/security-training/components/admin/CoursesContent.jsx
import React from 'react';
import {
  Alert,
  Card,
  Table,
  Space,
  Typography,
  Tag,
  Tooltip,
  Button
} from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CoursesContent = ({ 
  courses, 
  onEditCourse, 
  onPreviewCourse,
  onManageLessons,
  onManageTest,
  onDeleteCourse 
}) => {
  const courseColumns = [
    {
      title: "Курс",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.description?.substring(0, 60)}...
          </Text>
        </Space>
      ),
    },
    {
      title: "Уровень",
      dataIndex: "level",
      key: "level",
      render: (level) => (
        <Tag
          color={
            level === "Начальный"
              ? "green"
              : level === "Средний"
              ? "orange"
              : "red"
          }
        >
          {level}
        </Tag>
      ),
    },
    {
      title: "Уроков",
      key: "lessons",
      render: (_, record) => record.lessons?.length || 0,
    },
    {
      title: "Тестов",
      key: "tests",
      render: (_, record) => record.test?.questions?.length || 0,
    },
    {
      title: "Статус",
      key: "active",
      render: (_, record) => (
        <Tag color={record.active ? "green" : "red"}>
          {record.active ? "Активен" : "Неактивен"}
        </Tag>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Редактировать">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Просмотр">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreviewCourse(record)}
            />
          </Tooltip>
          <Tooltip title="Управление уроками">
            <Button
              type="primary"
              size="small"
              onClick={() => onManageLessons(record)}
            >
              Уроки
            </Button>
          </Tooltip>
          <Tooltip title="Управление тестом">
            <Button
              type="primary"
              size="small"
              onClick={() => onManageTest(record)}
            >
              Тест
            </Button>
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => onDeleteCourse(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert
        message="Управление обучающими материалами"
        description="Создавайте, редактируйте и управляйте курсами по информационной безопасности"
        type="info"
        showIcon
      />

      <Card>
        <Table
          columns={courseColumns}
          dataSource={courses.map((c) => ({ ...c, key: c.id }))}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
};

export default CoursesContent;