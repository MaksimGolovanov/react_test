const { Car, Driver, Status, Customer, Order } = require('../models/carModels')
const ApiError = require('../error/ApiError')

class CarController {
    async createCar(req, res, next) {

    }
    async getAllCars(req, res, next) {
        const car = await Car.findAll()
        return res.json(car)
    }

}

module.exports = new CarController();