const Router = require('express');
const router = new Router();
const docController = require('../controllers/DocControllers/DocController');
const docTrainingTypeController = require('../controllers/DocControllers/DocTrainingTypeController');
const docCategoryController = require('../controllers/DocControllers/DocCategoryController');
const docStatusController = require('../controllers/DocControllers/DocStatusController');

// Важно: сначала определяйте статические маршруты, потом динамические

// Маршруты для категорий документов (ПЕРВЫЕ!)
router.get('/categories', docCategoryController.getAll);
router.get('/categories/:id', docCategoryController.getById);
router.post('/categories', docCategoryController.create);
router.put('/categories/:id', docCategoryController.update);
router.delete('/categories/:id', docCategoryController.delete);

// Маршруты для статусов документов
router.get('/statuses', docStatusController.getAll);
router.get('/statuses/:id', docStatusController.getById);
router.post('/statuses', docStatusController.create);
router.put('/statuses/:id', docStatusController.update);
router.delete('/statuses/:id', docStatusController.delete);

// Маршруты для типов обучения
router.get('/training-types', docTrainingTypeController.getAll);
router.get('/training-types/:id', docTrainingTypeController.getById);
router.post('/training-types', docTrainingTypeController.create);
router.put('/training-types/:id', docTrainingTypeController.update);
router.delete('/training-types/:id', docTrainingTypeController.delete);

// Маршруты для работы с документами (ПОСЛЕДНИЕ!)
router.get('/', docController.getAll);
router.get('/:id', docController.getById);
router.post('/', docController.create);
router.put('/:id', docController.update);
router.delete('/:id', docController.delete);
router.post('/upload', docController.uploadFile);
router.post('/import', docController.import);

module.exports = router;