const Router = require('express');
const router = new Router();
const printModelsController=require('../controllers/PrintModelController');
const PrintModelController = require('../controllers/PrintModelController');





router.post('/', PrintModelController.create);
router.get('/', PrintModelController.getAll);

router.get('/:id', PrintModelController.getOne);
router.delete('/:id', PrintModelController.delete);

module.exports = router;