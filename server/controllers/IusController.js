const { IusSpravAdm, IusSpravRoles, IusUser, IusUserRole, } = require('../models/IusPtModels');
const ApiError = require('../error/ApiError');
const { Staff } = require('../models/models');

class IusController {
    // Метод для получения всех администраторов
    async getAllUserAdm(req, res, next) {
        try {
            const userAdm = await IusSpravAdm.findAll();
            return res.json(userAdm);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    // Метод для создания администратора
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

    // Метод для обновления администратора
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

    // Метод для получения всех ролей
    async getAllRoles(req, res, next) {
        try {
            const iusRoles = await IusSpravRoles.findAll();
            return res.json(iusRoles);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    // Метод для создания роли
    async createRole(req, res, next) {
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

    // Метод для обновления роли
    async updateRole(req, res, next) {
        try {
            const { id, typename, type, name, code, mandat, business_process } = req.body;
            if (!id) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }
            const iusrole = await IusSpravRoles.findByPk(id);
            if (!iusrole) {
                return next(ApiError.notFound('Роль не найдена'));
            }
            iusrole.typename = typename;
            iusrole.type = type;
            iusrole.name = name;
            iusrole.code = code;
            iusrole.mandat = mandat;
            iusrole.business_process = business_process;
            await iusrole.save();
            return res.json(iusrole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    // Метод для получения всех пользователей
    async getAllUsers(req, res, next) {
        try {
            const iusUsers = await IusUser.findAll();
            return res.json(iusUsers);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    // Метод для создания или обновления пользователя
    async createOrUpdateUser(req, res, next) {
        try {
            const { tabNumber, name, contractDetails, computerName } = req.body;
            if (!tabNumber) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }

            // Ищем запись с таким табельным номером или создаем новую
            const [iususer, created] = await IusUser.findOrCreate({
                where: { tabNumber }, // Условие поиска
                defaults: { // Данные для создания, если запись не найдена
                    name,
                    contractDetails,
                    computerName,
                },
            });

            // Если запись уже существует, обновляем её
            if (!created) {
                iususer.name = name;
                iususer.contractDetails = contractDetails;
                iususer.computerName = computerName;
                await iususer.save();
            }

            return res.status(201).json(iususer);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    // Метод для получения всех связей пользователей и ролей
    async getAllUserRoles(req, res, next) {
        try {
            const userRoles = await IusUserRole.findAll();
            return res.json(userRoles);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    // Новый метод: Получение данных из таблиц staff и iususer (связанных один к одному)
    async getStaffWithIusUser(req, res, next) {
        try {
            const staffWithIusUser = await Staff.findAll({
                include: [{
                    model: IusUser,
                    required: false, // Используйте `true`, если нужны только записи с совпадениями
                }],
            });

            return res.json(staffWithIusUser);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }


}

module.exports = new IusController();