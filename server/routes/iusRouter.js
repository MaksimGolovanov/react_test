const Router = require('express')
const router = new Router()

const IusSpravAdmController = require('../controllers/IusControllers/IusSpravAdmController')
const IusSpravRolesController = require('../controllers/IusControllers/IusSpravRolesController')
const IusUserController = require('../controllers/IusControllers/IusUserController')
const IusUserRolesController = require('../controllers/IusControllers/IusUserRolesController')
const StaffController = require('../controllers/IusControllers/StaffController')
const IusStopRolesController = require('../controllers/IusControllers/IusStopRolesConroller')
const IusTransactionController = require('../controllers/IusControllers/IusTransactionController');

// Маршруты для администраторов
router.get('/adm', IusSpravAdmController.getAll)
router.post('/adm', IusSpravAdmController.create)
router.put('/adm', IusSpravAdmController.update)
router.delete('/adm/:id', IusSpravAdmController.delete)

// Маршруты для ролей
router.get('/roles', IusSpravRolesController.getAll)
router.post('/roles', IusSpravRolesController.create)
router.put('/roles', IusSpravRolesController.update)
router.delete('/roles/:id', IusSpravRolesController.delete)
router.post('/roles/bulk', IusSpravRolesController.createbulk)

// Маршруты для стоп ролей
router.get('/stoproles', IusStopRolesController.getAll)
router.post('/stoproles', IusStopRolesController.create)
router.post('/stoproles/bulk', IusStopRolesController.createbulk)   // сначала bulk
router.delete('/stoproles/bulk', IusStopRolesController.deletebulk) // сначала bulk
router.put('/stoproles/:id', IusStopRolesController.update)         // потом :id
router.delete('/stoproles/:id', IusStopRolesController.delete)      // потом :id

// Маршруты для пользователей
router.get('/users', IusUserController.getAll)
router.post('/users', IusUserController.createOrUpdate)
router.delete('/users/:id', IusUserController.delete)

// Маршруты для связей пользователей и ролей
router.get('/user-roles', IusUserRolesController.getAll)
router.get('/user-roles/:tabNumber', IusUserRolesController.getAllTabNum)
router.post('/user-roles', IusUserRolesController.create)
router.delete('/user-roles/:tabNumber/:roleId', IusUserRolesController.delete)
router.post('/user-roles/bulk', IusUserRolesController.addRolesToUser)

// Маршрут для получения данных из Staff и IusUser
router.get('/staff-with-iususer', StaffController.getStaffWithIusUser)
router.get('/staff-with-user', StaffController.getStaffWithUserIUS)

router.get('/staff-with-iususer-simple', StaffController.getStaffWithIusUserSimple)
router.get('/staff-with-iususer-simple-over', StaffController.getStaffWithIusUserSimpleOver)
router.get('/staff-with-iususer-tabnumber/:tabNumber', StaffController.getStaffByTabNumber)

router.get('/staff-by-role/:roleId', StaffController.getStaffByRole);

// Маршруты для транзакций
router.get('/transactions', IusTransactionController.getAll);
router.post('/transactions', IusTransactionController.create);
router.post('/transactions/bulk', IusTransactionController.createbulk);
router.put('/transactions/:id', IusTransactionController.update);
router.delete('/transactions/:id', IusTransactionController.delete);
router.delete('/transactions/bulk', IusTransactionController.deletebulk);

// Связи транзакций с ролями
router.post('/transaction-role', IusTransactionController.addRoleToTransaction);
router.delete('/transaction-role', IusTransactionController.removeRoleFromTransaction);




module.exports = router