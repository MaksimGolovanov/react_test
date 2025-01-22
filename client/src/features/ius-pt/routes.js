import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import IusPt from './pages/IusPt';


const IusPtRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN']}><IusPt /></PrivateRoute>}/>

    </Routes>
  );
};

export default IusPtRoutes;