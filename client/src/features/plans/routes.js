// src/features/plans/routes.js
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import PlanPage from './pages/PlanPage';

const PlanRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN', 'PLAN_EDITOR']}>
            <PlanPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default PlanRoutes;