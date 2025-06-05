const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserControllers');
const authMiddleware = require('../middleware/authMiddleware');
const loginLimiter = require('../middleware/rateLimit');

// Аутентификация
router.post('/login', loginLimiter, userController.login);
router.post('/refresh-token', userController.refresh);
router.post('/logout', authMiddleware(), userController.logout);

// Регистрация и управление пользователями
router.post('/registration', userController.registration);
router.get('/user', authMiddleware(), userController.getAll);
router.put('/:id', authMiddleware(['ADMIN']), userController.updateUser);
router.delete('/:id', authMiddleware(['ADMIN']), userController.deleteUser);

// Управление ролями
router.post('/role', authMiddleware(['ADMIN']), userController.roleAdd);
router.get('/role', authMiddleware(), userController.getRole);
router.delete('/:userId/roles/:roleId', authMiddleware(['ADMIN']), userController.removeRoleFromUser);

module.exports = router;