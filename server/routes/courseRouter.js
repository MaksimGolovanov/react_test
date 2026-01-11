// server/routes/courseRouter.js
const Router = require('express');
const router = new Router();
const CourseController = require('../controllers/ST/CourseController');
const UserProgressController = require('../controllers/ST/UserProgressController');

// Основные маршруты курсов
router.get('/', CourseController.getAllCourses);
router.get('/counts-by-category', CourseController.getCourseCountsByCategory);

router.get('/:id', CourseController.getCourseById);
router.get('/:id/stats', CourseController.getCourseStats);

// Админские маршруты (требуют авторизации и прав)
router.post('/', CourseController.createCourse);
router.put('/:id', CourseController.updateCourse);
router.delete('/:id', CourseController.deleteCourse);

// Управление уроками
router.get('/:id/lessons', CourseController.getCourseLessons);
router.post('/:id/lessons', CourseController.createLesson);
router.put('/:id/lessons/:lessonId', CourseController.updateLesson);
router.delete('/:id/lessons/:lessonId', CourseController.deleteLesson);

// Управление вопросами теста
router.get('/:id/questions', CourseController.getCourseQuestions);
router.post('/:id/questions', CourseController.createQuestion);
router.put('/:id/questions/:questionId', CourseController.updateQuestion);
router.delete('/:id/questions/:questionId', CourseController.deleteQuestion);

// Маршруты прогресса пользователя - ДОБАВЬТЕ ЭТИ СТРОКИ
router.get('/user-progress/:userId/courses/:courseId', UserProgressController.getUserProgress);
router.put('/user-progress/:userId/courses/:courseId', UserProgressController.updateUserProgress);
router.post('/:courseId/complete-lesson/:userId', UserProgressController.completeLesson);
router.post('/:courseId/submit-test/:userId', UserProgressController.submitTestResult);
router.get('/user-test-results/:userId/courses/:courseId', UserProgressController.getUserTestResults);
router.get('/user-courses/:userId', UserProgressController.getUserCourses);
router.get('/user-stats/:userId', UserProgressController.getUserStats);

module.exports = router;