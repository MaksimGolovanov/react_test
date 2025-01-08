const Router = require('express');
const router = new Router();
const carController=require('../controllers/CarController')




router.get('/', carController.getAllCars);
router.post('/create', carController.createCar);


module.exports = router;