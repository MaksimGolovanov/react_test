// server/routes/userProgressRouter.js
const Router = require('express');
const router = new Router();
const UserProgressController = require('../controllers/ST/UserProgressController');


// Прогресс пользователя
router.get('/:userId/courses', UserProgressController.getUserCourses);
router.get('/:userId/courses/:courseId', UserProgressController.getUserProgress);
router.put('/:userId/courses/:courseId', UserProgressController.updateUserProgress);

// Завершение урока
router.post('/:userId/courses/:courseId/lessons/:lessonId/complete', UserProgressController.completeLesson);

// Тестирование
router.post('/:userId/courses/:courseId/tests/submit', UserProgressController.submitTestResult);
router.get('/:userId/courses/:courseId/tests/results', UserProgressController.getUserTestResults);

module.exports = router;