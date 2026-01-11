// src/features/security-training/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import moment from 'moment';
import securityTrainingStore from '../store/SecurityTrainingStore';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    avgScore: 0,
    totalCourses: 0,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      await securityTrainingStore.fetchAllUsersData();
      const userData = securityTrainingStore.getTrainingStats?.() || [];

      if (Array.isArray(userData)) {
        setUsers(userData);
        
        // Расчет статистики
        const activeUsers = userData.filter(
          (u) => u.last_course_completed &&
          moment(u.last_course_completed).isAfter(moment().subtract(7, 'days'))
        ).length;

        const avgScore = userData.length > 0
          ? (userData.reduce((sum, user) => sum + (user.average_score || 0), 0) / userData.length).toFixed(1)
          : 0;

        const totalCourses = userData.reduce(
          (sum, user) => sum + (user.completed_courses || 0), 0
        );

        setStatsData({
          totalUsers: userData.length,
          activeUsers,
          avgScore,
          totalCourses,
        });
      } else {
        console.error('getTrainingStats не вернул массив:', userData);
        setUsers([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      message.error('Не удалось загрузить пользователей');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, statsData, loadUsers };
};