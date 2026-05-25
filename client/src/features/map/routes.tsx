// src/modules/Map/routes.tsx
import { Routes, Route } from 'react-router-dom';
import PrivateRouteOriginal from '../../shared/PrivateRoute';
import MapPage from './pages/map';

const PrivateRoute = PrivateRouteOriginal as React.FC<{ requiredRole: string[]; children: React.ReactNode }>;

const MapRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN', 'MAP']}>
            <MapPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default MapRoutes;