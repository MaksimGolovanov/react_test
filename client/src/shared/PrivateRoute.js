import React from 'react';
import { Navigate } from 'react-router-dom';
import userStore from '../features/admin/store/UserStore';
import { observer } from 'mobx-react-lite';

const PrivateRoute = observer(({ children, requiredRole }) => {
  const userRoles = userStore.userRolesAuth || [];

  if (!userStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !requiredRole.some((role) => userRoles.includes(role))) {
    // Пытаемся найти первую доступную страницу для пользователя
    const routesPriority = [
      { path: '/staff', roles: ['ADMIN', 'USER'] },
      { path: '/ipaddress', roles: ['ADMIN', 'IP'] },
      { path: '/prints', roles: ['ADMIN', 'PRINT'] },
      { path: '/badges', roles: ['ADMIN', 'BADGES'] },
      { path: '/usb', roles: ['ADMIN', 'USB'] },
      { path: '/card', roles: ['ADMIN', 'CARD'] },
      { path: '/notes', roles: ['ADMIN', 'NOTES'] },
      { path: '/iuspt', roles: ['ADMIN', 'IUSPT'] },
      { path: '/multiedu', roles: ['ADMIN', 'ST', 'ST-ADMIN'] },
      { path: '/admin', roles: ['ADMIN'] },
    ];

    for (const route of routesPriority) {
      if (route.roles.some((role) => userRoles.includes(role))) {
        return <Navigate to={route.path} replace />;
      }
    }

    return <Navigate to="/login" replace />;
  }

  return children;
});

export default PrivateRoute;
