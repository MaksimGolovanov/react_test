import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import IusPt from './pages/IusPt';
import IusPtUser from './pages/IusPtUser';
import IusSprav from './pages/IusSprav';
import IusUserApplication from './pages/IusUserApplication';




const IusPtRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN']}><IusPt /></PrivateRoute>}/>
      <Route path="/user/:tabNumber" element={<PrivateRoute requiredRole={['ADMIN']}><IusPtUser /></PrivateRoute>}/>
      <Route path="/sprav" element={<PrivateRoute requiredRole={['ADMIN']}><IusSprav /></PrivateRoute>}/>
      <Route path="/user-application/:tabNumber" element={<PrivateRoute requiredRole={['ADMIN']}><IusUserApplication /></PrivateRoute>}/>
    </Routes>
  );
};

export default IusPtRoutes;