const Router = require('express');
const router = new Router();
const ipController = require('../controllers/ipControllers');



router.get('/', ipController.getAll);
router.post('/', ipController.create);
router.put('/:id',ipController.update);
router.delete('/:id', ipController.delete);




module.exports = router;