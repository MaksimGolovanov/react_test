const Router = require('express');
const router = new Router();
const consumableController = require('../controllers/consumableController');

router.get('/', consumableController.getAll);
router.get('/:id', consumableController.getOne);
router.post('/', consumableController.create);
router.put('/:id', consumableController.update);
router.delete('/:id', consumableController.delete);
router.post('/:id/movements', consumableController.addMovement);
router.post('/:id/move', consumableController.move);

module.exports = router;