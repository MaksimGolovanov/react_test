// routes/naryadGasHazardWorkRouter.js

const Router = require('express');
const router = new Router();
const controller = require('../controllers/naryadGasHazardWorkController');

router.get('/', controller.getAll);
router.get('/service/:service', controller.getByService);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;