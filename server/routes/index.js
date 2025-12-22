const Router = require('express');
const router=new Router();
const userRouter = require('./userRouter');
const staffRouter = require('./staffRouter');
const printRouter = require('./printRouter')
const printModelRouter = require('./printModelsRouter')
const postRouter = require('./notesRouter')
const ipRouter = require('./ipaddressRouter')
const usbRouter = require('./usbRouter')
const cardRouter = require('./cardRouter')
const departmentRouter = require('./departmentRouter') 
const iusRouter = require('./iusRouter')


router.use('/user', userRouter)
router.use('/staff', staffRouter)
router.use('/print', printRouter)
router.use('/printmodels',printModelRouter)
router.use('/notes', postRouter)
router.use('/ipaddress', ipRouter)
router.use('/usb', usbRouter)
router.use('/card', cardRouter)
router.use('/iuspt', iusRouter)
router.use('/departments', departmentRouter) // Добавьте эту строку



module.exports = router;  