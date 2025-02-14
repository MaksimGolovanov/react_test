const { IusUserRoles, IusSpravRoles, IusUser } = require('../../models/IusPtModels');
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
    async getAllTabNum(req, res, next) {
        const { tabNumber } = req.params; // Используем req.params вместо req.query

        try {
            const roles = await IusUserRoles.findAll({
                where: { tabNumber },
                include: [{
                    model: IusSpravRoles, // Включаем информацию о роли
                    required: false,
                }],
            });
    
            res.json(roles);
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
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
            const { tabNumber, roleId } = req.params;
    
            // Ищем связь по составному ключу (tabNumber и roleId)
            const userRole = await IusUserRoles.findOne({
                where: { tabNumber, roleId }
            });
    
            if (!userRole) {
                return next(ApiError.notFound('Связь не найдена'));
            }
    
            // Удаляем связь
            await userRole.destroy();
    
            return res.json({ message: 'Связь успешно удалена' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async addRolesToUser(req, res, next) {
        try {
            const { tabNumber, roleIds } = req.body;
            console.log(tabNumber)
            if (!tabNumber || !roleIds || !Array.isArray(roleIds)) {
                return next(ApiError.badRequest('Необходимо указать табельный номер и массив ID ролей'));
            }
    
            // Проверяем существование пользователя
            const user = await IusUser.findOne({ where: { tabNumber } });
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            // Получаем существующие роли пользователя
            const existingUserRoles = await IusUserRoles.findAll({
                where: { tabNumber }
            });
            const existingRoleIds = existingUserRoles.map(role => role.roleId);
    
            // Фильтруем только новые роли, которых еще нет у пользователя
            const newRoleIds = roleIds.filter(roleId => !existingRoleIds.includes(roleId));
    
            if (newRoleIds.length === 0) {
                return res.status(200).json({
                    message: 'Все указанные роли уже назначены пользователю',
                    data: existingUserRoles
                });
            }
    
            // Проверяем существование новых ролей
            const roles = await IusSpravRoles.findAll({
                where: {
                    id: newRoleIds
                }
            });
    
            if (roles.length !== newRoleIds.length) {
                return next(ApiError.badRequest('Некоторые роли не существуют'));
            }
    
            // Создаем только новые записи
            const createPromises = newRoleIds.map(roleId => 
                IusUserRoles.create({ tabNumber, roleId })
            );
    
            // Ждем выполнения всех промисов
            const results = await Promise.all(createPromises);
    
            return res.status(201).json({
                message: 'Новые роли успешно добавлены',
                added: results,
                existing: existingUserRoles
            });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new IusUserRolesController();