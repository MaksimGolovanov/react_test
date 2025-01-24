const { IusUserRoles } = require('../../models/IusPtModels');
const ApiError = require('../../error/ApiError');

class IusUserRolesController {
    async getAll(req, res, next) {
        try {
            const userRoles = await IusUserRoles.findAll();
            return res.json(userRoles);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const { tabNumber, roleId } = req.body;
            if (!tabNumber || !roleId) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }

            const userRole = await IusUserRoles.create({ tabNumber, roleId });
            return res.status(201).json(userRole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userRole = await IusUserRoles.findByPk(id);
            if (!userRole) {
                return next(ApiError.notFound('Связь не найдена'));
            }
            await userRole.destroy();
            return res.json({ message: 'Связь успешно удалена' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new IusUserRolesController();