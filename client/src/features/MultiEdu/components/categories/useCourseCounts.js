// src/features/security-training/components/useCourseCounts.js
import { useState, useEffect } from 'react';
import CourseService from '../../api/CourseService';

export const useCourseCounts = (categories) => {
  const [courseCounts, setCourseCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseCounts = async () => {
      try {
        const categoryPromises = categories.map(async (category) => {
          try {
            const response = await CourseService.getCourses({
              category: category.dbCategory,
              active: true,
            });

            const count = response?.courses?.length || 0;
            const total = response?.pagination?.total || count;

            return { category: category.dbCategory, count: total };
          } catch (error) {
            console.error(`Ошибка загрузки курсов для ${category.dbCategory}:`, error);
            return { category: category.dbCategory, count: 0 };
          }
        });

        const results = await Promise.all(categoryPromises);
        const counts = results.reduce((acc, result) => {
          acc[result.category] = result.count;
          return acc;
        }, {});

        setCourseCounts(counts);
      } catch (error) {
        console.error('Ошибка загрузки количества курсов:', error);
        setCourseCounts({});
      } finally {
        setLoading(false);
      }
    };

    loadCourseCounts();
  }, [categories]);

  return { courseCounts, loading };
};