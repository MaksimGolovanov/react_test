import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Admin from './pages/Admin';
import RoleSprav from './pages/RoleSprav';
import AdminCreate from './pages/AdminCreate';
import AdminEditUser from './pages/AdminEditUser';

const IusPtRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN']}><Admin /></PrivateRoute>} />
      <Route path="/roles" element={<PrivateRoute requiredRole={['ADMIN']}><RoleSprav /></PrivateRoute>} />
      <Route path="/create" element={<PrivateRoute requiredRole={['ADMIN']}><AdminCreate /></PrivateRoute>} />
      <Route path="/edit/:id" element={<PrivateRoute requiredRole={['ADMIN']}><AdminEditUser /></PrivateRoute>} />
    </Routes>
  );
};

export default IusPtRoutes;