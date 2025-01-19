import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Car from './pages/Car';
import CarCreate from './pages/CarCreate';
import CarSprav from './pages/CarSprav';

const IusPtRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN']}><Car /></PrivateRoute>} />
      <Route path="/create" element={<PrivateRoute requiredRole={['ADMIN', 'CAR']}><CarCreate /></PrivateRoute>} />
      <Route path="/sprav" element={<PrivateRoute requiredRole={['ADMIN', 'CAR']}><CarSprav /></PrivateRoute>} />
    </Routes>
  );
};

export default IusPtRoutes;