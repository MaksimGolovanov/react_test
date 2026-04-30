import { Routes, Route } from 'react-router-dom';
import KnowledgeBasePage from './pages/KnowledgeBase';
import ArticleFormPage from './ui/ArticleFormPage/ArticleFormPage';
import ArticlePage from './pages/ArticlePage';
import CategoriesPage from './pages/CategoriesPage';

const KnowledgeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KnowledgeBasePage />} />
      <Route path="/new" element={<ArticleFormPage />} />
      <Route path="/edit/:id" element={<ArticleFormPage />} />
      <Route path="/article/:id" element={<ArticlePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
    </Routes>
  );
};

export default KnowledgeRoutes;