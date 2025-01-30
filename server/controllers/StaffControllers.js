const { Staff, Department } = require('../models/models');
const ApiError = require('../error/ApiError');

class StaffController {
  async getAll(req, res) {
    const staff = await Staff.findAll();
    return res.json(staff);
  }

  async getAllDepartment(req, res) {
    const department = await Department.findAll();
    return res.json(department);
  }

  async deleteStaff(req, res) {
    const { id } = req.params; // Здесь предполагается использование tabNumber
    const staff = await Staff.findByPk(id); // Проверьте использование id

    if (!staff) {
      return res.status(404).json({ message: 'Запись не найдена.' });
    }

    try {
      await staff.destroy();
      return res.json({ message: 'Запись успешно удалена.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Произошла ошибка при удалении записи.' });
    }
  }

  async updateStaff(req, res) {
    try {
      const { tabNumber } = req.params; // Изменено на tabNumber
      const updatedFields = {};

      for (const key of ['fio', 'login', 'post', 'department', 'telephone', 'email', 'ip']) {
        if (req.body[key]) updatedFields[key] = req.body[key];
      }

      const result = await Staff.update(updatedFields, { where: { tabNumber } });

      if (result[0] === 0) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }

      res.send({ message: "Пользователь успешно обновлён" });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async import(req, res) { 
    try {
      const staffData = req.body;
      
      // Обновляем все записи del до 1
      await Staff.update(
        { del: 1 },
        { where: {} } 
      );

      // Создаем массив промисов для всех операций
      const importPromises = staffData.map(async (item) => {
        const existingStaff = await Staff.findOne({
          where: { tabNumber: item.tabNumber } // Используем правильное поле
        });

        if (existingStaff) {
          return Staff.update(
            { ...item, del: 0 },
            { where: { tabNumber: item.tabNumber } }
          );
        } else {
          return Staff.create({ ...item, del: 0 });
        }
      });

      await Promise.all(importPromises);

      return res.status(200).json({ message: 'Данные успешно импортированы' });
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StaffController();