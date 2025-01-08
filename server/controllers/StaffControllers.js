const { User, Role, Staff, Department } = require('../models/models')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')

class StaffController {


  async getAll(req, res) {
    const staff = await Staff.findAll()
    return res.json(staff)
  }
  async getAllDepartment(req, res) {
    const department = await Department.findAll()
    return res.json(department)
  }

  async deleteStaff(req, res, next) {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);

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


  async updateStaff(req, res, next) {
    try {
      const { id } = req.params;
      const {
        fio,
        login,
        post,
        department,
        telephone,
        email,
        ip,
        tab_num,
      } = req.body;
  
      const updatedFields = {};
  
      if (fio) updatedFields.fio = fio;
      if (login) updatedFields.login = login;
      if (post) updatedFields.post = post;
      if (department) updatedFields.department = department;
      if (telephone) updatedFields.telephone = telephone;
      if (email) updatedFields.email = email;
      if (ip) updatedFields.ip = ip;
      if (tab_num) updatedFields.tab_num = tab_num;
  
      const result = await Staff.update(updatedFields, {
        where: { id },
      });
  
      if (result[0] === 0) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
  
      res.send({ message: "Пользователь успешно обновлён" });
    } catch (err) {
      next(err);
    }
  }
  async import(req, res) {
    try {
      const staffData = req.body;
      await Staff.update(
        { del: 1 },
        { where: {} } // Без условий обновления будут применены ко всем записям
      );
      // Создаем массив промисов для всех операций
      const importPromises = staffData.map(async (item) => {
        // Проверяем существование записи по login или другому уникальному полю
        const existingStaff = await Staff.findOne({
          where: { tab_num: item.tab_num }
        });

        if (existingStaff) {
          // Если запись существует - обновляем, включая установку del = 0
          return Staff.update(
            { ...item, del: 0 }, // Объединение данных из item с новой установкой del
            { where: { tab_num: item.tab_num } }
          );
        } else {
          // Если записи нет - создаем новую с del = 0
          return Staff.create({ ...item, del: 0 });
        }
      });

      // Ждем выполнения всех операций
      await Promise.all(importPromises);

      return res.status(200).json({ message: 'Данные успешно импортированы' });
    } catch (error) {
      console.error('Ошибка при импорте данных:', error);
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StaffController();