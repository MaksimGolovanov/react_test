// src/services/CourseService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const REQUEST_TIMEOUT = 5000;

class CourseService {
  static async getCourses(params = {}) {
    try {
      const response = await axios.get(`${API_URL}api/courses`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCourseCountsByCategory() {
    try {
      const response = await axios.get(`${API_URL}api/courses/counts-by-category`);
      return response.data;
    } catch (error) {
      return { it: 0, ot: 0, pb: 0, med: 0 };
    }
  }

  static async completeLesson(userId, courseId, lessonId, timeSpent = null) {
    try {
      const currentProgress = await this.getUserProgress(userId, courseId);
      
      const actualTimeSpent = this.calculateActualTimeSpent(timeSpent);
      const updatedProgress = this.updateProgressData(
        currentProgress, 
        lessonId, 
        actualTimeSpent
      );

      const result = await this.saveProgressViaEndpoints(
        userId, 
        courseId, 
        lessonId, 
        actualTimeSpent, 
        updatedProgress
      );

      return result || {
        success: true,
        message: 'Урок завершен локально',
        localProgress: updatedProgress
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Урок завершен локально, но не сохранен в БД',
      };
    }
  }

  static calculateActualTimeSpent(timeSpent) {
    if (timeSpent === null || timeSpent === 0 || timeSpent === undefined) {
      return 3;
    }
    return Math.max(1, Math.min(Math.ceil(timeSpent), 120));
  }

  static updateProgressData(currentProgress, lessonId, timeSpent) {
    const completedLessons = currentProgress?.completed_lessons || [];
    const currentTotalTime = currentProgress?.total_time_spent || 0;
    const currentLessonTimeSpent = currentProgress?.lesson_time_spent || {};

    const updatedLessonTimeSpent = {
      ...currentLessonTimeSpent,
      [lessonId]: (currentLessonTimeSpent[lessonId] || 0) + timeSpent
    };

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    return {
      completed_lessons: completedLessons,
      test_score: currentProgress?.test_score || 0,
      passed_test: currentProgress?.passed_test || false,
      total_time_spent: currentTotalTime + timeSpent,
      lesson_time_spent: updatedLessonTimeSpent,
      last_activity: new Date().toISOString()
    };
  }

  static async saveProgressViaEndpoints(userId, courseId, lessonId, timeSpent, progressData) {
    const endpoints = [
      {
        url: `${API_URL}api/courses/${courseId}/complete-lesson/${userId}`,
        method: 'POST',
        data: { lesson_id: lessonId, time_spent: timeSpent },
      },
      {
        url: `${API_URL}api/lessons/complete`,
        method: 'POST',
        data: { user_id: userId, course_id: courseId, lesson_id: lessonId, time_spent: timeSpent },
      },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios({
          method: endpoint.method,
          url: endpoint.url,
          data: endpoint.data,
          headers: { 'Content-Type': 'application/json' },
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      } catch (error) {
        continue;
      }
    }

    return await this.updateUserProgress(userId, courseId, progressData);
  }

  static async getCoursesByCategory(category, params = {}) {
    try {
      const response = await axios.get(`${API_URL}api/courses`, {
        params: { ...params, category, active: true },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getCourseById(id) {
    try {
      const response = await axios.get(`${API_URL}api/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createCourse(courseData) {
    try {
      const response = await axios.post(`${API_URL}api/courses`, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateCourse(id, courseData) {
    try {
      const response = await axios.put(`${API_URL}api/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteCourse(id) {
    try {
      await axios.delete(`${API_URL}api/courses/${id}`);
    } catch (error) {
      throw error;
    }
  }

  static async getCourseLessons(courseId) {
    try {
      const response = await axios.get(`${API_URL}api/courses/${courseId}/lessons`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createLesson(courseId, lessonData) {
    console.log(lessonData)
    try {
      const response = await axios.post(
        `${API_URL}api/courses/${courseId}/lessons`,
        lessonData
      );
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  static async deleteLesson(courseId, lessonId) {
    try {
      await axios.delete(`${API_URL}api/courses/${courseId}/lessons/${lessonId}`);
    } catch (error) {
      throw error;
    }
  }

  static async getCourseQuestions(courseId) {
    try {
      const response = await axios.get(`${API_URL}api/courses/${courseId}/questions`);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  static async deleteQuestion(courseId, questionId) {
    try {
      await axios.delete(`${API_URL}api/courses/${courseId}/questions/${questionId}`);
    } catch (error) {
      throw error;
    }
  }

  static async getCourseStats(courseId) {
    try {
      const response = await axios.get(`${API_URL}api/courses/${courseId}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUserProgress(userId, courseId) {
    try {
      const response = await axios.get(
        `${API_URL}api/courses/user-progress/${userId}/courses/${courseId}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async updateUserProgress(userId, courseId, progressData) {
    const endpoints = [
      `${API_URL}api/user-progress/${userId}/${courseId}`,
      `${API_URL}api/courses/user-progress/${userId}/courses/${courseId}`,
      `${API_URL}api/progress/${userId}/${courseId}`,
      `${API_URL}api/courses/${courseId}/progress/${userId}`,
    ];

    for (const url of endpoints) {
      try {
        const response = await axios.put(url, progressData, {
          headers: { 'Content-Type': 'application/json' },
          timeout: REQUEST_TIMEOUT,
        });
        return response.data;
      } catch (error) {
        continue;
      }
    }

    try {
      const response = await axios.post(
        `${API_URL}api/user-progress`,
        { user_id: userId, course_id: courseId, ...progressData },
        { headers: { 'Content-Type': 'application/json' }, timeout: REQUEST_TIMEOUT }
      );
      return response.data;
    } catch (error) {
      throw new Error('Все эндпоинты обновления прогресса не сработали');
    }
  }

  static async submitTest(userId, courseId, testData) {
    try {
      const response = await axios.post(
        `${API_URL}api/courses/${courseId}/submit-test/${userId}`,
        testData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
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
      return null;
    }
  }

  static async getUserStats(userId) {
    try {
      const response = await axios.get(`${API_URL}api/courses/user-stats/${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

export default CourseService;