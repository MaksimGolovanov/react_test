const Router = require('express');
const router = new Router();
const iusController=require('../controllers/IusController')

router.get('/', iusController.getAllUserAdm);
router.post('/create/adm', iusController.createUserAdm);
router.put('/update/adm', iusController.updateUserAdm); // Обновить администратора
router.get('/roles', iusController.getAllRoles);
router.post('/role/create', iusController.createRole);
router.put('/role/update', iusController.updateRole); 
router.get('/user', iusController.getAllUsers);
router.get('/user/usersroles', iusController.getAllUserRoles);
router.post('/user/create-or-update', iusController.createOrUpdateUser);
router.get('/userall',iusController.getStaffWithIusUser)


module.exports = router;