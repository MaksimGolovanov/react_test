import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../../shared/PrivateRoute';
import Notes from './pages/Notes';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import ViewPost from './pages/ViewPost';

const NotesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute requiredRole={['ADMIN', 'NOTES']}>
          <Notes />
        </PrivateRoute>
      } />
      <Route path="/create-post" element={
        <PrivateRoute requiredRole={['ADMIN']}>
          <CreatePost />
        </PrivateRoute>
      } />
      <Route path="/edit-post/:id" element={
        <PrivateRoute requiredRole={['ADMIN']}>
          <EditPost />
        </PrivateRoute>
      } />
      <Route path="/view/:id" element={
        <PrivateRoute requiredRole={['ADMIN', 'NOTES']}>
          <ViewPost />
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default NotesRoutes;