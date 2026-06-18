const Router = require('express');
const router = new Router();
const positionAccessController = require('../controllers/PositionAccessController');

router.get('/', positionAccessController.getAll);
router.get('/by-staff', positionAccessController.getByDepartmentAndPosition); // важно разместить до /:id
router.get('/:id', positionAccessController.getOne);
router.post('/', positionAccessController.create);
router.put('/:id', positionAccessController.update);
router.delete('/:id', positionAccessController.delete);

module.exports = router;