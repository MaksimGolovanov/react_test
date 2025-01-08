const Router = require('express');
const router = new Router();
const userController=require('../controllers/UserControllers')



router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.post('/role',userController.roleAdd)
router.get('/role',userController.getRole)
router.get('/userrouter',userController.getUsersWithRoles)
router.get('/auth')
router.get('/user',userController.getAll)
router.put('/:id',userController.updateUser)
router.delete('/:id',userController.deleteUser)
router.delete('/:userId/roles/:roleId', userController.removeRoleFromUser); 

module.exports = router;