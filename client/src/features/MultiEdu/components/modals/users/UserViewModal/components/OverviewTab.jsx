// components/OverviewTab.js
import React from 'react';
import { Space, Tag, Typography, Divider } from 'antd';

// Компоненты
import { OverallStatsCards } from './OverallStatsCards';
import { LastCompletedCourseCard } from './LastCompletedCourseCard';

const { Text } = Typography;

export const OverviewTab = ({
  overallStats,
  averageScore,
  completedCourses,
  failedCourses,
  inProgressCourses,
  notStartedCourses,
  lastCompletedCourse,
}) => {
  return (
    <div>
      <OverallStatsCards
        overallStats={overallStats}
        averageScore={averageScore}
      />

      <Divider />

      {/* Краткий обзор курсов */}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>Статус курсов:</Text>
        <Space wrap>
          <Tag color="green">Пройдено: {completedCourses.length}</Tag>
          <Tag color="red">Не пройдено: {failedCourses.length}</Tag>
          <Tag color="blue">В процессе: {inProgressCourses.length}</Tag>
          <Tag color="default">Не начаты: {notStartedCourses.length}</Tag>
        </Space>
      </Space>

      {/* Последний пройденный курс */}
      {lastCompletedCourse && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Последний пройденный курс:</Text>
          <LastCompletedCourseCard course={lastCompletedCourse} />
        </div>
      )}
    </div>
  );
};