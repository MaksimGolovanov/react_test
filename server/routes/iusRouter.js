const Router = require('express');
const router = new Router();

const IusSpravAdmController = require('../controllers/IusControllers/IusSpravAdmController');
const IusSpravRolesController = require('../controllers/IusControllers/IusSpravRolesController');
const IusUserController = require('../controllers/IusControllers/IusUserController');
const IusUserRolesController = require('../controllers/IusControllers/IusUserRolesController');
const StaffController = require('../controllers/IusControllers/StaffController');

// Маршруты для администраторов
router.get('/adm', IusSpravAdmController.getAll);
router.post('/adm', IusSpravAdmController.create);
router.put('/adm', IusSpravAdmController.update);
router.delete('/adm/:id', IusSpravAdmController.delete);

// Маршруты для ролей
router.get('/roles', IusSpravRolesController.getAll);
router.post('/roles', IusSpravRolesController.create);
router.put('/roles', IusSpravRolesController.update);
router.delete('/roles/:id', IusSpravRolesController.delete);

// Маршруты для пользователей
router.get('/users', IusUserController.getAll);
router.post('/users', IusUserController.createOrUpdate);
router.delete('/users/:id', IusUserController.delete);

// Маршруты для связей пользователей и ролей
router.get('/user-roles', IusUserRolesController.getAll);
router.get('/user-roles/:tabNumber', IusUserRolesController.getAllTabNum);
router.post('/user-roles', IusUserRolesController.create);
router.delete('/user-roles/:tabNumber/:roleId', IusUserRolesController.delete);
router.post('/user-roles/bulk', IusUserRolesController.addRolesToUser);

// Маршрут для получения данных из Staff и IusUser
router.get('/staff-with-iususer', StaffController.getStaffWithIusUser);




module.exports = router;