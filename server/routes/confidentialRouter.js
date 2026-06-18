// routes/confidentialRouter.js
const Router = require('express');
const router = new Router();
const confidentialController = require('../controllers/confidentialController');

router.get('/', confidentialController.getAll);
router.get('/:id', confidentialController.getOne);
router.post('/', confidentialController.create);
router.put('/:id', confidentialController.update);
router.delete('/:id', confidentialController.delete);

module.exports = router;