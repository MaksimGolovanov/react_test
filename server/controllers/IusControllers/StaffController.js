const { IusUser, IusSpravRoles, IusUserRoles } = require('../../models/IusPtModels');
const { Staff } = require('../../models/models');
const ApiError = require('../../error/ApiError');

class StaffController {
    async getStaffWithIusUser(req, res, next) {
        try {
            const staffWithIusUser = await Staff.findAll({
                include: [
                    {
                        model: IusUser,
                        required: false,
                        include: [
                            {
                                model: IusSpravRoles,
                                through: {
                                    model: IusUserRoles, // Указываем промежуточную таблицу
                                    attributes: ['id', 'tabNumber', 'roleId', 'createdAt'], // Указываем поля, которые хотим получить
                                },
                                required: false,
                            },
                        ],
                    },
                ],
            });

            return res.json(staffWithIusUser);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new StaffController();