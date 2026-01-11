const { User, Role } = require('../../models/models');
const { STUser } = require('../../models/STModels'); // Предполагаем, что STUser экспортируется из models
const ApiError = require('../../error/ApiError');
const argon2 = require('argon2');

class STController {
  /**
   * Создание записи STUser при создании пользователя с ролью ST/ST-ADMIN
   * Вызывается из основного контроллера пользователей
   */
  async createOrUpdateSTUser(userId, tabNumber, roles, res) {
    try {
      console.log('Creating/updating ST user for:', { userId, tabNumber, roles });

      // Проверяем, есть ли роль ST или ST-ADMIN
      const stRoles = roles.filter(role =>
        role.role === 'ST' || role.role === 'ST-ADMIN' ||
        role === 'ST' || role === 'ST-ADMIN'
      );

      if (stRoles.length === 0) {
        console.log('No ST roles found, skipping ST user creation');
        return null;
      }

      // Проверяем, существует ли уже запись STUser
      let stUser = await STUser.findOne({
        where: { tabNumber }
      });

      if (stUser) {
        // Обновляем существующую запись
        console.log('ST user already exists, updating...');
        await stUser.update({
          updated_at: new Date()
        });
      } else {
        // Создаем новую запись
        console.log('Creating new ST user...');
        stUser = await STUser.create({
          tabNumber,
          userId: userId, // Связываем с основным пользователем
          completed_courses: 0,
          average_score: 0,
          total_training_time: 0
        });
      }

      console.log('ST user created/updated successfully:', stUser.id);
      return stUser;
    } catch (error) {
      console.error('Error in createOrUpdateSTUser:', error);
      if (res) {
        return res.status(500).json({
          message: 'Ошибка при создании/обновлении пользователя обучения'
        });
      }
      throw error;
    }
  }

