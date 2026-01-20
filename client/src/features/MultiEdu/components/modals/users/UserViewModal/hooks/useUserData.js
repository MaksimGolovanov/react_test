// hooks/useUserData.js
import { useState, useEffect } from 'react';
import CourseService from '../../../../../api/CourseService';

export const useUserData = (user, visible) => {
  const [userStats, setUserStats] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!visible || !user?.tabNumber) return;

      setLoading(true);
      try {
        // Загружаем статистику пользователя
        const stats = await CourseService.getUserStats(user.tabNumber);
        setUserStats(stats);

        // Загружаем все курсы пользователя с прогрессом
        const coursesResponse = await CourseService.getCourses({ limit: 1000 });
        const allCourses = coursesResponse.courses || [];

        const progressData = [];
        for (const course of allCourses) {
          try {
            const progress = await CourseService.getUserProgress(
              user.tabNumber,
              course.id
            );
            if (progress) {
              progressData.push({
                ...course,
                progress,
              });
            }
            console.log("UserProgress", progress )
          } catch (error) {
            console.error(`Error loading progress for course ${course.id}:`, error);
            continue;
          }
        }

        setUserProgress(progressData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [visible, user]);

  return { userStats, userProgress, loading };
};