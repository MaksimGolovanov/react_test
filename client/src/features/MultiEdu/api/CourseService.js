// src/services/CourseService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

class CourseService {
  // Основные операции с курсами
  static async getCourses(params = {}) {
    try {
      const response = await axios.get(`${API_URL}api/courses`, { params });
      return response.data;
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }

  static async getCourseCountsByCategory() {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/counts-by-category`
      );
      console.log('Course counts response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting course counts by category:', error);
      // Возвращаем значения по умолчанию в случае ошибки
      return {
        it: 0,
        ot: 0,
        pb: 0,
        med: 0,
      };
    }
  }

  static async completeLesson(userId, courseId, lessonId) {
    try {
      console.log('📡 API: Completing lesson', { userId, courseId, lessonId });

      // Пробуем разные варианты эндпоинтов
      const endpoints = [
        {
          url: `${API_URL}api/courses/${courseId}/complete-lesson/${userId}`,
          method: 'POST',
          data: { lesson_id: lessonId },
        },
        {
          url: `${API_URL}api/courses/user-progress/complete-lesson`,
          method: 'POST',
          data: { user_id: userId, course_id: courseId, lesson_id: lessonId },
        },
        {
          url: `${API_URL}api/progress/complete-lesson`,
          method: 'POST',
          data: { userId, courseId, lessonId },
        },
      ];

      for (let i = 0; i < endpoints.length; i++) {
        try {
          const endpoint = endpoints[i];
          console.log(`Trying endpoint ${i + 1}: ${endpoint.url}`);

          const response = await axios({
            method: endpoint.method,
            url: endpoint.url,
            data: endpoint.data,
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
          });

          console.log(`✅ Success with endpoint ${i + 1}:`, response.data);
          return response.data;
        } catch (error) {
          if (i === endpoints.length - 1) {
            // Если это последняя попытка, пробрасываем ошибку
            throw error;
          }
          console.log(`Endpoint ${i + 1} failed, trying next...`);
        }
      }
    } catch (error) {
      console.error('❌ All completeLesson endpoints failed:', error);

      // Если все эндпоинты не работают, используем fallback через updateUserProgress
      console.log('Using fallback method via updateUserProgress');

      try {
        // Получаем текущий прогресс
        const currentProgress = await this.getUserProgress(userId, courseId);

        let completedLessons = [];
        if (currentProgress && currentProgress.completed_lessons) {
          completedLessons = [...currentProgress.completed_lessons];
        }

        // Добавляем новый урок
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }

        // Обновляем прогресс
        const progressData = {
          completed_lessons: completedLessons,
          test_score: currentProgress?.test_score || 0,
          passed_test: currentProgress?.passed_test || false,
          total_time_spent: (currentProgress?.total_time_spent || 0) + 5,
          last_activity: new Date().toISOString(),
        };

        return await this.updateUserProgress(userId, courseId, progressData);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw new Error('Could not complete lesson: ' + fallbackError.message);
      }
    }
  }

  static async getCoursesByCategory(category, params = {}) {
    try {
      const response = await axios.get(`${API_URL}api/courses`, {
        params: {
          ...params,
          category,
          active: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting courses for category ${category}:`, error);
      throw error;
    }
  }

  static async getCourseById(id) {
    try {
      const response = await axios.get(`${API_URL}api/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting course:', error);
      throw error;
    }
  }

  static async createCourse(courseData) {
    console.log('Creating course with data:', courseData);
    try {
      const response = await axios.post(`${API_URL}api/courses`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  static async updateCourse(id, courseData) {
    try {
      const response = await axios.put(
        `${API_URL}api/courses/${id}`,
        courseData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  static async deleteCourse(id) {
    try {
      await axios.delete(`${API_URL}api/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // Уроки
  static async getCourseLessons(courseId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/${courseId}/lessons`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting lessons:', error);
      throw error;
    }
  }

  static async createLesson(courseId, lessonData) {
    try {
      const response = await axios.post(
        `${API_URL}api/courses/${courseId}/lessons`,
        lessonData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  static async updateLesson(courseId, lessonId, lessonData) {
    try {
      const response = await axios.put(
        `${API_URL}api/courses/${courseId}/lessons/${lessonId}`,
        lessonData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  static async deleteLesson(courseId, lessonId) {
    try {
      await axios.delete(
        `${API_URL}api/courses/${courseId}/lessons/${lessonId}`
      );
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }

  // Вопросы теста
  static async getCourseQuestions(courseId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/${courseId}/questions`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  }

  static async createQuestion(courseId, questionData) {
    try {
      const response = await axios.post(
        `${API_URL}api/courses/${courseId}/questions`,
        questionData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  static async updateQuestion(courseId, questionId, questionData) {
    try {
      const response = await axios.put(
        `${API_URL}api/courses/${courseId}/questions/${questionId}`,
        questionData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  static async deleteQuestion(courseId, questionId) {
    try {
      await axios.delete(
        `${API_URL}api/courses/${courseId}/questions/${questionId}`
      );
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  // Статистика
  static async getCourseStats(courseId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/${courseId}/stats`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting course stats:', error);
      throw error;
    }
  }

  // Прогресс пользователя
  static async getUserProgress(userId, courseId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/user-progress/${userId}/courses/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user progress:', error);
      // Возвращаем null вместо throw, чтобы не ломать приложение
      return null;
    }
  }

  static async updateUserProgress(userId, courseId, progressData) {
    try {
      console.log('📡 API: updateUserProgress', {
        userId,
        courseId,
        progressData,
        timestamp: new Date().toISOString(),
      });

      // Пробуем разные форматы URL
      const endpoints = [
        `${API_URL}api/user-progress/${userId}/${courseId}`,
        `${API_URL}api/courses/user-progress/${userId}/courses/${courseId}`,
        `${API_URL}api/progress/${userId}/${courseId}`,
        `${API_URL}api/courses/${courseId}/progress/${userId}`,
      ];

      for (const url of endpoints) {
        try {
          console.log(`Trying URL: ${url}`);

          const response = await axios.put(url, progressData, {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          });

          console.log(`✅ Success with URL ${url}:`, response.data);
          return response.data;
        } catch (error) {
          console.log(`URL ${url} failed:`, error.message);
          // Продолжаем пробовать следующий URL
        }
      }

      // Если ни один URL не сработал, пробуем POST запрос
      console.log('Trying POST as fallback...');
      const postUrl = `${API_URL}api/user-progress`;
      try {
        const response = await axios.post(
          postUrl,
          {
            user_id: userId,
            course_id: courseId,
            ...progressData,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000,
          }
        );
        console.log(`✅ Success with POST to ${postUrl}:`, response.data);
        return response.data;
      } catch (postError) {
        console.error('❌ POST also failed:', postError);
        throw new Error('All update endpoints failed');
      }
    } catch (error) {
      console.error('❌ Error in updateUserProgress:', {
        message: error.message,
        userId,
        courseId,
        progressData,
      });
      throw error;
    }
  }
  // Тестирование - только один метод
  static async submitTest(userId, courseId, testData) {
    try {
      console.log('Submitting test:', { userId, courseId, testData });
      const response = await axios.post(
        `${API_URL}api/courses/${courseId}/submit-test/${userId}`,
        testData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting test:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  }

  static async getUserTestResults(userId, courseId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/user-test-results/${userId}/courses/${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting test results:', error);
      // Возвращаем null вместо throw
      return null;
    }
  }

  static async getUserStats(userId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/user-stats/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Возвращаем null вместо throw
      return null;
    }
  }
}

export default CourseService;
