import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import IusPt from './pages/IusPt';
import IusPtUser from './pages/IusPtUser';



const IusPtRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN']}><IusPt /></PrivateRoute>}/>
      <Route path="/user/:id" element={<PrivateRoute requiredRole={['ADMIN']}><IusPtUser /></PrivateRoute>}/>

    </Routes>
  );
};

export default IusPtRoutes;