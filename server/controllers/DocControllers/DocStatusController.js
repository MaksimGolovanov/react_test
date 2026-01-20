const { DocStatus } = require('../../models/documentModels');
const ApiError = require('../../error/ApiError');

class DocStatusController {
    // Получить все статусы
    async getAll(req, res, next) {
        try {
            const statuses = await DocStatus.findAll({
                order: [['name', 'ASC']]
            });
            return res.json(statuses);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Получить статус по ID
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const status = await DocStatus.findByPk(id);

            if (!status) {
                return next(ApiError.notFound('Статус не найден'));
            }

            return res.json(status);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Создать новый статус
    async create(req, res, next) {
        try {
            const { name, code, description } = req.body;

            if (!name || !code) {
                return next(ApiError.badRequest('Заполните обязательные поля'));
            }

            // Проверяем уникальность кода
            const existingStatus = await DocStatus.findOne({ where: { code } });
            if (existingStatus) {
                return next(ApiError.badRequest('Статус с таким кодом уже существует'));
            }

            const status = await DocStatus.create({
                name,
                code,
                description
            });

            return res.status(201).json(status);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Обновить статус
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, code, description } = req.body;

            const status = await DocStatus.findByPk(id);
            if (!status) {
                return next(ApiError.notFound('Статус не найден'));
            }

            await status.update({ name, code, description });
            return res.json(status);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Удалить статус
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const status = await DocStatus.findByPk(id);
            if (!status) {
                return next(ApiError.notFound('Статус не найден'));
            }

            await status.destroy();
            return res.json({ success: true, message: 'Статус удален' });
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new DocStatusController();