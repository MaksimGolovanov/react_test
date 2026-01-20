const { DocCategory } = require('../../models/documentModels');
const ApiError = require('../../error/ApiError');

class DocCategoryController {
    // Получить все категории
    async getAll(req, res, next) {
        try {
            const categories = await DocCategory.findAll({
                order: [['name', 'ASC']]
            });
            return res.json(categories);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Получить категорию по ID
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await DocCategory.findByPk(id);

            if (!category) {
                return next(ApiError.notFound('Категория не найдена'));
            }

            return res.json(category);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Создать новую категорию
    async create(req, res, next) {
        try {
            const { name, code, description } = req.body;

            if (!name || !code) {
                return next(ApiError.badRequest('Заполните обязательные поля'));
            }

            // Проверяем уникальность кода
            const existingCategory = await DocCategory.findOne({ where: { code } });
            if (existingCategory) {
                return next(ApiError.badRequest('Категория с таким кодом уже существует'));
            }

            const category = await DocCategory.create({
                name,
                code,
                description
            });

            return res.status(201).json(category);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Обновить категорию
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, code, description } = req.body;

            const category = await DocCategory.findByPk(id);
            if (!category) {
                return next(ApiError.notFound('Категория не найдена'));
            }

            await category.update({ name, code, description });
            return res.json(category);
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }

    // Удалить категорию
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const category = await DocCategory.findByPk(id);
            if (!category) {
                return next(ApiError.notFound('Категория не найдена'));
            }

            await category.destroy();
            return res.json({ success: true, message: 'Категория удалена' });
        } catch (error) {
            return next(ApiError.internal(error.message));
        }
    }
}

module.exports = new DocCategoryController();