// src/features/security-training/hooks/useCourses.js
import { useState, useEffect, useCallback } from 'react';
import userStore from '../../admin/store/UserStore';
import trainingStore from '../store/SecurityTrainingStore';
import CourseService from '../api/CourseService'; // Используем правильный сервис

export const useCourses = (category = null) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const isUserAuthenticated = userStore.isAuthenticated;
  const tabNumber = userStore.tabNumber || '';

  // Обернули loadUserProgress в useCallback
  const loadUserProgress = useCallback(async (userId, coursesList) => {
    try {
      const progressMap = {};
      const storeProgress = trainingStore.userProgress;

      for (const course of coursesList) {
        try {
          const apiProgress = await CourseService.getUserProgress(
            userId,
            course.id
          );

          if (apiProgress && typeof apiProgress === 'object') {
            progressMap[course.id] = {
              completed_lessons: apiProgress.completed_lessons || [],
              test_score: apiProgress.test_score || 0,
              passed_test: apiProgress.passed_test || false,
              total_time_spent: apiProgress.total_time_spent || 0,
            };
          } else {
            // Используем данные из store
            const storeData = storeProgress[course.id];
            if (storeData) {
              progressMap[course.id] = {
                completed_lessons: storeData.completedLessons || [],
                test_score: storeData.testScore || 0,
                passed_test:
                  storeData.completed || storeData.passed_test || false,
                total_time_spent: storeData.totalTimeSpent || 0,
              };
            } else {
              progressMap[course.id] = {
                completed_lessons: [],
                test_score: 0,
                passed_test: false,
                total_time_spent: 0,
              };
            }
          }
        } catch (error) {
          console.error(
            `Error loading progress for course ${course.id}:`,
            error
          );
          // Используем данные из store как fallback
          const storeData = storeProgress[course.id];
          progressMap[course.id] = storeData
            ? {
                completed_lessons: storeData.completedLessons || [],
                test_score: storeData.testScore || 0,
                passed_test: storeData.completed || false,
                total_time_spent: storeData.totalTimeSpent || 0,
              }
            : {
                completed_lessons: [],
                test_score: 0,
                passed_test: false,
                total_time_spent: 0,
              };
        }
      }

      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }, []); // trainingStore.userProgress можно не добавлять, так как это MobX store

  // Обернули loadData в useCallback - теперь включает loadUserProgress в зависимости
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading courses with category:', category);
      
      // 1. Загружаем все курсы или фильтруем по категории через API
      let params = { active: true };
      if (category) {
        params.category = category; // Фильтрация на сервере
      }
      
      const coursesResponse = await CourseService.getCourses(params);
      console.log('Courses API response:', coursesResponse);
      
      const loadedCourses = coursesResponse.courses || [];
      console.log('Loaded courses:', loadedCourses);
      
      // 2. Устанавливаем курсы (уже отфильтрованные сервером при наличии category)
      setCourses(loadedCourses);
      
      // 3. Дополнительная фильтрация на клиенте на всякий случай
      let filtered = loadedCourses;
      if (category) {
        filtered = loadedCourses.filter(course => {
          console.log(`Checking course ${course.id}: category=${course.category}, matches? ${course.category === category}`);
          return course.category === category;
        });
        console.log('After client filtering:', filtered);
      }
      setFilteredCourses(filtered);

      // 4. Загружаем прогресс пользователя, если авторизован
      if (isUserAuthenticated && tabNumber) {
        await loadUserProgress(tabNumber, filtered);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }, [category, isUserAuthenticated, tabNumber, loadUserProgress]); // Добавлена loadUserProgress

  useEffect(() => {
    console.log('useCourses: category changed to:', category);
    loadData();
  }, [refreshKey, isUserAuthenticated, tabNumber, category, loadData]); // Добавлен loadData в зависимости

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Вспомогательная функция для получения названия категории
  const getCategoryName = (category) => {
    const categories = {
      'it': 'Информационная безопасность',
      'ot': 'Охрана труда',
      'pb': 'Пожарная безопасность',
      'med': 'Первая помощь'
    };
    return categories[category] || category;
  };

  // Вспомогательная функция для получения цвета категории
  const getCategoryColor = (category) => {
    const colors = {
      'it': '#1890ff',
      'ot': '#52c41a',
      'pb': '#f5222d',
      'med': '#eb2f96'
    };
    return colors[category] || '#d9d9d9';
  };

  return {
    courses: filteredCourses, // Возвращаем только отфильтрованные курсы
    allCourses: courses, // Все курсы (для справки)
    loading,
    userProgress,
    refreshKey,
    loadData,
    handleRefresh,
    getCategoryName,
    getCategoryColor,
    currentCategory: category
  };
};