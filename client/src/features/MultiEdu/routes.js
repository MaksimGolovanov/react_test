import { Route, Routes } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import EduAdmin from './pages/EduAdmin';

import UnderDevelopmentPage from './components/categories/UnderDevelopmentPage';

const MultiEduRouters = () => {
  return (
    <Routes>
      <Route index element={<CategoriesPage />} />
      <Route path="courses" element={<CoursesPage />} />
      <Route path="under-development" element={<UnderDevelopmentPage />} />
      <Route path="admin" element={<EduAdmin />} />
      <Route path="course/:courseId" element={<CourseDetailPage />} />
      <Route path="test/:courseId" element={<TestPage />} />
      <Route path="results/:courseId" element={<ResultsPage />} />
    </Routes>
  );
};

export default MultiEduRouters;
