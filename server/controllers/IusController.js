const { IusUser, IusSpravAdm } = require('../models/IusPtModels')
const ApiError = require('../error/ApiError')

class IusController {

    async getAllUserAdm(req, res, next) {
        try {
            const userAdm = await IusSpravAdm.findAll()
            return res.json(userAdm)
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createUserAdm(req, res, next) {
        try {
            const { iusadm, description } = req.body;
            if (!iusadm) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }
            const adm = await IusSpravAdm.create({ iusadm, description });
            return res.status(201).json(adm);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateUserAdm(req, res, next) {
        try {
            const { id, iusadm, description } = req.body;
            if (!id || !iusadm) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }
            const adm = await IusSpravAdm.findByPk(id);
            if (!adm) {
                return next(ApiError.notFound('Администратор не найден'));
            }
            adm.iusadm = iusadm;
            adm.description = description;
            await adm.save();
            return res.json(adm);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new IusController();