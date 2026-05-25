import { Routes, Route } from 'react-router-dom';
import PrivateRouteOriginal from '../../shared/PrivateRoute';
import IpPage from './pages/ipaddress';

// Временно типизируем PrivateRoute
const PrivateRoute = PrivateRouteOriginal as React.FC<{ requiredRole: string[]; children: React.ReactNode }>;

const IpRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN', 'IP']}>
            <IpPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default IpRoutes;