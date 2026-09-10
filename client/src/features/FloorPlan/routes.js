import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import FloorPlan from './pages/FloorPlan';

const FloorPlanRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN', 'USER']}>
            <FloorPlan />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default FloorPlanRoutes;