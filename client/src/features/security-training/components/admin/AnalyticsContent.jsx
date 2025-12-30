// src/features/security-training/components/admin/AnalyticsContent.jsx
import React from 'react';
import {
  Alert,
  Row,
  Col,
  Card,
  Statistic,
  Timeline,
  Tag,
  Typography,
  Button,
  List,
  Avatar,
  Space
} from "antd";
import {
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const AnalyticsContent = ({ analytics }) => {
  const {
    totalActiveUsers,
    newUsersThisMonth,
    completionRate,
    avgTimeToComplete,
    popularCourses,
    monthlyStats
  } = analytics;

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert
        message="Аналитика обучения"
        description="Статистика и аналитика по прохождению курсов"
        type="info"
        showIcon
      />

      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card title="Ключевые показатели">
            <Row gutter={[24, 24]}>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Процент завершения"
                    value={completionRate}
                    suffix="%"
                    valueStyle={{
                      color: completionRate > 70 ? "#52c41a" : "#faad14",
                    }}
                    prefix={
                      completionRate > 70 ? (
                        <RiseOutlined />
                      ) : (
                        <FallOutlined />
                      )
                    }
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Среднее время прохождения"
                    value={avgTimeToComplete}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Активных пользователей"
                    value={totalActiveUsers}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Новых пользователей (месяц)"
                    value={newUsersThisMonth}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title="Статистика по месяцам">
            <Timeline>
              {monthlyStats.map((stat, index) => (
                <Timeline.Item key={index} color="blue">
                  <Text strong>{stat.month}</Text>
                  <div>
                    <Tag color="green">Завершений: {stat.completions}</Tag>
                    <Tag color="orange">Средний балл: {stat.score}%</Tag>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Рекомендации по улучшению">
            <List
              dataSource={[
                'Добавить больше практических заданий в курс "Основы ИБ"',
                'Улучшить видео материалы для курса "Защита от фишинга"',
                "Ввести мотивационные бейджи за быстрое прохождение",
                "Добавить систему рейтинга пользователей",
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: "#1890ff" }}>
                        {index + 1}
                      </Avatar>
                    }
                    title={item}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="График активности" style={{ marginTop: "24px" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Text type="secondary">
            График активности будет отображаться после подключения аналитической
            системы
          </Text>
          <div style={{ marginTop: "16px" }}>
            <Button type="primary">Подключить аналитику</Button>
          </div>
        </div>
      </Card>
    </Space>
  );
};

export default AnalyticsContent;