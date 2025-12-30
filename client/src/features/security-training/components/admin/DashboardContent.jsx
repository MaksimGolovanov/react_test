// src/features/security-training/components/admin/DashboardContent.jsx
import React from 'react';
import {
  Alert,
  Row,
  Col,
  Card,
  Statistic,
  Timeline,
  Button,
  Space,
  List,
  Tag,
  Typography
} from "antd";
import {
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  ScheduleOutlined,
  PlusOutlined,
  DownloadOutlined,
  SettingOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const DashboardContent = ({ 
  stats,
  onNavigate,
  analytics 
}) => {
  const {
    totalUsers,
    totalCompletedCourses,
    averageScore,
    activeCourses
  } = stats;

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert
        message="Добро пожаловать в панель администратора"
        description="Здесь вы можете управлять курсами, пользователями и просматривать аналитику"
        type="info"
        showIcon
      />

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Всего пользователей"
              value={totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Пройдено курсов"
              value={totalCompletedCourses}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Средний балл"
              value={Math.round(averageScore)}
              suffix="%"
              prefix={<StarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активных курсов"
              value={activeCourses}
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={12}>
          <Card
            title="Последняя активность"
            extra={<Button type="link">Все</Button>}
          >
            <Timeline>
              <Timeline.Item color="green">
                <Text strong>Иван Иванов завершил курс</Text>
                <div>Основы информационной безопасности - 95%</div>
                <Text type="secondary">Сегодня, 10:30</Text>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text strong>Мария Петрова начала курс</Text>
                <div>Защита от фишинга</div>
                <Text type="secondary">Вчера, 15:45</Text>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Text strong>Новый курс создан</Text>
                <div>"Безопасность в социальных сетях"</div>
                <Text type="secondary">15 января, 09:20</Text>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Быстрые действия">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                block
                icon={<PlusOutlined />}
                onClick={() => onNavigate('courses')}
              >
                Создать новый курс
              </Button>
              <Button
                block
                icon={<TeamOutlined />}
                onClick={() => onNavigate('users')}
              >
                Управление пользователями
              </Button>
              <Button block icon={<DownloadOutlined />}>
                Экспорт отчетов
              </Button>
              <Button block icon={<SettingOutlined />}>
                Настройки системы
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="Популярные курсы" style={{ marginTop: "24px" }}>
        <List
          dataSource={analytics.popularCourses}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color="blue">{item.completions} завершений</Tag>,
                <Button size="small">Подробнее</Button>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`ID курса: ${item.id}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
};

export default DashboardContent;