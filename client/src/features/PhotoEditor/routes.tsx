import { Routes, Route } from 'react-router-dom';
import PrivateRouteOriginal from '../../shared/PrivateRoute';
import PhotoEditorPage from './pages/PhotoEditorPage';

// Приводим тип, чтобы принимал children
const PrivateRoute = PrivateRouteOriginal as React.FC<{ requiredRole: string[]; children: React.ReactNode }>;

const PhotoRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PrivateRoute requiredRole={['ADMIN', 'PHOTO']}>
                        <PhotoEditorPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default PhotoRoutes;