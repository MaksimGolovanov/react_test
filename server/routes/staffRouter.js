const Router = require('express');
const router = new Router();
const staffController=require('../controllers/StaffControllers')




router.get('/',staffController.getAll)
router.get('/department',staffController.getAllDepartment)
router.put('/:tabNumber',staffController.updateStaff)
router.delete('/:tabNumber',staffController.deleteStaff)
router.post('/import', staffController.import);


module.exports = router;