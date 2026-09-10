const {
  IusUser,
  IusSpravRoles,
  IusUserRoles,
} = require("../../models/IusPtModels");
const { Staff } = require("../../models/models");
const ApiError = require("../../error/ApiError");

class StaffController {
  async getStaffWithUserIUS(req, res, next) {
    try {
      const staffWithIusUser = await Staff.findAll({
        include: [
          {
            model: IusUser,
            required: false,
          },
        ],
      });
      return res.json(staffWithIusUser);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  async getStaffByRole(req, res, next) {
    try {
      const { roleId } = req.params;
      // Проверяем, существует ли роль
      const role = await IusSpravRoles.findByPk(roleId);
      if (!role) {
        return next(ApiError.notFound("Роль не найдена"));
      }

      const staff = await Staff.findAll({
        attributes: ["tabNumber", "fio", "email", "department", "post"],
        include: [
          {
            model: IusUser,
            required: true, // только те, у кого есть IusUser
            attributes: ["tabNumber", "name"],
            include: [
              {
                model: IusSpravRoles,
                through: {
                  model: IusUserRoles,
                  attributes: [],
                },
                where: { id: roleId },
                required: true,
              },
            ],
          },
        ],
        order: [["fio", "ASC"]],
      });

      return res.json(staff);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

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
                  attributes: ["id", "tabNumber", "roleId", "createdAt"], // Указываем поля, которые хотим получить
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

  async getStaffWithIusUserSimple(req, res, next) {
    try {
      const staffWithIusUser = await Staff.findAll({
        include: [
          {
            model: IusUser,
            required: false,
            // Убрано включение информации о ролях
            attributes: ["tabNumber", "name"], // Можно указать конкретные поля IusUser
          },
        ],
      });

      return res.json(staffWithIusUser);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  
  async getStaffWithIusUserSimpleOver(req, res, next) {
    try {
      const staffWithIusUser = await Staff.findAll({
        attributes: ["tabNumber", "fio"],
        include: [
          {
            model: IusUser,
            required: false,
            // Убрано включение информации о ролях
            attributes: ["tabNumber", "name"], // Можно указать конкретные поля IusUser
          },
        ],
      });

      return res.json(staffWithIusUser);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  async getStaffByTabNumber(req, res, next) {
    try {
      const { tabNumber } = req.params; // Получаем табельный номер из параметров URL

      const staffWithIusUser = await Staff.findOne({
        where: { tabNumber }, // Фильтруем по табельному номеру
        include: [
          {
            model: IusUser,
            required: false,
            include: [
              {
                model: IusSpravRoles,
                through: {
                  model: IusUserRoles,
                  attributes: ["id", "tabNumber", "roleId", "createdAt"],
                },
                required: false,
              },
            ],
          },
        ],
      });

      if (!staffWithIusUser) {
        return next(
          ApiError.notFound(
            `Сотрудник с табельным номером ${tabNumber} не найден`,
          ),
        );
      }

      return res.json(staffWithIusUser);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }
}
module.exports = new StaffController();
