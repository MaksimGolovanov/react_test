import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Staff from './pages/Staff';
import StaffSprav from './pages/StaffSprav'
import StaffUsser from './pages/StaffUser';
import StaffPSW from './pages/StaffPSW';



const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN', 'USER']}><Staff /></PrivateRoute>} />
      <Route path="/sprav" element={<PrivateRoute requiredRole={['ADMIN']}><StaffSprav /></PrivateRoute>} />
      <Route path="/user" element={<PrivateRoute requiredRole={['ADMIN']}><StaffUsser /></PrivateRoute>} />
      <Route path="/PSW" element={<PrivateRoute requiredRole={['ADMIN']}><StaffPSW /></PrivateRoute>} />
    
    </Routes>
  );
};

export default StaffRoutes;