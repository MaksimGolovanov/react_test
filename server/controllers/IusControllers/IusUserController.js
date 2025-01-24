const { IusUser } = require('../../models/IusPtModels');
const ApiError = require('../../error/ApiError');

class IusUserController {
    async getAll(req, res, next) {
        try {
            const iusUsers = await IusUser.findAll();
            return res.json(iusUsers);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createOrUpdate(req, res, next) {
        try {
            const { tabNumber, name, contractDetails, computerName, location } = req.body;
            if (!tabNumber) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }

            const [iususer, created] = await IusUser.findOrCreate({
                where: { tabNumber },
                defaults: { name, contractDetails, computerName, location },
            });

            if (!created) {
                Object.assign(iususer, { name, contractDetails, computerName, location });
                await iususer.save();
            }

            return res.status(201).json(iususer);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const iususer = await IusUser.findByPk(id);
            if (!iususer) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            await iususer.destroy();
            return res.json({ message: 'Пользователь успешно удален' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new IusUserController();