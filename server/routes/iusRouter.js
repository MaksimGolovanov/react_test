const Router = require('express');
const router = new Router();
const iusController=require('../controllers/IusController')

router.get('/', iusController.getAllUserAdm);
router.post('/create/adm', iusController.createUserAdm);
router.put('/update/adm', iusController.updateUserAdm); // Обновить администратора


module.exports = router;