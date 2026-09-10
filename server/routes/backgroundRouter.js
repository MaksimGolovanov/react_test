const Router = require('express');
const backgroundController = require('../controllers/BackgroundController');
const router = new Router();

router.get('/', backgroundController.getAll);
router.get('/:id', backgroundController.getOne);
router.post('/upload', backgroundController.upload);
router.put('/:id', backgroundController.update);
router.delete('/:id', backgroundController.delete);

module.exports = router;