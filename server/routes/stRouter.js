const Router = require('express');
const router = new Router();
const STController = require('../controllers/ST/STControllers');


// Роуты для админки обучения
router.post('/create', STController.createUserFromSTAdmin);
router.put('/update/:id', STController.updateUserFromSTAdmin);
router.delete('/delete/:id', STController.deleteUserFromSTAdmin);
router.get('/', STController.getAllSTUsers);
router.get('/:id', STController.getSTUser);
router.put('/stats/:id', STController.updateTrainingStats);

module.exports = router;