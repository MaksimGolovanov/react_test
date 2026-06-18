// routes.js
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import ConsumablesList from './pages/ConsumablesList';

const ConsumablesRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN', 'CONSUMABLES']}>
            <ConsumablesList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ConsumablesRoutes;