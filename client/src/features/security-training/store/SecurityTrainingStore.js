// src/features/security-training/store/SecurityTrainingStore.js
import { makeAutoObservable } from 'mobx';
import { message } from 'antd';

class SecurityTrainingStore {
  courses = [];
  userProgress = {};
  currentTest = null;
  testResults = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadProgress();
    this.loadCourses();
  }

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
  }

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
  }

  // Загрузка курсов
  loadCourses = () => {
    // В реальном приложении здесь будет API вызов
    this.isLoading = true;
    
    // Имитация загрузки
    setTimeout(() => {
      this.courses = this.getMockCourses();
      this.isLoading = false;
    }, 500);
  }

  // Моковые данные курсов
  getMockCourses = () => {
    return [
      {
        id: 'basic-security',
        title: 'Основы информационной безопасности',
        description: 'Изучите базовые принципы защиты информации и кибербезопасности',
        duration: '2 часа',
        level: 'Начальный',
        icon: 'SafetyOutlined',
        active: true,
        lessons: [
          {
            id: 'lesson-1',
            title: 'Введение в ИБ',
            content: '# Что такое информационная безопасность?\n\nИнформационная безопасность (ИБ) - это практика защиты информации от несанкционированного доступа.',
            duration: '15 минут',
            videoUrl: null
          }
        ],
        test: {
          id: 'test-basic',
          title: 'Тест по основам ИБ',
          passingScore: 70,
          questions: [
            {
              id: 'q1',
              question: 'Что означает принцип "конфиденциальность" в информационной безопасности?',
              type: 'single',
              options: [
                { id: 'a', text: 'Доступность информации в любое время' },
                { id: 'b', text: 'Защита от несанкционированного доступа к информации', correct: true },
                { id: 'c', text: 'Сохранение точности и полноты информации' },
                { id: 'd', text: 'Быстрое восстановление после сбоев' }
              ]
            }
          ]
        }
      }
    ];
  }

  // Завершение урока
  completeLesson = (courseId, lessonId) => {
    if (!this.userProgress[courseId]) {
      this.userProgress[courseId] = {
        completedLessons: [],
        testScore: 0,
        completed: false,
        completionDate: null
      };
    }

    if (!this.userProgress[courseId].completedLessons.includes(lessonId)) {
      this.userProgress[courseId].completedLessons.push(lessonId);
      this.saveProgress();
      message.success('Урок завершен!');
    }
  }

  // Отправка результатов теста
  submitTest = (courseId, answers, score) => {
    if (!this.userProgress[courseId]) {
      this.userProgress[courseId] = {
        completedLessons: [],
        testScore: 0,
        completed: false,
        completionDate: null
      };
    }

    this.userProgress[courseId].testScore = score;
    this.userProgress[courseId].completed = true;
    this.userProgress[courseId].completionDate = new Date().toISOString();

    this.testResults.push({
      courseId,
      score,
      date: new Date().toISOString(),
      answers
    });

    this.saveProgress();
    message.success(`Тест завершен! Ваш результат: ${score}%`);
  }

  // Проверка доступа к тесту
  canTakeTest = (courseId, totalLessons) => {
    const progress = this.userProgress[courseId];
    if (!progress) return false;
    
    return progress.completedLessons.length >= totalLessons;
  }

  // Получение прогресса по курсу
  getCourseProgress = (courseId, totalLessons) => {
    const progress = this.userProgress[courseId];
    if (!progress) return 0;
    
    return Math.round((progress.completedLessons.length / totalLessons) * 100);
  }

  // Добавление нового курса
  addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.courses.push(newCourse);
    message.success('Курс успешно создан');
    return newCourse;
  }

  // Обновление курса
  updateCourse = (courseId, courseData) => {
    const index = this.courses.findIndex(c => c.id === courseId);
    
    if (index !== -1) {
      this.courses[index] = {
        ...this.courses[index],
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      
      message.success('Курс успешно обновлен');
      return this.courses[index];
    }
    
    message.error('Курс не найден');
    return null;
  }

  // Удаление курса
  deleteCourse = (courseId) => {
    const index = this.courses.findIndex(c => c.id === courseId);
    
    if (index !== -1) {
      this.courses.splice(index, 1);
      
      // Также удаляем прогресс по этому курсу
      delete this.userProgress[courseId];
      this.saveProgress();
      
      message.success('Курс успешно удален');
      return true;
    }
    
    message.error('Курс не найден');
    return false;
  }
}

// Создаем и экспортируем единственный экземпляр store
const securityTrainingStore = new SecurityTrainingStore();
export default securityTrainingStore;