// src/features/security-training/store/SecurityTrainingStore.js
import { makeAutoObservable, observable, action } from 'mobx';
import { message } from 'antd';
import AdminService from '../api/STService';
import CourseService from '../api/CourseService';
import userStore from '../../admin/store/UserStore';
import moment from 'moment';

class SecurityTrainingStore {
  courses = observable.array([]);
  currentCourse = null;
  courseLessons = observable.array([]);
  courseQuestions = observable.array([]);
  courseStats = {};
  userProgress = {};
  currentTest = null;
  testResults = [];
  isLoading = false;
  users = observable.array([]);
  stUsers = observable.array([]);
  roles = [];
  userRoles = [];
  userRolesAuth = [];
  loading = true;
  isAuthenticated = false;
  tabNumber = '';
  userName = '';
  combinedUsers = observable.array([]);
  stStats = observable.array([]);

  constructor() {
    makeAutoObservable(this, {
      users: observable.shallow,
      stUsers: observable.shallow,
      combinedUsers: observable.shallow,
      stStats: observable.shallow,
    });

    // Загружаем состояние аутентификации при инициализации
    this.loadAuthState();
    this.loadProgress();
    // Убрали дублирующийся вызов loadCourses из конструктора
    this.fetchAllUsersData();
  }

  // Загрузка состояния аутентификации из localStorage
  loadAuthState = action(() => {
    try {
      console.log('Loading auth state...');

      // 1. Проверяем securityTrainingAuth
      const securityAuth = localStorage.getItem('securityTrainingAuth');
      if (securityAuth) {
        const parsed = JSON.parse(securityAuth);
        console.log('Loaded from securityTrainingAuth:', parsed);
        this.isAuthenticated = parsed.isAuthenticated || false;
        this.tabNumber = parsed.tabNumber || '';
        this.userName = parsed.userName || '';
        this.userRolesAuth = parsed.userRoles || [];
        return;
      }

      // 2. Проверяем общий auth
      const generalAuth = localStorage.getItem('auth');
      if (generalAuth) {
        const parsed = JSON.parse(generalAuth);
        console.log('Loaded from general auth:', parsed);
        this.isAuthenticated = parsed.isAuthenticated || false;
        this.tabNumber = parsed.tabNumber || '';
        this.userName = parsed.userName || '';
        this.userRolesAuth = parsed.roles || [];
        return;
      }

      // 3. Проверяем токен
      const token =
        localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (token) {
        console.log('Token found, setting authenticated to true');
        this.isAuthenticated = true;
        // Можно попробовать получить данные пользователя из API
      }

      console.log('Auth state loaded:', {
        isAuthenticated: this.isAuthenticated,
        tabNumber: this.tabNumber,
        userName: this.userName,
      });
    } catch (error) {
      console.error('Error loading auth state:', error);
      this.isAuthenticated = false;
      this.tabNumber = '';
      this.userName = '';
      this.userRolesAuth = [];
    }
  });

