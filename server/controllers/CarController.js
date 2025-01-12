const { Car, Driver, Status, Customer, Order } = require('../models/carModels')
const ApiError = require('../error/ApiError')

class CarController {
    async createCar(req, res, next) {
        try {
            const { model, number } = req.body;

            if (!model || !number) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }

            const car = await Car.create({ model, number });

            return res.status(201).json(car); // Устанавливаем статус 201 для успешного создания
        } catch (err) {
            next(err);
        }
    }
    async getAllCars(req, res, next) {
        const car = await Car.findAll()
        return res.json(car)
    }

}

module.exports = new CarController();