import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Staff from './pages/Staff';


const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN', 'USER']}><Staff /></PrivateRoute>} />
    </Routes>
  );
};

export default StaffRoutes;