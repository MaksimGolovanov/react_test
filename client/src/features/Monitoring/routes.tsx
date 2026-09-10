// src/modules/Monitoring/routes.tsx

import { Routes, Route } from 'react-router-dom';
import PrivateRouteOriginal from '../../shared/PrivateRoute';
import MonitoringPage from './pages/MonitoringPage';

// Приводим тип, чтобы TypeScript понимал пропсы
const PrivateRoute = PrivateRouteOriginal as React.FC<{
  requiredRole: string[];
  children: React.ReactNode;
}>;

const MonitoringRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN']}>
            <MonitoringPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default MonitoringRoutes;
