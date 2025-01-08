import React from 'react';
import { Navigate } from 'react-router-dom';
import userStore from '../Store/UserStore'; // Укажите правильный путь к вашему UserStore

const PrivateRoute = ({ children, requiredRole }) => {
    const userRoles = userStore.userRolesAuth; // Предполагается, что это массив ролей, назначенных пользователю
    
    if (!userStore.isAuthenticated) {
        return <Navigate to="/login" />; // Перенаправление на страницу входа, если не аутентифицирован
    }
    const hasRequiredRole = requiredRole.some(role => userRoles.includes(role));
    // Проверка, есть ли у пользователя необходимая роль
    
    if (requiredRole && !hasRequiredRole) {
        return <Navigate to="/" />; // Перенаправление, если у пользователя нет необходимых ролей
    }

    return children; // Разрешить доступ к маршруту
};

export default PrivateRoute;    