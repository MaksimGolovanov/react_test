const { User, Role } = require('../models/models')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const generateJwt = (id, login, roles) => {
  return jwt.sign(
    { id, login, roles },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};
class userController {
  async registration(req, res, next) {
    try {
      const { login, password, roles, description } = req.body;
      console.log('Received registration data:', { login, password, roles, description });

      if (!login || !password) {
        return next(ApiError.badRequest('Некорректный Логин или Пароль'));
      }

      // Проверка существующего пользователя
      const candidate = await User.findOne({ where: { login } });
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким Логином уже существует'));
      }

      // Хеширование пароля
      const hashPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');

      // Создание пользователя
      const user = await User.create({
        login,
        password: hashPassword,
        description
      });
      console.log('User created:', user.id);

      // Обработка ролей
      if (roles && Array.isArray(roles)) {
        const roleIds = roles.map(id => parseInt(id)).filter(Number.isInteger);
        console.log('Processing roles:', roleIds);

        if (roleIds.length > 0) {
          const dbRoles = await Role.findAll({
            where: { id: roleIds }
          });
          console.log('Found roles:', dbRoles.map(r => r.id));

          await user.setRoles(dbRoles);
          console.log('Roles assigned successfully');
        }
      }

      // Получаем обновленного пользователя с ролями
      const userWithRoles = await User.findOne({
        where: { id: user.id },
        include: [{
          model: Role,
          through: { attributes: [] }
        }]
      });

      return res.status(200).json(userWithRoles);
    } catch (error) {
      console.error('Registration error:', error);
      return next(ApiError.internal('Ошибка при регистрации: ' + error.message));
    }
  }
  async getUsersWithRoles(req, res, next) {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            attributes: ['role'],
            through: { attributes: [] },
          }
        ],
        attributes: ['id', 'login', 'description']
      });
      console.log(JSON.stringify(users, null, 2)); // Форматируем вывод для удобочитаемости
      return res.json(users);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async deleteUser(req, res, next) {
    const { id } = req.params;
    console.log(id);
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return next(ApiError.notFound('Пользователь не найден'));
      }

      // Удаление связей между пользователем и ролями
      await user.setRoles([]); // Очистка связей с ролями

      // Удаление самого пользователя
      await user.destroy();

      return res.json({ message: 'Пользователь успешно удалён' });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async removeRoleFromUser(req, res, next) {
    try {
      const { userId, roleId } = req.params;


      // Находим пользователя по его ID
      let user = await User.findByPk(userId);
      await user.removeRole(roleId);
      res.status(200).json({ message: 'Роль успешно удалена' });

    } catch (error) {
      console.error('Error:', error);
      throw error;

    }
  }

  async login(req, res) {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: 'Указан неверный пароль' });
    }
    const roles = await user.getRoles();
    
    const roleNames = roles.map(role => role.role);
    
    const token = generateJwt(user.id, user.login, roleNames);
    return res.json({ token , user:{roleNames}});
  }

  async getAll(req, res) {
    const users = await User.findAll()
    return res.json(users)
  }

  async roleAdd(req, res, next) {
    const { role, description } = req.body

    const candidate = await Role.findOne({ where: { role } })
    if (candidate) {
      return next(ApiError.badRequest('Такая роль уже существует'))
    }

    const roles = await Role.create({ role, description })
    return res.json(roles)
  }

  async getRole(req, res) {
    const roles = await Role.findAll()
    return res.json(roles)
  }
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { login, password, description, roles } = req.body;

      console.log('Updating user:', { id, login, description, roles });

      const user = await User.findByPk(id);
      if (!user) {
        return next(ApiError.notFound('Пользователь не найден'));
      }

      // Обновление основных данных пользователя
      const updateData = {
        login: login || user.login,
        description: description !== undefined ? description : user.description,
      };

      // Если предоставлен новый пароль, хешируем его
      if (password) {
        updateData.password = await bcrypt.hash(password, 5);
      }

      // Обновление данных пользователя
      await user.update(updateData);

      // Обновление ролей, если они предоставлены
      if (roles && Array.isArray(roles)) {
        const roleIds = roles.map(id => parseInt(id)).filter(Number.isInteger);
        const dbRoles = await Role.findAll({
          where: { id: roleIds }
        });
        await user.setRoles(dbRoles);
      }

      // Получаем обновленного пользователя с ролями
      const updatedUser = await User.findOne({
        where: { id },
        include: [{
          model: Role,
          through: { attributes: [] }
        }],
        attributes: ['id', 'login', 'description']
      });

      return res.json(updatedUser);
    } catch (error) {
      console.error('Update error:', error);
      return next(ApiError.internal('Ошибка при обновлении пользователя: ' + error.message));
    }
  }
}

module.exports = new userController();