const Router = require('express')
const router = new Router()
const departmentController = require('../controllers/DepartmentController')

router.get('/', departmentController.getAllDepartments)
router.get('/:id', departmentController.getDepartmentById)
router.post('/', departmentController.createDepartment)
router.put('/:id', departmentController.updateDepartment)
router.delete('/:id', departmentController.deleteDepartment)

module.exports = router