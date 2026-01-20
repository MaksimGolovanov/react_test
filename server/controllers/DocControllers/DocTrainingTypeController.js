const { DocTrainingType } = require('../../models/documentModels');
const ApiError = require('../../error/ApiError');

class DocTrainingTypeController {
    // Получить все типы обучения
    async getAll(req, res, next) {
        try {
            const types = await DocTrainingType.findAll({
                order: [['name', 'ASC']]
            });
            return res.json(types);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Получить тип обучения по ID
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const type = await DocTrainingType.findByPk(id);

            if (!type) {
                return next(ApiError.notFound('Тип обучения не найден'));
            }

            return res.json(type);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Создать новый тип обучения
    async create(req, res, next) {
        try {
            const { name, code, description } = req.body;

            if (!name || !code) {
                return next(ApiError.badRequest('Заполните обязательные поля'));
            }

            // Проверяем уникальность кода
            const existingType = await DocTrainingType.findOne({ where: { code } });
            if (existingType) {
                return next(ApiError.badRequest('Тип обучения с таким кодом уже существует'));
            }

            const type = await DocTrainingType.create({
                name,
                code,
                description
            });

            return res.status(201).json(type);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Обновить тип обучения
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, code, description } = req.body;

            const type = await DocTrainingType.findByPk(id);
            if (!type) {
                return next(ApiError.notFound('Тип обучения не найден'));
            }

            await type.update({ name, code, description });
            return res.json(type);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Удалить тип обучения
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const type = await DocTrainingType.findByPk(id);
            if (!type) {
                return next(ApiError.notFound('Тип обучения не найден'));
            }

            await type.destroy();
            return res.json({ success: true, message: 'Тип обучения удален' });
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new DocTrainingTypeController();