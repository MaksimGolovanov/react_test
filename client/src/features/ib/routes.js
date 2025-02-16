import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Ib from './pages/Ib';




const IbRoutes = () => {
  return (
    <Routes>
      <Route path="/ib" element={<PrivateRoute requiredRole={['ADMIN', 'IB']}><Ib /></PrivateRoute>} />

    </Routes>
  );
};

export default IbRoutes; 