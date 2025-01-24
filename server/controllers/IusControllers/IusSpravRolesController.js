const { IusSpravRoles } = require('../../models/IusPtModels');
const ApiError = require('../../error/ApiError');

class IusSpravRolesController {
    async getAll(req, res, next) {
        try {
            const iusRoles = await IusSpravRoles.findAll();
            return res.json(iusRoles);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async create(req, res, next) {
        try {
            const { typename, type, name, code, mandat, business_process } = req.body;
            if (!typename || !type || !name || !code) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }

            const iusrole = await IusSpravRoles.create({ typename, type, name, code, mandat, business_process });
            return res.status(201).json(iusrole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id, typename, type, name, code, mandat, business_process } = req.body;
            if (!id) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }

            const iusrole = await IusSpravRoles.findByPk(id);
            if (!iusrole) {
                return next(ApiError.notFound('Роль не найдена'));
            }
            Object.assign(iusrole, { typename, type, name, code, mandat, business_process });
            await iusrole.save();

            return res.json(iusrole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const iusrole = await IusSpravRoles.findByPk(id);
            if (!iusrole) {
                return next(ApiError.notFound('Роль не найдена'));
            }
            await iusrole.destroy();
            return res.json({ message: 'Роль успешно удалена' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new IusSpravRolesController();