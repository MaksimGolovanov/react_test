import { Routes, Route } from 'react-router-dom';

import KnowledgeBasePage from './pages/KnowledgeBase';

const KnowledgeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KnowledgeBasePage />} />
    </Routes>
  );
};

export default KnowledgeRoutes;
