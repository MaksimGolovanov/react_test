import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import IusPt from './pages/IusPt';
import IusPtUser from './pages/IusPtUser';
import IusPtSettings from './pages/IusPtSettings';

const IusPtRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN']}><IusPt /></PrivateRoute>}/>
      <Route path="/edit/:id" element={<PrivateRoute requiredRole={['ADMIN']}><IusPtUser /></PrivateRoute>}/>
      <Route path="/settings" element={<PrivateRoute requiredRole={['ADMIN']}><IusPtSettings /></PrivateRoute>}/>
    </Routes>
  );
};

export default IusPtRoutes;