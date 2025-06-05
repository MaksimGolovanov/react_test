module.exports = function (requiredRoles = []) {
     return function (req, res, next) {
          if (req.method === 'OPTIONS') {
               return next()
          }

          try {
               const authHeader = req.headers.authorization
               if (!authHeader) {
                    return next(ApiError.unauthorized('Authorization header is missing'))
               }

               const [bearer, token] = authHeader.split(' ')
               if (bearer !== 'Bearer' || !token) {
                    return next(ApiError.unauthorized('Invalid authorization header format'))
               }

               const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] })

               // Проверка срока действия токена
               const now = Math.floor(Date.now() / 1000)
               if (decoded.exp && decoded.exp < now) {
                    return next(ApiError.unauthorized('Token expired'))
               }

               req.user = decoded

               if (requiredRoles.length > 0) {
                    const userRoles = decoded.roles || []
                    const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role))
                    if (!hasRequiredRole) {
                         return next(ApiError.forbidden('Insufficient permissions'))
                    }
               }

               next()
          } catch (e) {
               if (e.name === 'TokenExpiredError') {
                    return next(ApiError.unauthorized('Token expired'))
               }
               if (e.name === 'JsonWebTokenError') {
                    return next(ApiError.unauthorized('Invalid token'))
               }
               return next(ApiError.unauthorized('Authentication failed'))
          }
     }
}
