import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute'; // Импортируем PrivateRoute
import Notes from './pages/Notes';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';



const NotesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute requiredRole={['ADMIN', 'NOTES']}><Notes /></PrivateRoute>} />
      <Route path="/create-post" element={<PrivateRoute requiredRole={['ADMIN']}><CreatePost /></PrivateRoute>} />
      <Route path="/edit-post/:id" element={<PrivateRoute requiredRole={['ADMIN']}><EditPost /></PrivateRoute>} />
    </Routes>
  );
};

export default NotesRoutes; 