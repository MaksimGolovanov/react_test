const Router = require('express');
const router=new Router();
const userRouter = require('./userRouter');
const staffRouter = require('./staffRouter');
const printRouter = require('./printRouter')
const printModelRouter = require('./printModelsRouter')
const postRouter = require('./notesRouter')
const carRouter = require('./carRouter')
const iusRouter = require('./iusRouter')


router.use('/user', userRouter)
router.use('/staff', staffRouter)
router.use('/print', printRouter)
router.use('/printmodels',printModelRouter)
router.use('/notes', postRouter)
router.use('/car',carRouter)
router.use('/iuspt', iusRouter)



module.exports = router;  