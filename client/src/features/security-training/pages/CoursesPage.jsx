// src/features/security-training/pages/CoursesPage.jsx
import React from 'react';
import { Row, Col, Typography, Divider, Alert } from 'antd';
import { courses } from '../data/coursesData';
import CourseCard from '../components/CourseCard';
import trainingStore from '../store/SecurityTrainingStore';
import { observer } from 'mobx-react-lite';

const { Title, Text } = Typography;

const CoursesPage = observer(() => {
  const completedCourses = courses.filter(
    course => trainingStore.userProgress[course.id]?.completed
  ).length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Обучение по информационной безопасности</Title>
      <Text type="secondary">
        Пройдите курсы для повышения осведомленности и защиты от киберугроз
      </Text>

      <Divider />

      <Alert
        message="Ваш прогресс"
        description={`Вы завершили ${completedCourses} из ${courses.length} курсов`}
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[24, 24]}>
        {courses.map(course => (
          <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>
    </div>
  );
});

export default CoursesPage;