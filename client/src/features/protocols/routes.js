// src/features/protocols/routes.js
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import ProtocolPage from './pages/ProtocolPage';

const ProtocolRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute requiredRole={['ADMIN', 'PROTOCOL_EDITOR']}>
            <ProtocolPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ProtocolRoutes;
