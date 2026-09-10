const Router = require('express');
const signatoryController = require('../controllers/SignatoryController');
const router = new Router();

router.get('/', signatoryController.getAll);
router.get('/:id', signatoryController.getOne);
router.post('/', signatoryController.create);
router.put('/:id', signatoryController.update);
router.delete('/:id', signatoryController.delete);
router.patch('/:id/activate', signatoryController.setActive);

module.exports = router;