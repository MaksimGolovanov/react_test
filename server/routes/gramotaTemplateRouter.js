const Router = require('express');
const gramotaTemplateController = require('../controllers/GramotaTemplateController');
const router = new Router();

router.get('/', gramotaTemplateController.getAll);
router.get('/:id', gramotaTemplateController.getOne);
router.post('/', gramotaTemplateController.create);
router.put('/:id', gramotaTemplateController.update);
router.delete('/:id', gramotaTemplateController.delete);
router.patch('/:id/activate', gramotaTemplateController.setActive);

module.exports = router;