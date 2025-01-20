const { IusSpravType, IusSpravAdm, IusSpravRoles, IusUser } = require('../models/IusPtModels')
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

    //Type
    async getAllType(req, res, next) {
        try {
            const userAdm = await IusSpravType.findAll()
            return res.json(userAdm)
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createType(req, res, next) {
        try {
            const { type, name, description } = req.body;
           
            const iustype = await IusSpravType.create({ type, name, description });
            return res.status(201).json(iustype);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateType(req, res, next) {
        try {
            const { id, type,  name, description } = req.body;
            if (!id ) {
                return next(ApiError.badRequest('Не указаны обязательные поля'));
            }
            const iustype = await IusSpravType.findByPk(id);
            if (!iustype) {
                return next(ApiError.notFound('Администратор не найден'));
            }
            iustype.type = type;
            iustype.name = name;
            iustype.description = description;
            await iustype.save();
            return res.json(iustype);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
    //Roles
    async getAllRoles(req, res, next) {
        try {
            const iusRoles = await IusSpravRoles.findAll()
            return res.json(iusRoles)
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createRole(req, res, next) {
        try {
            const { typename, type,  name, code, mandat } = req.body;
           
            const iusrole = await IusSpravRoles.create({ typename, type,  name, code, mandat });
            return res.status(201).json(iusrole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateRole(req, res, next) {
        try {
            const { id, typename, type,  name, code, mandat } = req.body;
            if (!id ) {
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
            await iusrole.save();
            return res.json(iusrole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

     //Users
     async getAllUsers(req, res, next) {
        try {
            const iusUsers = await IusUser.findAll()
            return res.json(iusUsers)
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createOrUpdateUser(req, res, next) {
        try {
            const { tabNumber, name, contractDetails, computerName } = req.body;

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

} 

module.exports = new IusController();