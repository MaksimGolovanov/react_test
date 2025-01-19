const Router = require('express');
const router = new Router();
const iusController=require('../controllers/IusController')

router.get('/', iusController.getAllUserAdm);
router.post('/create/adm', iusController.createUserAdm);
router.put('/update/adm', iusController.updateUserAdm); // Обновить администратора
router.get('/type', iusController.getAllType);
router.post('/type/create', iusController.createType);
router.put('/type/update', iusController.updateType); 
router.get('/roles', iusController.getAllRoles);
router.post('/role/create', iusController.createRole);
router.put('/role/update', iusController.updateRole); 


module.exports = router;