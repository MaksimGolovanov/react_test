const { User, Role } = require('../models/models')
const ApiError = require('../error/ApiError')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')

const { createLogger, transports, format } = require('winston')
const logger = createLogger({
     level: 'info',
     format: format.combine(format.timestamp(), format.json()),
     transports: [new transports.File({ filename: 'logs/auth.log' })],
})

// Лимитер для защиты от brute force


class userController {
     async generateTokens(user) {
          const roles = await user.getRoles()
          const roleNames = roles.map((role) => role.role)

          const accessToken = jwt.sign(
               {
                    id: user.id,
                    login: user.login,
                    roles: roleNames,
               },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: '15m' }
          )

          const refreshToken = crypto.randomBytes(40).toString('hex')
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней

          await RefreshToken.create({
               token: refreshToken,
               expiresAt,
               userId: user.id,
          })

          return { accessToken, refreshToken }
     }

     // Обновление токенов
     async refreshTokens(refreshToken) {
          const tokenData = await RefreshToken.findOne({
               where: { token: refreshToken },
               include: [User],
          })

          if (!tokenData || tokenData.expiresAt < new Date()) {
               throw ApiError.unauthorized('Invalid or expired refresh token')
          }

          await tokenData.destroy()
          return this.generateTokens(tokenData.User)
     }
     async registration(req, res, next) {
          try {
               const { login, password, roles, description } = req.body
               console.log('Received registration data:', { login, password, roles, description })

               if (!login || !password) {
                    return next(ApiError.badRequest('Некорректный Логин или Пароль'))
               }

               // Проверка существующего пользователя
               const candidate = await User.findOne({ where: { login } })
               if (candidate) {
                    return next(ApiError.badRequest('Пользователь с таким Логином уже существует'))
               }

               // Хеширование пароля
               const hashPassword = await argon2.hash(password)
               console.log('Password hashed successfully')

               // Создание пользователя
               const user = await User.create({
                    login,
                    password: hashPassword,
                    description,
               })
               console.log('User created:', user.id)

               // Обработка ролей
               if (roles && Array.isArray(roles)) {
                    const roleIds = roles.map((id) => parseInt(id)).filter(Number.isInteger)
                    console.log('Processing roles:', roleIds)

                    if (roleIds.length > 0) {
                         const dbRoles = await Role.findAll({
                              where: { id: roleIds },
                         })
                         console.log(
                              'Found roles:',
                              dbRoles.map((r) => r.id)
                         )

                         await user.setRoles(dbRoles)
                         console.log('Roles assigned successfully')
                    }
               }

               // Получаем обновленного пользователя с ролями
               const userWithRoles = await User.findOne({
                    where: { id: user.id },
                    include: [
                         {
                              model: Role,
                              through: { attributes: [] },
                         },
                    ],
               })

               return res.status(200).json(userWithRoles)
          } catch (error) {
               console.error('Registration error:', error)
               return next(ApiError.internal('Ошибка при регистрации: ' + error.message))
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
                         },
                    ],
                    attributes: ['id', 'login', 'description'],
               })
               console.log(JSON.stringify(users, null, 2)) // Форматируем вывод для удобочитаемости
               return res.json(users)
          } catch (error) {
               console.error('Error:', error)
               throw error
          }
     }

     async deleteUser(req, res, next) {
          const { id } = req.params
          console.log(id)
          try {
               const user = await User.findByPk(id)

               if (!user) {
                    return next(ApiError.notFound('Пользователь не найден'))
               }

               // Удаление связей между пользователем и ролями
               await user.setRoles([]) // Очистка связей с ролями

               // Удаление самого пользователя
               await user.destroy()

               return res.json({ message: 'Пользователь успешно удалён' })
          } catch (error) {
               console.error('Error:', error)
               throw error
          }
     }

     async removeRoleFromUser(req, res, next) {
          try {
               const { userId, roleId } = req.params

               // Находим пользователя по его ID
               let user = await User.findByPk(userId)
               await user.removeRole(roleId)
               res.status(200).json({ message: 'Роль успешно удалена' })
          } catch (error) {
               console.error('Error:', error)
               throw error
          }
     }

     async refresh(req, res, next) {
          try {
               const { refreshToken } = req.cookies

               if (!refreshToken) {
                    return next(ApiError.unauthorized('Refresh token отсутствует'))
               }

               const tokens = await this.refreshTokens(refreshToken)

               res.cookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
               })

               return res.json({ accessToken: tokens.accessToken })
          } catch (error) {
               logger.error(`Refresh token error: ${error.message}`)
               return next(ApiError.unauthorized(error.message))
          }
     }

     async logout(req, res, next) {
          try {
               const { refreshToken } = req.cookies

               if (refreshToken) {
                    await RefreshToken.destroy({ where: { token: refreshToken } })
               }

               res.clearCookie('refreshToken')

               logger.info(`User logged out: ${req.user?.login || 'unknown'}`)

               return res.json({ message: 'Успешный выход из системы' })
          } catch (error) {
               logger.error(`Logout error: ${error.message}`)
               return next(ApiError.internal(error.message))
          }
     }
     async login(req, res, next) {
          try {
               const { login, password } = req.body

               logger.info(`Login attempt for user: ${login} from IP: ${req.ip}`)

               if (!login || !password) {
                    logger.warn('Missing credentials')
                    return next(ApiError.badRequest('Логин и пароль обязательны'))
               }

               const user = await User.findOne({
                    where: { login },
                    include: [
                         {
                              model: Role,
                              attributes: ['role'],
                              through: { attributes: [] },
                         },
                    ],
               })

               if (!user) {
                    logger.warn(`User not found: ${login}`)
                    return next(ApiError.unauthorized('Неверные учетные данные'))
               }

               const isPasswordValid = await argon2.verify(user.password, password)
               if (!isPasswordValid) {
                    logger.warn(`Invalid password for user: ${login}`)
                    return next(ApiError.unauthorized('Неверные учетные данные'))
               }

               const { accessToken, refreshToken } = await this.generateTokens(user)

               logger.info(`Successful login for user: ${login}`)

               res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
               })

               return res.json({
                    accessToken,
                    user: {
                         id: user.id,
                         login: user.login,
                         roles: user.Roles.map((role) => role.role),
                         description: user.description,
                    },
               })
          } catch (error) {
               logger.error(`Login error: ${error.message}`)
               return next(ApiError.internal(error.message))
          }
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
               const { id } = req.params
               const { login, password, description, roles } = req.body

               console.log('Updating user:', { id, login, description, roles })

               const user = await User.findByPk(id)
               if (!user) {
                    return next(ApiError.notFound('Пользователь не найден'))
               }

               // Обновление основных данных пользователя
               const updateData = {
                    login: login || user.login,
                    description: description !== undefined ? description : user.description,
               }

               // Если предоставлен новый пароль, хешируем его
               if (password) {
                    updateData.password = await argon2.hash(password)
               }

               // Обновление данных пользователя
               await user.update(updateData)

               // Обновление ролей, если они предоставлены
               if (roles && Array.isArray(roles)) {
                    const roleIds = roles.map((id) => parseInt(id)).filter(Number.isInteger)
                    const dbRoles = await Role.findAll({
                         where: { id: roleIds },
                    })
                    await user.setRoles(dbRoles)
               }

               // Получаем обновленного пользователя с ролями
               const updatedUser = await User.findOne({
                    where: { id },
                    include: [
                         {
                              model: Role,
                              through: { attributes: [] },
                         },
                    ],
                    attributes: ['id', 'login', 'description'],
               })

               return res.json(updatedUser)
          } catch (error) {
               console.error('Update error:', error)
               return next(ApiError.internal('Ошибка при обновлении пользователя: ' + error.message))
          }
     }
     async checkAuth(req, res, next) {
          try {
               const token = req.headers.authorization?.split(' ')[1] || req.cookies.token

               if (!token) {
                    return next(ApiError.unauthorized('Not authenticated'))
               }

               const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
               const user = await User.findByPk(decoded.id, {
                    include: [
                         {
                              model: Role,
                              attributes: ['role'],
                              through: { attributes: [] },
                         },
                    ],
               })

               if (!user) {
                    return next(ApiError.unauthorized('User not found'))
               }

               const roles = user.Roles.map((role) => role.role)

               return res.json({
                    user: {
                         id: user.id,
                         login: user.login,
                         roles,
                         description: user.description,
                    },
               })
          } catch (error) {
               return next(ApiError.unauthorized('Invalid token'))
          }
     }
}

module.exports = new userController()
