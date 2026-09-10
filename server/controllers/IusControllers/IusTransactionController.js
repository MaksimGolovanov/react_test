const {
  IusTransaction,
  IusSpravRoles,
  IusTransactionRole,
} = require("../../models/IusPtModels");
const ApiError = require("../../error/ApiError");

class IusTransactionController {
  // Получить все транзакции (с ролями, если нужно)
  async getAll(req, res, next) {
    try {
      const {
        limit = 50,
        offset = 0,
        system,
        roleCode,
        transactionCode,
        description,
      } = req.query;

      const where = {};
      if (system) where.system = { [Op.like]: `%${system}%` };
      if (roleCode) where.roleCode = { [Op.like]: `%${roleCode}%` };
      if (transactionCode)
        where.transactionCode = { [Op.like]: `%${transactionCode}%` };
      if (description) where.description = { [Op.like]: `%${description}%` };

      const transactions = await IusTransaction.findAndCountAll({
        where,
        include: [
          {
            model: IusSpravRoles,
            through: { attributes: [] },
            attributes: ["id", "code", "name"],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["id", "ASC"]],
      });

      return res.json({
        count: transactions.count,
        rows: transactions.rows,
      });
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Создать одну транзакцию
  async create(req, res, next) {
    try {
      const { system, roleCode, transactionCode, description } = req.body;
      if (!system || !roleCode || !transactionCode) {
        return next(
          ApiError.badRequest(
            "Не указаны обязательные поля: system, roleCode, transactionCode",
          ),
        );
      }
      const transaction = await IusTransaction.create({
        system,
        roleCode,
        transactionCode,
        description,
      });
      // Если нужно сразу привязать к роли – можно обработать позже
      return res.status(201).json(transaction);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Массовое создание транзакций
  async createbulk(req, res, next) {
    try {
      const transactions = req.body;
      if (!Array.isArray(transactions)) {
        return next(ApiError.badRequest("Ожидается массив транзакций"));
      }
      for (const t of transactions) {
        if (!t.system || !t.roleCode || !t.transactionCode) {
          return next(
            ApiError.badRequest(
              "У каждой транзакции должны быть system, roleCode, transactionCode",
            ),
          );
        }
      }
      const created = await IusTransaction.bulkCreate(transactions, {
        returning: true,
      });
      return res.status(201).json(created);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Обновить транзакцию
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { system, roleCode, transactionCode, description } = req.body;
      const transaction = await IusTransaction.findByPk(id);
      if (!transaction) {
        return next(ApiError.notFound("Транзакция не найдена"));
      }
      await transaction.update({
        system,
        roleCode,
        transactionCode,
        description,
      });
      return res.json(transaction);
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Удалить транзакцию
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await IusTransaction.findByPk(id);
      if (!transaction) {
        return next(ApiError.notFound("Транзакция не найдена"));
      }
      await transaction.destroy();
      return res.json({ message: "Транзакция удалена" });
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Массовое удаление транзакций
  async deletebulk(req, res, next) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(ApiError.badRequest("Не передан массив id для удаления"));
      }
      const deleted = await IusTransaction.destroy({ where: { id: ids } });
      return res.json({ deletedCount: deleted });
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Связать транзакцию с ролью (добавить связь)
  async addRoleToTransaction(req, res, next) {
    try {
      const { transactionId, roleId } = req.body;
      if (!transactionId || !roleId) {
        return next(ApiError.badRequest("Не указаны transactionId и roleId"));
      }
      const [rel, created] = await IusTransactionRole.findOrCreate({
        where: { transactionId, roleId },
      });
      if (!created) {
        return res.status(200).json({ message: "Связь уже существует" });
      }
      return res.status(201).json({ message: "Связь добавлена" });
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }

  // Удалить связь транзакции с ролью
  async removeRoleFromTransaction(req, res, next) {
    try {
      const { transactionId, roleId } = req.body;
      if (!transactionId || !roleId) {
        return next(ApiError.badRequest("Не указаны transactionId и roleId"));
      }
      const deleted = await IusTransactionRole.destroy({
        where: { transactionId, roleId },
      });
      if (deleted) {
        return res.json({ message: "Связь удалена" });
      }
      return next(ApiError.notFound("Связь не найдена"));
    } catch (err) {
      next(ApiError.internal(err.message));
    }
  }
}

module.exports = new IusTransactionController();
