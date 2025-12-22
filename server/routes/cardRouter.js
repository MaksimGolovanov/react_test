const Router = require('express');
const router = new Router();
const usbController = require('../controllers/CardControllers');



router.get('/', usbController.getAll);
router.post('/', usbController.create);
router.put('/:id',usbController.update);
router.delete('/:id', usbController.delete);




module.exports = router;