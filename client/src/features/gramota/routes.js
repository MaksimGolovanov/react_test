import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import Gramota from './pages/Gramota';

const GramotaRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN']}>
            <Gramota />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default GramotaRoutes;