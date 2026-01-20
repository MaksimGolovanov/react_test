// components/StatsTabContent.js
import React from 'react';
import { Descriptions, Tag } from 'antd';
import { formatTimeFromMinutes } from '../utils/formatUtils';

export const StatsTabContent = ({
  overallStats,
  completedCourses,
  failedCourses,
  inProgressCourses,
  averageScore,
}) => {
  // Проверяем и форматируем данные
  const safeOverallStats = {
    totalCourses: overallStats?.total_courses || overallStats?.totalCourses || 0, // Проверяем оба варианта
    completedCourses: overallStats?.completed_courses || overallStats?.completedCourses || 0,
    totalTime: overallStats?.total_time_spent || overallStats?.totalTime || 0,
  };

  const safeFailedCourses = Array.isArray(failedCourses) ? failedCourses : [];
  const safeInProgressCourses = Array.isArray(inProgressCourses) ? inProgressCourses : [];
  
  const safeAverageScore = typeof averageScore === 'number' && !isNaN(averageScore) 
    ? averageScore 
    : 0;

  // Расчет процента завершения
  const getCompletionPercentage = () => {
    if (safeOverallStats.totalCourses <= 0) return '0%';
    const percentage = (safeOverallStats.completedCourses / safeOverallStats.totalCourses) * 100;
    return `${Math.round(percentage)}%`;
  };

  // Расчет среднего времени на курс
  const getAverageTimePerCourse = () => {
    if (safeOverallStats.completedCourses <= 0) return '0 мин';
    const avgTime = safeOverallStats.totalTime / safeOverallStats.completedCourses;
    return formatTimeFromMinutes(avgTime);
  };

  // Определение цвета для среднего балла
  const getAverageScoreColor = () => {
    if (safeAverageScore >= 80) return 'green';
    if (safeAverageScore >= 60) return 'orange';
    return 'red';
  };

  // Определение текста для среднего балла
  const getAverageScoreText = () => {
    if (isNaN(safeAverageScore)) return '0.0%';
    return `${safeAverageScore.toFixed(1)}%`;
  };

  // Добавим отладку
  console.log('StatsTabContent - overallStats:', overallStats);
  console.log('StatsTabContent - safeOverallStats:', safeOverallStats);

  return (
    <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
      <Descriptions.Item label="Всего курсов" span={1}>
        {safeOverallStats.totalCourses}
      </Descriptions.Item>
      <Descriptions.Item label="Пройдено курсов" span={1}>
        {safeOverallStats.completedCourses}
      </Descriptions.Item>
      <Descriptions.Item label="Не пройдено" span={1}>
        {safeFailedCourses.length}
      </Descriptions.Item>
      <Descriptions.Item label="В процессе" span={1}>
        {safeInProgressCourses.length}
      </Descriptions.Item>
      <Descriptions.Item label="Процент завершения" span={1}>
        {getCompletionPercentage()}
      </Descriptions.Item>
      <Descriptions.Item label="Общее время обучения" span={1}>
        {formatTimeFromMinutes(safeOverallStats.totalTime)}
      </Descriptions.Item>
      <Descriptions.Item label="Среднее время на курс" span={2}>
        {getAverageTimePerCourse()}
      </Descriptions.Item>
      <Descriptions.Item label="Средний балл" span={2}>
        <Tag color={getAverageScoreColor()}>
          {getAverageScoreText()}
        </Tag>
      </Descriptions.Item>
    </Descriptions>
  );
};