  updateStatisticsAfterTest = action(async (userId, courseId, testData) => {
    try {
      console.log('Updating statistics after test:', {
        userId,
        courseId,
        testData,
      });

      // Обновляем локальный прогресс
      if (!this.userProgress[courseId]) {
        this.userProgress[courseId] = {
          completedLessons: [],
          testScore: 0,
          passed_test: false,
          totalTimeSpent: 0,
          completed: false,
        };
      }

      this.userProgress[courseId].testScore = testData.score;
      this.userProgress[courseId].passed_test = testData.passed;
      this.userProgress[courseId].completed = testData.passed;
      this.userProgress[courseId].totalTimeSpent =
        (this.userProgress[courseId].totalTimeSpent || 0) +
        (testData.time_spent || 0);

      if (testData.passed) {
        this.userProgress[courseId].completionDate = new Date();
      }

      // Сохраняем в localStorage
      this.saveProgress();

      // Обновляем ST статистику через API
      if (userId) {
        try {
          await CourseService.updateUserProgress(userId, courseId, {
            test_score: testData.score,
            passed_test: testData.passed,
            total_time_spent: testData.time_spent || 0,
          });
          console.log('Statistics updated via API');
        } catch (apiError) {
          console.warn('Could not update statistics via API:', apiError);
        }
      }

      console.log('Statistics updated in store:', this.userProgress[courseId]);
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  });

  getUserProgressFromAPI = action(async (userId, courseId) => {
    try {
      console.log(`Fetching progress for user ${userId}, course ${courseId}`);
      const progress = await CourseService.getUserProgress(userId, courseId);
      console.log(`Progress from API for course ${courseId}:`, progress);

      // Если API возвращает null (например, 404), возвращаем локальный прогресс
      if (!progress) {
        return (
          this.userProgress[courseId] || {
            completedLessons: [],
            testScore: 0,
            passed_test: false,
            totalTimeSpent: 0,
          }
        );
      }

      // Обновляем локальный прогресс
      this.userProgress[courseId] = {
        completedLessons:
          progress.completed_lessons || progress.completedLessons || [],
        testScore: progress.test_score || progress.testScore || 0,
        passed_test:
          progress.passed_test ||
          progress.passedTest ||
          progress.completed ||
          false,
        totalTimeSpent:
          progress.total_time_spent || progress.totalTimeSpent || 0,
      };

      return this.userProgress[courseId];
    } catch (error) {
      console.error(`Error getting user progress from API:`, error);
      return this.userProgress[courseId] || null;
    }
  });

  // Добавьте этот метод в класс SecurityTrainingStore
  updateTestResult = action((courseId, testData) => {
    console.log('Updating test result in store:', { courseId, testData });

    if (!this.userProgress[courseId]) {
      this.userProgress[courseId] = {
        completedLessons: [],
        testScore: 0,
        passed_test: false,
        totalTimeSpent: 0,
        completed: false,
        completionDate: null,
      };
    }

    // Обновляем данные теста
    this.userProgress[courseId].testScore = testData.score;
    this.userProgress[courseId].passed_test = testData.passed;
    this.userProgress[courseId].completed = testData.passed;
    this.userProgress[courseId].completionDate =
      testData.completed_at || new Date();
    this.userProgress[courseId].answers = testData.answers;
    this.userProgress[courseId].totalTimeSpent =
      (this.userProgress[courseId].totalTimeSpent || 0) +
      (testData.time_spent || 0);

    // Сохраняем в localStorage
    this.saveProgress();

    // Обновляем статистику ST пользователя
    this.updateSTStatistics(courseId, testData);

    console.log('Test result updated in store:', {
      courseId,
      score: testData.score,
      passed: testData.passed,
    });
  });

  // Метод для обновления статистики ST
  updateSTStatistics = action(async (courseId, testData) => {
    try {
      const userId = this.currentUserTabNumber;
      if (!userId) return;

      // Получаем текущую статистику
      const currentStats = this.getTrainingStats().find(
        (user) => user.tabNumber === userId
      );

      if (!currentStats) return;

      // Обновляем статистику
      const updatedStats = {
        completed_courses:
          currentStats.completed_courses + (testData.passed ? 1 : 0),
        average_score: this.calculateAverageScore(userId, testData.score),
        total_training_time:
          (currentStats.total_training_time || 0) + (testData.time_spent || 0),
        last_course_completed: testData.completed_at || new Date(),
      };

      // Обновляем в store
      const userIndex = this.combinedUsers.findIndex(
        (user) => user.tabNumber === userId
      );

      if (userIndex !== -1) {
        const user = this.combinedUsers[userIndex];
        if (user.stData) {
          user.stData = { ...user.stData, ...updatedStats };
          this.combinedUsers[userIndex] = user;
        }
      }
    } catch (error) {
      console.error('Error updating ST statistics:', error);
    }
  });

  calculateAverageScore = (userId, newScore) => {
    const user = this.combinedUsers.find((u) => u.tabNumber === userId);
    if (!user || !user.stData) return newScore;

    const currentAverage = user.stData.average_score || 0;
    const completedCourses = user.stData.completed_courses || 0;

    if (completedCourses === 0) return newScore;

    return (
      (currentAverage * completedCourses + newScore) / (completedCourses + 1)
    );
  };

  // Загрузка прогресса из localStorage
  loadProgress = () => {
    try {
      const savedProgress = localStorage.getItem('securityTrainingProgress');
      if (savedProgress) {
        this.userProgress = JSON.parse(savedProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Загрузка курсов (используем правильный метод)
  loadCourses = action(async (params = {}) => {
    try {
      this.isLoading = true;
      const response = await CourseService.getCourses(params);
      this.courses.replace(response.courses || []);
      return response;
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Ошибка загрузки курсов');
      return { courses: [], pagination: {} };
    } finally {
      this.isLoading = false;
    }
  });

  getCourseById = action(async (courseId) => {
    try {
      this.isLoading = true;
      const course = await CourseService.getCourseById(courseId);
      this.currentCourse = course;
      return course;
    } catch (error) {
      console.error('Error getting course:', error);
      message.error('Ошибка загрузки курса');
      throw error;
    } finally {
      this.isLoading = false;
    }
  });

  loadCourseLessons = action(async (courseId) => {
    try {
      const lessons = await CourseService.getCourseLessons(courseId);
      this.courseLessons.replace(lessons || []);
      return lessons;
    } catch (error) {
      console.error('Error loading course lessons:', error);
      message.error('Ошибка загрузки уроков');
      throw error;
    }
  });

  loadCourseQuestions = action(async (courseId) => {
    try {
      const questions = await CourseService.getCourseQuestions(courseId);
      this.courseQuestions.replace(questions || []);
      return questions;
    } catch (error) {
      console.error('Error loading course questions:', error);
      message.error('Ошибка загрузки вопросов');
      throw error;
    }
  });

  getCourseStats = action(async (courseId) => {
    try {
      const stats = await CourseService.getCourseStats(courseId);
      this.courseStats[courseId] = stats;
      return stats;
    } catch (error) {
      console.error('Error getting course stats:', error);
      message.error('Ошибка загрузки статистики');
      throw error;
    }
  });

  // Сохранение прогресса в localStorage
  saveProgress = () => {
    try {
      localStorage.setItem(
        'securityTrainingProgress',
        JSON.stringify(this.userProgress)
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Получение прогресса пользователя по курсу из API
  getUserProgressFromAPI = action(async (userId, courseId) => {
    try {
      console.log(`Fetching progress for user ${userId}, course ${courseId}`);
      const progress = await CourseService.getUserProgress(userId, courseId);
      console.log(`Progress from API for course ${courseId}:`, progress);

      // Обновляем локальный прогресс
      if (!this.userProgress[courseId]) {
        this.userProgress[courseId] = {
          completedLessons: [],
          testScore: 0,
          passed_test: false,
          totalTimeSpent: 0,
        };
      }

      // Обновляем данные из API
      if (progress) {
        this.userProgress[courseId] = {
          completedLessons:
            progress.completed_lessons || progress.completedLessons || [],
          testScore: progress.test_score || progress.testScore || 0,
          passed_test:
            progress.passed_test ||
            progress.passedTest ||
            progress.completed ||
            false,
          totalTimeSpent:
            progress.total_time_spent || progress.totalTimeSpent || 0,
        };
      }

      return this.userProgress[courseId];
    } catch (error) {
      console.error(`Error getting user progress from API:`, error);
      return null;
    }
  });

  // Получение всех данных пользователей
  fetchAllUsersData = action(async () => {
    try {
      this.loading = true;

      // Загружаем данные параллельно
      const [regularUsers, stUsers, roles] = await Promise.all([
        AdminService.fetchUserWithRoles(),
        AdminService.fetchSTUsers(),
        AdminService.fetchRole(),
      ]);

      // Сохраняем в сторе
      this.users.replace(regularUsers);
      this.stUsers.replace(stUsers);
      this.roles = roles;

      // Формируем объединенный список пользователей
      this.updateCombinedUsers();

      console.log('Data loaded:', {
        regularUsers: regularUsers?.length || 0,
        stUsers: stUsers?.length || 0,
        roles: roles?.length || 0,
      });
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      message.error('Ошибка загрузки данных пользователей');
    } finally {
      this.loading = false;
    }
  });

  // Обновление объединенного списка пользователей
  updateCombinedUsers = action(() => {
    try {
      const regularUsers = Array.isArray(this.users) ? this.users : [];
      const stUsers = Array.isArray(this.stUsers) ? this.stUsers : [];

      const combined = regularUsers
        .map((user) => {
          if (!user) return null;

          // Находим соответствующего ST пользователя
          const stUser = stUsers.find(
            (st) =>
              st &&
              (st.tabNumber === user.tabNumber ||
                st.userId === user.id ||
                (user.tabNumber && st.tabNumber === user.tabNumber))
          );

          // Проверяем, есть ли у пользователя ST роль
          const userRoles = user.Roles || [];
          const hasSTRole = userRoles.some((role) => {
            if (!role) return false;
            const roleName = typeof role === 'object' ? role.role : role;
            return roleName === 'ST' || roleName === 'ST-ADMIN';
          });

          return {
            ...user,
            isSTUser: hasSTRole || !!stUser,
            stData: stUser || null,
            stStats: stUser
              ? {
                  completed_courses: stUser.completed_courses || 0,
                  average_score: stUser.average_score || 0,
                  total_training_time: stUser.total_training_time || 0,
                  last_course_completed: stUser.last_course_completed,
                }
              : null,
          };
        })
        .filter((user) => user !== null);

      this.combinedUsers.replace(combined);
    } catch (error) {
      console.error('Error updating combined users:', error);
      this.combinedUsers.replace([]);
    }
  });

  // Получение статистики обучения
  getTrainingStats = action(() => {
    const combinedUsers = Array.isArray(this.combinedUsers)
      ? this.combinedUsers
      : [];

    return combinedUsers
      .filter((user) => user && user.isSTUser)
      .map((user) => {
        const roles = [];

        // Безопасное получение ролей
        const userRoles = user.Roles || user.roles || [];
        userRoles.forEach((role) => {
          if (typeof role === 'object' && role.role) {
            roles.push(role.role);
          } else if (typeof role === 'string') {
            roles.push(role);
          }
        });

        return {
          id: user.id || user.userId || null,
          login: user.login || '',
          tabNumber: user.tabNumber || user.tab_number || '',
          description: user.description || '',
          roles: roles,
          completed_courses:
            user.stData?.completed_courses || user.completed_courses || 0,
          average_score: user.stData?.average_score || user.average_score || 0,
          total_training_time:
            user.stData?.total_training_time || user.total_training_time || 0,
          last_course_completed: user.stData?.last_course_completed || null,
          stData: user.stData || null,
        };
      });
  });

  // Получение ST пользователя по ID
  getSTUserById = (userId) => {
    const combinedUsers = Array.isArray(this.combinedUsers)
      ? this.combinedUsers
      : [];
    return combinedUsers.find((user) => user && user.id === userId);
  };

  // Создание нового ST пользователя
  createSTUser = action(async (userData) => {
    try {
      this.loading = true;
      const result = await AdminService.createSTUser(userData);

      // Обновляем данные
      await this.fetchAllUsersData();

      message.success('Пользователь обучения успешно создан');
      return result;
    } catch (error) {
      console.error('Error creating ST user:', error);
      message.error(
        error.response?.data?.message || 'Ошибка создания пользователя'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Обновление ST пользователя
  updateSTUser = action(async (userId, userData) => {
    try {
      this.loading = true;

      console.log('Updating ST user in store:', { userId, userData });

      // Получаем ST пользователя
      const stUser = this.getSTUserById(userId);
      console.log('Found ST user:', stUser);

      if (!stUser) {
        throw new Error('ST пользователь не найден в store');
      }

      // Убедитесь, что у нас есть stData.id
      if (!stUser.stData?.id) {
        throw new Error('ID ST пользователя не найден');
      }

      const stUserId = stUser.stData.id;
      console.log('Using ST user ID for update:', stUserId);

      const result = await AdminService.updateSTUser(stUserId, userData);

      // Обновляем данные
      await this.fetchAllUsersData();

      message.success('Пользователь обучения успешно обновлен');
      return result;
    } catch (error) {
      console.error('Error updating ST user in store:', error);
      message.error(
        error.response?.data?.message ||
          error.message ||
          'Ошибка обновления пользователя'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Удаление ST пользователя
  deleteSTUser = action(async (userId) => {
    try {
      this.loading = true;

      // Получаем ST пользователя для получения ST ID
      const stUser = this.getSTUserById(userId);
      if (!stUser || !stUser.stData) {
        throw new Error('ST пользователь не найден');
      }

      await AdminService.deleteSTUser(stUser.stData.id);

      // Обновляем данные
      await this.fetchAllUsersData();

      message.success('Пользователь обучения успешно удален');
    } catch (error) {
      console.error('Error deleting ST user:', error);
      message.error(
        error.response?.data?.message || 'Ошибка удаления пользователя'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Обновление статистики обучения
  updateTrainingStats = action(async (userId, statsData) => {
    try {
      this.loading = true;

      // Получаем ST пользователя для получения ST ID
      const stUser = this.getSTUserById(userId);
      if (!stUser || !stUser.stData) {
        throw new Error('ST пользователь не найден');
      }

      const result = await AdminService.updateSTUserStats(
        stUser.stData.id,
        statsData
      );

      // Обновляем данные
      await this.fetchAllUsersData();

      message.success('Статистика обучения обновлена');
      return result;
    } catch (error) {
      console.error('Error updating training stats:', error);
      message.error(
        error.response?.data?.message || 'Ошибка обновления статистики'
      );
      throw error;
    } finally {
      this.loading = false;
    }
  });

  // Завершение урока
  completeLesson = action(async (courseId, lessonId, timeSpent = 0) => {
    try {
      console.log('🔄 STORE: Completing lesson', {
        courseId,
        lessonId,
        timeSpent,
      });

      // 1. Инициализируем прогресс если нужно
      if (!this.userProgress[courseId]) {
        this.userProgress[courseId] = {
          completedLessons: [],
          testScore: 0,
          completed: false,
          completionDate: null,
          totalTimeSpent: 0,
        };
      }

      // 2. Проверяем, не завершен ли уже урок
      const currentProgress = this.userProgress[courseId];
      if (currentProgress.completedLessons.includes(lessonId)) {
        console.log('Lesson already completed');
        return;
      }

      // 3. Обновляем локальные данные
      currentProgress.completedLessons.push(lessonId);
      currentProgress.totalTimeSpent += timeSpent;

      // 4. Сохраняем в localStorage
      this.saveProgress();

      console.log('✅ STORE: Lesson completed locally', {
        courseId,
        lessonId,
        completedLessons: currentProgress.completedLessons,
        totalTimeSpent: currentProgress.totalTimeSpent,
      });

      // 5. Показываем уведомление
      message.success('Урок завершен локально');
    } catch (error) {
      console.error('❌ STORE: Error in completeLesson:', error);
      message.error('Ошибка при локальном сохранении урока');
    }
  });

  // Новый метод для сохранения прогресса в БД
  saveLessonProgressToDB = action(async (userId, courseId, lessonId) => {
    try {
      console.log('Saving lesson progress to DB:', {
        userId,
        courseId,
        lessonId,
      });

      // Получаем текущий прогресс
      const currentProgress = this.userProgress[courseId] || {
        completedLessons: [],
        testScore: 0,
        passed_test: false,
        totalTimeSpent: 0,
        completed: false,
      };

      // Подготавливаем данные для отправки
      const progressData = {
        completed_lessons: currentProgress.completedLessons,
        test_score: currentProgress.testScore,
        passed_test:
          currentProgress.passed_test || currentProgress.completed || false,
        total_time_spent: currentProgress.totalTimeSpent,
        last_activity: new Date().toISOString(),
      };

      // Отправляем на сервер
      const response = await CourseService.updateUserProgress(
        userId,
        courseId,
        progressData
      );

      console.log('Progress saved to DB:', response);
      return response;
    } catch (error) {
      console.error('Error saving lesson progress to DB:', error);
      // Не прерываем выполнение, просто логируем ошибку
      throw error;
    }
  });

  // Отправка результатов теста
  submitTest = action((courseId, answers, score) => {
    if (!this.userProgress[courseId]) {
      this.userProgress[courseId] = {
        completedLessons: [],
        testScore: 0,
        completed: false,
        completionDate: null,
        totalTimeSpent: 0,
      };
    }

    this.userProgress[courseId].testScore = score;
    this.userProgress[courseId].completed = true;
    this.userProgress[courseId].completionDate = new Date().toISOString();

    this.testResults.push({
      courseId,
      score,
      date: new Date().toISOString(),
      answers,
    });

    this.saveProgress();
    message.success(`Тест завершен! Ваш результат: ${score}%`);
  });

  // Проверка доступа к тесту
  canTakeTest = (courseId, totalLessons) => {
    const progress = this.userProgress[courseId];
    if (!progress) return false;

    return progress.completedLessons.length >= totalLessons;
  };

  // Получение прогресса по курсу
  getCourseProgress = (courseId, totalLessons) => {
    const progress = this.userProgress[courseId];
    if (!progress) return 0;

    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  };

  // Поиск пользователей
  searchUsers = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const trainingStats = this.getTrainingStats();
    return trainingStats.filter(
      (user) =>
        user.login?.toLowerCase().includes(term) ||
        user.tabNumber?.toLowerCase().includes(term) ||
        user.description?.toLowerCase().includes(term)
    );
  };

  // Фильтрация пользователей по ролям
  filterUsersByRole = (roleName) => {
    const trainingStats = this.getTrainingStats();
    return trainingStats.filter((user) =>
      user.roles?.some((role) => role === roleName)
    );
  };

  // Получение пользователей с ролью ST
  getSTUsers = () => {
    return this.getTrainingStats();
  };

  // Обновление аутентификации
  setAuthData = action((isAuthenticated, tabNumber, userName, roles) => {
    console.log('Setting auth data:', {
      isAuthenticated,
      tabNumber,
      userName,
      roles,
    });

    this.isAuthenticated = isAuthenticated;
    this.tabNumber = tabNumber;
    this.userName = userName;
    this.userRolesAuth = roles || [];

    // Сохраняем в localStorage
    try {
      localStorage.setItem(
        'securityTrainingAuth',
        JSON.stringify({
          isAuthenticated,
          tabNumber,
          userName,
          userRoles: roles,
        })
      );
      console.log('Auth data saved to localStorage');
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  });

  get isUserAuthenticated() {
    return this.isAuthenticated;
  }

  get currentUserTabNumber() {
    return this.tabNumber || '';
  }

  get currentUserName() {
    return this.userName || '';
  }

  // Получение общего количества пользователей
  get totalUsers() {
    return this.combinedUsers.length;
  }

  // Получение активных пользователей
  get activeUsers() {
    const weekAgo = moment().subtract(7, 'days');
    return this.combinedUsers.filter((user) => {
      try {
        const lastActivity = user.stData?.last_course_completed;
        return lastActivity && moment(lastActivity).isAfter(weekAgo);
      } catch (e) {
        return false;
      }
    }).length;
  }

  logout = action(() => {
    console.log('Logging out from SecurityTrainingStore');

    this.isAuthenticated = false;
    this.tabNumber = '';
    this.userName = '';
    this.userRolesAuth = [];

    // Удаляем из localStorage
    try {
      localStorage.removeItem('securityTrainingAuth');
      localStorage.removeItem('securityTrainingProgress');
      console.log('Auth data removed from localStorage');
    } catch (error) {
      console.error('Error removing auth data:', error);
    }

    message.success('Вы вышли из системы');
  });

  // Получение среднего балла
  get averageScore() {
    const trainingStats = this.getTrainingStats();
    if (trainingStats.length === 0) return 0;

    const total = trainingStats.reduce(
      (sum, user) => sum + (user.average_score || 0),
      0
    );
    return parseFloat((total / trainingStats.length).toFixed(2));
  }

  // Получение общего количества пройденных курсов
  get totalCompletedCourses() {
    const trainingStats = this.getTrainingStats();
    return trainingStats.reduce(
      (sum, user) => sum + (user.completed_courses || 0),
      0
    );
  }
}

// Создаем и экспортируем единственный экземпляр store
const securityTrainingStore = new SecurityTrainingStore();
export default securityTrainingStore;