  /**
   * Создание пользователя из админки обучения
   * Создает пользователя в основной базе с ролью ST/ST-User
   */
  async createUserFromSTAdmin(req, res, next) {
    try {
      const { login, password, description, tabNumber, roles = ['ST'] } = req.body;

      console.log('Creating/updating ST user:', { login, tabNumber, roles });

      if (!login || !password || !tabNumber) {
        return next(ApiError.badRequest('Не заполнены обязательные поля: логин, пароль, табельный номер'));
      }

      // Проверяем, существует ли уже пользователь
      let existingUser = await User.findOne({
        where: { login }
      });

      // Проверяем существующий ST пользователь
      const existingSTUser = await STUser.findOne({
        where: { tabNumber }
      });

      if (existingUser) {
        // Пользователь уже существует - проверяем, есть ли он в ST системе
        if (existingSTUser) {
          return next(ApiError.badRequest('Пользователь с таким табельным номером уже существует в системе обучения'));
        }

        // Проверяем, есть ли у пользователя нужные роли
        const userRoles = await existingUser.getRoles();
        const userRoleNames = userRoles.map(role => role.role);

        // Проверяем, нужно ли добавлять ST роли
        const hasSTRole = roles.some(role =>
          role === 'ST' || role === 'ST-ADMIN'
        );

        if (hasSTRole) {
          // Находим ST роли
          const stRolesToAdd = await Role.findAll({
            where: { role: roles }
          });

          // Добавляем недостающие роли
          await existingUser.addRoles(stRolesToAdd);

          // Проверяем, нужно ли обновить данные пользователя
          const updateData = {};
          if (description !== undefined && description !== existingUser.description) {
            updateData.description = description;
          }
          if (tabNumber && tabNumber !== existingUser.tabNumber) {
            // Проверяем уникальность нового tabNumber
            const userWithSameTab = await User.findOne({ where: { tabNumber } });
            if (userWithSameTab && userWithSameTab.id !== existingUser.id) {
              return next(ApiError.badRequest('Пользователь с таким табельным номером уже существует'));
            }
            updateData.tabNumber = tabNumber;
          }

          if (Object.keys(updateData).length > 0) {
            await existingUser.update(updateData);
          }

          // Обновляем пароль, если он указан
          if (password) {
            const hashPassword = await argon2.hash(password);
            await existingUser.update({ password: hashPassword });
          }

          // Создаем запись в STUser
          const stUser = await STUser.create({
            tabNumber: existingUser.tabNumber || tabNumber,
            userId: existingUser.id,
            completed_courses: 0,
            average_score: 0,
            total_training_time: 0,
            last_course_completed: null
          });

          // Получаем обновленного пользователя с ролями
          const userWithRoles = await User.findOne({
            where: { id: existingUser.id },
            include: [{
              model: Role,
              through: { attributes: [] }
            }]
          });

          return res.status(200).json({
            message: 'Пользователь добавлен в систему обучения',
            user: userWithRoles,
            stUser: stUser
          });
        } else {
          return next(ApiError.badRequest('Существующий пользователь должен иметь роль ST или ST-ADMIN для добавления в систему обучения'));
        }
      } else {
        // Новый пользователь - создаем с нуля

        // Проверка на существующий tabNumber в User
        const userWithSameTab = await User.findOne({ where: { tabNumber } });
        if (userWithSameTab) {
          return next(ApiError.badRequest('Пользователь с таким табельным номером уже существует'));
        }

        // Хеширование пароля
        const hashPassword = await argon2.hash(password);

        // Создаем пользователя в основной базе
        const user = await User.create({
          login,
          password: hashPassword,
          description,
          tabNumber,
        });

        // Находим и назначаем роли
        const dbRoles = await Role.findAll({
          where: { role: roles }
        });

        if (dbRoles.length === 0) {
          return next(ApiError.badRequest('Указанные роли не найдены'));
        }

        await user.setRoles(dbRoles);

        // Создаем запись в STUser
        const stUser = await STUser.create({
          tabNumber,
          userId: user.id,
          completed_courses: 0,
          average_score: 0,
          total_training_time: 0,
          last_course_completed: null
        });

        // Получаем пользователя с ролями
        const userWithRoles = await User.findOne({
          where: { id: user.id },
          include: [{
            model: Role,
            through: { attributes: [] }
          }]
        });

        return res.status(201).json({
          message: 'Пользователь успешно создан в обеих системах',
          user: userWithRoles,
          stUser: stUser
        });
      }

    } catch (error) {
      console.error('Error in createUserFromSTAdmin:', error);
      return next(ApiError.internal('Ошибка при создании пользователя: ' + error.message));
    }
  }

