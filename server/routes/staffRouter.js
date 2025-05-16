const Router = require('express');
const router = new Router();
const staffController = require('../controllers/StaffControllers');
const departmentController = require('../controllers/DepartmentController');

// Маршруты для работы с сотрудниками
router.get('/', staffController.getAll);
router.get('/department', staffController.getAllDepartment);
router.put('/:tabNumber', staffController.updateStaff);
router.delete('/:tabNumber', staffController.deleteStaff);
router.post('/import', staffController.import);
router.post('/', staffController.create);

// Маршруты для работы с отделами
router.get('/departments', departmentController.getAllDepartments)
router.get('/departments/:id', departmentController.getDepartmentById)
router.post('/departments', departmentController.createDepartment)
router.put('/departments/:id', departmentController.updateDepartment)
router.delete('/departments/:id', departmentController.deleteDepartment)

module.exports = router;