import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import Ib from './pages/ib';
import Instructions from './pages/instructions';
import Memo from './pages/memo';
import SecretsList from './pages/secrets-list';
import LetterView from './pages/letter-view'; // Общий компонент для просмотра писем

const IbRoutes = () => {
  return (
    <Routes>
      <Route path="/ib" element={<PrivateRoute requiredRole={['ADMIN', 'IB']}><Ib /></PrivateRoute>} />
      <Route path="/ib/instructions" element={<PrivateRoute requiredRole={['ADMIN', 'IB']}><Instructions /></PrivateRoute>} />
      <Route path="/ib/memo" element={<PrivateRoute requiredRole={['ADMIN', 'IB']}><Memo /></PrivateRoute>} />
      <Route path="/ib/secrets-list" element={<PrivateRoute requiredRole={['ADMIN', 'IB']}><SecretsList /></PrivateRoute>} />
      <Route path="/ib/letter/:id" element={<PrivateRoute requiredRole={['ADMIN', 'IB']}><LetterView /></PrivateRoute>} />
    </Routes>
  );
};

export default IbRoutes;