  /**
   * Обновление пользователя из админки обучения
   */
  async updateUserFromSTAdmin(req, res, next) {
    try {
      const { id } = req.params;
      const { login, password, description, tabNumber, roles } = req.body;

      console.log('Update ST user:', { id, login, tabNumber, roles });

      if (!id) {
        return next(ApiError.badRequest('ID пользователя не указан'));
      }

      // Находим ST пользователя
      const stUser = await STUser.findByPk(id);
      if (!stUser) {
        return next(ApiError.notFound('Пользователь обучения не найден'));
      }

      // Находим основного пользователя
      let user = await User.findByPk(stUser.userId ||
        await User.findOne({ where: { tabNumber: stUser.tabNumber } }).then(u => u?.id)
      );

      if (!user) {
        // Если пользователь не найден, но есть ST запись - создаем пользователя
        if (!login || !password) {
          return next(ApiError.badRequest('Для создания пользователя необходимы логин и пароль'));
        }

        // Проверяем уникальность логина
        const existingUser = await User.findOne({ where: { login } });
        if (existingUser) {
          return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
        }

        // Хеширование пароля
        const hashPassword = await argon2.hash(password);

        // Создаем пользователя
        user = await User.create({
          login,
          password: hashPassword,
          description: description || '',
          tabNumber: tabNumber || stUser.tabNumber,
        });

        // Обновляем ST запись с userId
        await stUser.update({ userId: user.id });
      }

      // Обновляем данные пользователя
      const updateData = {};

      if (login && login !== user.login) {
        const existingUser = await User.findOne({ where: { login } });
        if (existingUser && existingUser.id !== user.id) {
          return next(ApiError.badRequest('Пользователь с таким логином уже существует'));
        }
        updateData.login = login;
      }

      if (description !== undefined) {
        updateData.description = description;
      }

      if (password && password.trim()) {
        updateData.password = await argon2.hash(password);
      }

      if (tabNumber && tabNumber !== stUser.tabNumber) {
        // Проверяем уникальность табельного номера
        const existingSTUser = await STUser.findOne({ where: { tabNumber } });
        if (existingSTUser && existingSTUser.id !== id) {
          return next(ApiError.badRequest('Пользователь с таким табельным номером уже существует'));
        }

        const userWithSameTab = await User.findOne({ where: { tabNumber } });
        if (userWithSameTab && userWithSameTab.id !== user.id) {
          return next(ApiError.badRequest('Пользователь с таким табельным номером уже существует в основной системе'));
        }

        updateData.tabNumber = tabNumber;
      }

      // Обновляем пользователя
      if (Object.keys(updateData).length > 0) {
        await user.update(updateData);
      }

      // Обновляем роли
      if (roles && Array.isArray(roles)) {
        const validRoles = ['ST', 'ST-ADMIN', 'USER'];
        const filteredRoles = roles.filter(role => validRoles.includes(role));

        if (filteredRoles.length === 0) {
          return next(ApiError.badRequest('Необходима как минимум одна роль'));
        }

        const dbRoles = await Role.findAll({
          where: { role: filteredRoles }
        });

        await user.setRoles(dbRoles);
      }

      // Обновляем ST пользователя
      const stUpdateData = {};
      if (tabNumber) stUpdateData.tabNumber = tabNumber;

      if (Object.keys(stUpdateData).length > 0) {
        await stUser.update(stUpdateData);
      }

      // Получаем обновленные данные
      const updatedUser = await User.findOne({
        where: { id: user.id },
        include: [{
          model: Role,
          through: { attributes: [] }
        }]
      });

      const updatedSTUser = await STUser.findByPk(id);

      return res.json({
        message: 'Пользователь успешно обновлен',
        user: updatedUser,
        stUser: updatedSTUser
      });

    } catch (error) {
      console.error('Error updating user from ST admin:', error);
      return next(ApiError.internal('Ошибка при обновлении пользователя: ' + error.message));
    }
  }

  // Добавьте эту функцию в STController
  async checkAndCreateSTUser(existingUserId, tabNumber, roles) {
    try {
      // Проверяем, есть ли уже ST запись
      let stUser = await STUser.findOne({
        where: { tabNumber }
      });

      if (!stUser) {
        // Создаем новую ST запись
        stUser = await STUser.create({
          tabNumber,
          userId: existingUserId,
          completed_courses: 0,
          average_score: 0,
          total_training_time: 0,
          last_course_completed: null
        });
        console.log('Created new ST user for existing user:', existingUserId);
      }

      // Проверяем и добавляем ST роли если нужно
      const user = await User.findByPk(existingUserId, {
        include: [{ model: Role }]
      });

      const userRoleNames = user.Roles.map(role => role.role);
      const stRolesToAdd = roles.filter(role =>
        (role === 'ST' || role === 'ST-ADMIN') && !userRoleNames.includes(role)
      );

      if (stRolesToAdd.length > 0) {
        const rolesToAdd = await Role.findAll({
          where: { role: stRolesToAdd }
        });
        await user.addRoles(rolesToAdd);
        console.log('Added ST roles to existing user:', stRolesToAdd);
      }

      return { user, stUser };
    } catch (error) {
      console.error('Error in checkAndCreateSTUser:', error);
      throw error;
    }
  }

