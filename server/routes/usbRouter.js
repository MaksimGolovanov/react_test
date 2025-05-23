const Router = require('express');
const router = new Router();
const usbController = require('../controllers/UsbControllers');



router.get('/', usbController.getAll);
router.post('/', usbController.create);
router.put('/:id',usbController.update);
router.delete('/:id', usbController.delete);
router.post('/send-reminders', usbController.sendReminders)



module.exports = router;