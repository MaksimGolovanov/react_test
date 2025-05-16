import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Staff from './pages/Staff';
import StaffSprav from './pages/StaffSprav'
import BadgePage from './pages/BadgePage'


const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN', 'USER']}><Staff /></PrivateRoute>} />
      <Route path="/sprav" element={<PrivateRoute requiredRole={['ADMIN']}><StaffSprav /></PrivateRoute>} />
      <Route path="/badge" element={<BadgePage />} />
    </Routes>
  );
};

export default StaffRoutes;