  /**
   * Удаление пользователя из админки обучения
   */
  async deleteUserFromSTAdmin(req, res, next) {
    try {
      const { id } = req.params;

      // Находим ST пользователя
      const stUser = await STUser.findByPk(id);
      if (!stUser) {
        return next(ApiError.notFound('Пользователь обучения не найден'));
      }

      // Находим основного пользователя
      const user = await User.findOne({
        where: { tabNumber: stUser.tabNumber }
      });

      if (user) {
        // Удаляем связи с ролями
        await user.setRoles([]);

        // Удаляем основного пользователя
        await user.destroy();
      }

      // Удаляем ST пользователя
      await stUser.destroy();

      return res.json({
        message: 'Пользователь успешно удален из обеих систем'
      });

    } catch (error) {
      console.error('Error deleting user from ST admin:', error);
      return next(ApiError.internal('Ошибка при удалении пользователя: ' + error.message));
    }
  }

  /**
   * Получение всех пользователей обучения
   */
  async getAllSTUsers(req, res, next) {
    try {
      const stUsers = await STUser.findAll({
        order: [['created_at', 'DESC']]
      });

      // Получаем основную информацию о пользователях
      const usersWithDetails = await Promise.all(
        stUsers.map(async (stUser) => {
          const user = await User.findOne({
            where: { tabNumber: stUser.tabNumber },
            include: [{
              model: Role,
              attributes: ['id', 'role'],
              through: { attributes: [] }
            }],
            attributes: ['id', 'login', 'description']
          });

          return {
            ...stUser.toJSON(),
            user: user || null
          };
        })
      );

      return res.json(usersWithDetails);
    } catch (error) {
      console.error('Error getting ST users:', error);
      return next(ApiError.internal('Ошибка при получении пользователей обучения'));
    }
  }

  /**
   * Получение конкретного пользователя обучения
   */
  async getSTUser(req, res, next) {
    try {
      const { id } = req.params;

      const stUser = await STUser.findByPk(id);
      if (!stUser) {
        return next(ApiError.notFound('Пользователь обучения не найден'));
      }

      const user = await User.findOne({
        where: { tabNumber: stUser.tabNumber },
        include: [{
          model: Role,
          attributes: ['id', 'role'],
          through: { attributes: [] }
        }],
        attributes: ['id', 'login', 'description']
      });

      return res.json({
        ...stUser.toJSON(),
        user: user || null
      });
    } catch (error) {
      console.error('Error getting ST user:', error);
      return next(ApiError.internal('Ошибка при получении пользователя обучения'));
    }
  }

  /**
   * Обновление статистики обучения
   */
  async updateTrainingStats(req, res, next) {
    try {
      const { id } = req.params;
      const {
        completed_courses,
        average_score,
        total_training_time,
        last_course_completed
      } = req.body;

      const stUser = await STUser.findByPk(id);
      if (!stUser) {
        return next(ApiError.notFound('Пользователь обучения не найден'));
      }

      const updateData = {};
      if (completed_courses !== undefined) updateData.completed_courses = completed_courses;
      if (average_score !== undefined) updateData.average_score = average_score;
      if (total_training_time !== undefined) updateData.total_training_time = total_training_time;
      if (last_course_completed !== undefined) updateData.last_course_completed = last_course_completed;

      await stUser.update(updateData);

      return res.json({
        message: 'Статистика обучения обновлена',
        stUser: stUser
      });
    } catch (error) {
      console.error('Error updating training stats:', error);
      return next(ApiError.internal('Ошибка при обновлении статистики обучения'));
    }
  }

  /**
   * Вспомогательный метод для проверки, имеет ли пользователь ST роль
   */
  async hasSTRole(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          model: Role,
          attributes: ['role']
        }]
      });

      if (!user) return false;

      return user.Roles.some(role =>
        role.role === 'ST' || role.role === 'ST-ADMIN'
      );
    } catch (error) {
      console.error('Error checking ST role:', error);
      return false;
    }
  }
}

module.exports = new STController();