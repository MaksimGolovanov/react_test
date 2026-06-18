// shared/routesConfig.js
// Единый конфиг маршрутов и прав доступа

export const routesPriority = [
  { path: '/staff', roles: ['ADMIN', 'USER'] },
  { path: '/consumables', roles: ['ADMIN', 'CONSUMABLES'] },
  { path: '/ipaddress', roles: ['ADMIN', 'IP'] },
  { path: '/prints', roles: ['ADMIN', 'PRINT'] },
  { path: '/badges', roles: ['ADMIN', 'BADGES'] },
  { path: '/usb', roles: ['ADMIN', 'USB'] },
  { path: '/card', roles: ['ADMIN', 'CARD'] },
  { path: '/knowledge', roles: ['ADMIN', 'NOTES'] },
  { path: '/iuspt', roles: ['ADMIN', 'IUSPT'] },
  { path: '/transport', roles: ['ADMIN', 'TRANSPORT', 'TRANSPORT-ORDER'] },
  { path: '/map', roles: ['ADMIN', 'MAP'] },
  { path: '/multiedu', roles: ['ADMIN', 'ST', 'ST-ADMIN'] },
  { path: '/admin', roles: ['ADMIN'] },
  { path: '/json', roles: ['ADMIN'] },
];

/**
 * Возвращает первый доступный путь для пользователя на основе его ролей
 * @param {string[]} userRoles - массив ролей пользователя
 * @returns {string} - путь для редиректа
 */
export const getFirstAvailablePath = (userRoles) => {
  if (!userRoles || userRoles.length === 0) {
    return '/login';
  }
  
  for (const route of routesPriority) {
    if (route.roles.some(role => userRoles.includes(role))) {
      return route.path;
    }
  }
  
  return '/login';
};