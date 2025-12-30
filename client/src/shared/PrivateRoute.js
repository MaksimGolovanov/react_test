import React from 'react';
import { Navigate } from 'react-router-dom';
import userStore from '../features/admin/store/UserStore';
import { observer } from 'mobx-react-lite';

const PrivateRoute = observer(({ children, requiredRole }) => {
    const userRoles = userStore.userRolesAuth || [];
    
    console.log(`PrivateRoute check:`, {
        path: window.location.pathname,
        requiredRole,
        userRoles,
        isAuthenticated: userStore.isAuthenticated
    });

    if (!userStore.isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        return <Navigate to="/login" />;
    }

    if (requiredRole && !requiredRole.some(role => userRoles.includes(role))) {
        console.log(`Access denied. Required roles: ${requiredRole}, User roles: ${userRoles}`);
        
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
            { path: '/admin', roles: ['ADMIN'] },
        ];

        for (const route of routesPriority) {
            if (route.roles.some(role => userRoles.includes(role))) {
                console.log(`Redirecting to accessible page: ${route.path}`);
                return <Navigate to={route.path} replace />;
            }
        }

        return <Navigate to="/login" replace />;
    }

    console.log('Access granted');
    return children;
});

export default PrivateRoute;