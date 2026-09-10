// src/modules/Naryad/routes.tsx
import { Routes, Route } from 'react-router-dom';
import PrivateRouteOriginal from '../../shared/PrivateRoute';
import OrderPage from './pages/OrderPage';

// Временно типизируем PrivateRoute
const PrivateRoute = PrivateRouteOriginal as React.FC<{ requiredRole: string[]; children: React.ReactNode }>;

const NaryadRoutes: React.FC = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute requiredRole={['ADMIN', 'NARYAD']}>
                        <OrderPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default NaryadRoutes;