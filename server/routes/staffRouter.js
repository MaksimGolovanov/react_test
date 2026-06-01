const Router = require('express');
const router = new Router();
const staffController = require('../controllers/StaffControllers');
const dolgnostController = require('../controllers/DolgnostController');

// ========== МАРШРУТЫ ДЛЯ ДОЛЖНОСТЕЙ (конкретные пути) ==========
router.get('/dolgnost', dolgnostController.getAllDolgnost);
router.get('/dolgnost/:id', dolgnostController.getDolgnostById);
router.post('/dolgnost', dolgnostController.createDolgnost);
router.put('/dolgnost/:id', dolgnostController.updateDolgnost);
router.delete('/dolgnost/:id', dolgnostController.deleteDolgnost);

// ========== МАРШРУТЫ ДЛЯ СОТРУДНИКОВ ==========
router.get('/', staffController.getAll);
router.get('/department', staffController.getAllDepartment);
router.post('/import', staffController.import);
router.post('/upload-photo', staffController.uploadPhoto);
router.post('/', staffController.create);
router.get('/:tabNumber', staffController.getOne);     // общий параметр – в конце
router.put('/:tabNumber', staffController.updateStaff);
router.delete('/:tabNumber', staffController.deleteStaff);

module.exports = router;