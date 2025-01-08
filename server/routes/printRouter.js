const Router = require('express');
const router = new Router();
const printController=require('../controllers/PrintController')





router.get('/', printController.getAll);
router.get('/print/:id', printController.getOne);
router.put('/update',printController.update)
router.get('/statistics/:itemid',printController.getStatistics);
router.post('/', printController.create);
router.get('/department',printController.getAllDepartment)
router.get('/location',printController.getAllLocation)
router.post('/location', printController.createLocation);
router.delete('/location/:id', printController.delete);
router.delete('/:id', printController.deletePrint);

module.exports = router;