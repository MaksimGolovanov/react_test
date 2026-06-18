// shared/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import userStore from '../features/admin/store/UserStore';
import { getFirstAvailablePath } from './routesConfig';

const PrivateRoute = observer(({ children, requiredRole }) => {
  // Ждем инициализации
  if (!userStore.initialized || userStore.loading) {
    return <Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />;
  }

  const userRoles = userStore.userRolesAuth || [];

  // Не авторизован
  if (!userStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Проверка ролей
  if (requiredRole && requiredRole.length > 0) {
    const hasRequiredRole = requiredRole.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      const firstPath = getFirstAvailablePath(userRoles);
      return <Navigate to={firstPath} replace />;
    }
  }

  return children;
});

export default PrivateRoute;