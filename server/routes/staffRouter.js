const Router = require('express');
const router = new Router();
const staffController = require('../controllers/StaffControllers');

const dolgnostController = require('../controllers/DolgnostController');

// Маршруты для работы с сотрудниками
router.get('/', staffController.getAll);
router.get('/department', staffController.getAllDepartment);
router.put('/:tabNumber', staffController.updateStaff);
router.delete('/:tabNumber', staffController.deleteStaff);
router.post('/import', staffController.import);
router.post('/', staffController.create);

router.post('/upload-photo',  staffController.uploadPhoto);

// Маршруты для работы с должностями
router.get('/dolgnost', dolgnostController.getAllDolgnost)
router.get('/dolgnost/:id', dolgnostController.getDolgnostById)
router.post('/dolgnost', dolgnostController.createDolgnost)
router.put('/dolgnost/:id', dolgnostController.updateDolgnost)
router.delete('/dolgnost/:id', dolgnostController.deleteDolgnost)

module.exports = router;