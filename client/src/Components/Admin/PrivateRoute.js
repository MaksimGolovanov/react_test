import React from 'react';
import { Navigate } from 'react-router-dom';
import userStore from '../Store/UserStore'; // Укажите правильный путь к вашему UserStore

const PrivateRoute = ({ children, requiredRole }) => {
    const userRoles = userStore.userRolesAuth; // Предполагается, что это массив ролей, назначенных пользователю
    
    if (!userStore.isAuthenticated) {
        console.log('Не аутентифицирован');
        return <Navigate to="/login" />; // Перенаправление на страницу входа, если не аутентифицирован
    }

    if (requiredRole && !requiredRole.some(role => userRoles.includes(role))) {
        console.log('Нет доступа');
        return <Navigate to="/" />; // Перенаправление, если у пользователя нет необходимых ролей
    }

    console.log('Доступ разрешен');
    return children; // Разрешить доступ к маршруту
};

export default PrivateRoute;